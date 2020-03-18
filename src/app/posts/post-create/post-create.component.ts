import {Component, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, ParamMap} from '@angular/router';

import {PostsService} from '../posts.service';
import {Post} from '../post.model';
import { mimeType } from './mime-type.validator';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
    public post: Post;
    public isLoading = false;
    public form: FormGroup;
    public imagePreview: string;
    public mode = 'create';
    private postId: string;

    constructor(public postsService: PostsService, public route: ActivatedRoute) {
    }

    ngOnInit(): void {
        // Setup an Angular reactive form to create posts
        this.form = new FormGroup({
            title: new FormControl(null, {
                validators: [Validators.required, Validators.minLength(3)]
            }),
            content: new FormControl(null, {
                validators: [Validators.required]
            }),
            image: new FormControl(null, {
                validators: [Validators.required],
                asyncValidators: [mimeType]
            })
        });

        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('postId')) {
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                this.isLoading = true;
                this.postsService.getPost(this.postId)
                    .subscribe(postData => {
                        this.isLoading = false;
                        this.post = {
                            id: postData._id,
                            title: postData.title,
                            content: postData.content,
                            imagePath: postData.imagePath
                        };
                        this.form.setValue({
                            title: this.post.title,
                            content: this.post.content,
                            image: this.post.imagePath
                        });
                    });
            } else {
                this.mode = 'create';
                this.postId = null;
            }
        });
    }

    onSavePost() {
        if (this.form.invalid) {
            return;
        }

        this.isLoading = true;
        if (this.mode === 'create') {
            this.postsService.addPost(
                this.form.value.title,
                this.form.value.content,
                this.form.value.image);
            this.form.reset();
        } else {
            this.postsService.updatePost(
                this.postId,
                this.form.value.title,
                this.form.value.content,
                this.form.value.image);
        }
    }

    onImagePicked(event: Event) {
        // Get access to the picked file
        const file = (event.target as HTMLInputElement).files[0];

        // Store the file in a FormControl
        this.form.patchValue({ image: file });

        // Inform Angular that you changed the 'image' value, that is should re-evalute and store
        // the value internally, and check if the patched value is valid.
        // This will run our asynchronous validator mime-type.validator.ts
        this.form.get('image').updateValueAndValidity();

        // Convert image to something that can be displayed.
        const reader = new FileReader();
        reader.onload = () => {
            // This callback is called when the file is done loading the file.
            this.imagePreview = reader.result as string;
        };

        // Start the process to load the file.
        reader.readAsDataURL(file);
    }

}
