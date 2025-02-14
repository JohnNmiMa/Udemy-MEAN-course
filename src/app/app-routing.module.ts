import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";

import { PostListComponent} from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import {AuthGuard} from './auth/auth.guard';

const routes: Routes = [
    { path: '', component: PostListComponent },
    { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
    { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
    { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) } // alternative syntax - this works
    // { path: 'auth', loadChildren: './auth/auth-module#AuthModule' } // all routes registered here are lazy loaded
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ],
    providers: [AuthGuard]
})
export class AppRoutingModule {}
