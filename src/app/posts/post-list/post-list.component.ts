import {Component, Input, OnDestroy, OnInit} from '@angular/core';

import { Post } from '../post.model'
import {PostsService} from '../posts.service';
import {Subscription} from 'rxjs';
import {PageEvent} from '@angular/material/paginator';
import {AuthService} from '../../auth/auth.service';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
    posts: Post[] = [];
    isLoading = false;
    totalPosts = 0;
    postsPerPage = 5;
    currentPage = 1;
    pageSizeOptions = [1, 2, 5, 10];
    userIsAuthenticated = false;
    private postSub: Subscription;
    private authStatusSub: Subscription;

    constructor(public postsService: PostsService, private authService: AuthService) {
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.postsService.getPosts(this.postsPerPage, 1);
        this.postSub =  this.postsService.getPostUpdateListener().subscribe((postData: { posts: Post[], postCount: number}) => {
            this.isLoading = false;
            this.totalPosts = postData.postCount;
            this.posts = postData.posts;
        });

        this.userIsAuthenticated = this.authService.getIsAuthenticated();

        // Catch if user is authenticated/logged in.
        this.authStatusSub = this.authService
            .getAuthStatusListener()
            .subscribe(isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated;
            });
    }

    onChangedPage(pageData: PageEvent) {
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }

    onDelete(postId: string) {
        this.isLoading = true;
        this.postsService.deletePost(postId).subscribe(() => {
            this.isLoading = false;
            this.postsService.getPosts(this.postsPerPage, this.currentPage);
        });
    }

    ngOnDestroy(): void {
        this.postSub.unsubscribe();
        this.authStatusSub.unsubscribe();
    }

}
