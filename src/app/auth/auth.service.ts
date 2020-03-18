import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';

import {AuthData} from './auth-data.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private token: string;
    private isAuthenticated = false;
    private authStatusListener =  new Subject<boolean>();
    private tokenTimer: any;

    constructor(private http: HttpClient, private router: Router) {}

    createUser(email: string, password: string) {
        const authData: AuthData = {email: email, password: password};
        this.http.post('http://localhost:3000/api/user/signup', authData )
            .subscribe(response => {
                console.log(response);
            });
    }

    login(email: string, password: string) {
        const authData: AuthData = {email: email, password: password};
        this.http.post<{token: string, expiresIn: number}>('http://localhost:3000/api/user/login', authData )
            .subscribe(response => {
                this.token = response.token;
                if (this.token) {
                    const expiresInDuration = response.expiresIn;
                    this.isAuthenticated = true;
                    this.setAuthTimer(expiresInDuration);
                    persistLoginToken(this.token, expiresInDuration);
                    this.authStatusListener.next(true);
                    this.router.navigate(['/']);
                }
            });

        const persistLoginToken = (token, duration) => {
            const now = new Date();
            const expirationDate = new Date(now.getTime() + duration * 1000);
            this.saveAuthData(token, expirationDate);
        };
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.authStatusListener.next(false);
        this.router.navigate(['/']);
    }

    autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation) {
            return;
        }

        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            // token is not expired
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    getToken() {
        return this.token;
    }

    getIsAuthenticated() {
        return this.isAuthenticated;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    // Helper functions

    private setAuthTimer = (tokenExpiresInMilliSeconds: number) => {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, tokenExpiresInMilliSeconds * 1000);
    }

    private saveAuthData(token: string, expirationDate: Date) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        if (!token || !expirationDate) {
            return;
        }

        return {
            token: token,
            expirationDate: new Date(expirationDate)
        };
    }

}
