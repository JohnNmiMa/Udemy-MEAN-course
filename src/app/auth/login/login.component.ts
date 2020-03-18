import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';


@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    isLoading = false;

    constructor(private authService: AuthService) {
    }

    ngOnInit(): void {
    }

    onLogin(form: NgForm) {
        this.isLoading = true;
        if (form.invalid) {
            return;
        }
        this.authService.login(form.value.email, form.value.password);
    }

}
