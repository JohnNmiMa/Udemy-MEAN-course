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
    private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

    constructor(private http: HttpClient, private router: Router) {}

    getPosts(postPerPage: number, currentPage: number) {
        const queryParams = `?pageSize=${postPerPage}&page=${currentPage}`;
        this.http
            .get<{ message: string, posts: any, maxPosts: number }>( `http://localhost:3000/api/posts${queryParams}`)
            .pipe(map(postData => {
                return {
                    posts: postData.posts.map(post => {
                        return {
                            title: post.title,
                            content: post.content,
                            id: post._id,
                            imagePath: post.imagePath
                        };
                    }),
                    maxPosts: postData.maxPosts
                };
            }))
            .subscribe((transformedPostsData) => {
                this.posts = transformedPostsData.posts;
                this.postsUpdated.next({
                    posts: [...this.posts],
                    postCount: transformedPostsData.maxPosts
                });
            }
        );
    }

    getPost(postId: string) {
        return this.http
            .get<{_id: string, title: string, content: string, imagePath: string}>(
                `http://localhost:3000/api/posts/${postId}`
            );
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
                this.router.navigate(['/']);
            });
    }

    deletePost(postId: string) {
        return this.http.delete<{message: string}>(`http://localhost:3000/api/posts/${postId}`);
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

}
