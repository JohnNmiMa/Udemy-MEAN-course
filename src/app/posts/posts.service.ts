import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

import {Post} from './post.model';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient, private router: Router) {}

    getPosts() {
        this.http.get<{ message: string, posts: any }>( 'http://localhost:3000/api/posts' )
            .pipe(map((postData) => {
                return postData.posts.map(post => {
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id
                    }
                })
            }))
            .subscribe((transformedPosts) => {
                this.posts = transformedPosts;
                this.postsUpdated.next([...this.posts]);
            }
        )
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    addPost(title: string, content: string) {
        const post:Post = {id: null, title: title, content: content};
        this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
            .subscribe((responseData) => {
                post.id = responseData.postId;
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(['/']);
            }
        );
    }

    updatePost(postId: string, title: string, content: string) {
        const post: Post = { id: postId, title: title, content: content};
        this.http.put<{message: string}>(`http://localhost:3000/api/posts/${postId}`, post)
            .subscribe((responseData) => {
                this.router.navigate(['/']);
            })
    }

    deletePost(postId: string) {
        this.http.delete<{message: string}>(`http://localhost:3000/api/posts/${postId}`)
            .subscribe((response) => {
                this.posts = this.posts.filter(post => post.id !== postId);
                this.postsUpdated.next([...this.posts]);
            })
    }

    getPost(postId: string) {
        return this.http.get<{_id: string, title: string, content: string}>(
            `http://localhost:3000/api/posts/${postId}`
        );
    }
}
