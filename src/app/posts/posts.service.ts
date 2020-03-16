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
        this.http
            .get<{ message: string, posts: any }>( 'http://localhost:3000/api/posts' )
            .pipe(map((postData) => {
                return postData.posts.map(post => {
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id,
                        imagePath: post.imagePath
                    };
                });
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

    addPost(title: string, content: string, image: File) {
        // const post:Post = {id: null, title: title, content: content};

        // A javascript object that allows us to combine text values and blob values
        // The text inputs typed in by the user, plus the files chosen by the user.
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);
        this.http
            .post<{message: string, post: Post}>(
                'http://localhost:3000/api/posts',
                postData
            )
            .subscribe((responseData) => {
                const post: Post = {
                    id: responseData.post.id,
                    title: title,
                    content: content,
                    imagePath: responseData.post.imagePath
                };
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(['/']);
            }
        );
    }

    updatePost(postId: string, title: string, content: string, image: File | string) {
        let postData: Post | FormData;
        if (typeof(image) === 'object') {
            postData = new FormData();
            postData.append('id', postId);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image, title);
        } else {
            postData = {
                id: postId,
                title: title,
                content: content,
                imagePath: image
            };
        }
        this.http
            .put<{message: string}>(`http://localhost:3000/api/posts/${postId}`, postData)
            .subscribe((responseData) => {
                const updatedPosts = [...this.posts];
                const oldPostIndex = updatedPosts.findIndex(p => p.id === postId);
                const post: Post = {
                    id: postId,
                    title: title,
                    content: content,
                    imagePath: ''
                };
                updatedPosts[oldPostIndex] = post;
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(['/']);
            });
    }

    deletePost(postId: string) {
        this.http
            .delete<{message: string}>(`http://localhost:3000/api/posts/${postId}`)
            .subscribe((response) => {
                this.posts = this.posts.filter(post => post.id !== postId);
                this.postsUpdated.next([...this.posts]);
            });
    }

    getPost(postId: string) {
        return this.http
            .get<{_id: string, title: string, content: string, imagePath: string}>(
            `http://localhost:3000/api/posts/${postId}`
        );
    }
}
