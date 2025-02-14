import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';

import {AuthData} from './auth-data.model';
import {environment} from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/user/';
console.log(BACKEND_URL);

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private token: string;
    private isAuthenticated = false;
    private authStatusListener =  new Subject<boolean>();
    private userId: string;
    private tokenTimer: any;

    constructor(private http: HttpClient, private router: Router) {}

    createUser(email: string, password: string) {
        const authData: AuthData = {email: email, password: password};
        return this.http.post(BACKEND_URL + 'signup', authData )
            .subscribe(response => {
                this.router.navigate(['/']);
            }, error => {
                this.authStatusListener.next(false);
            });
    }

    login(email: string, password: string) {
        const authData: AuthData = {email: email, password: password};
        this.http
            .post<{token: string, expiresIn: number, userId: string}>(
                BACKEND_URL + 'login',
                authData
            )
            .subscribe(response => {
                this.token = response.token;
                if (this.token) {
                    const expiresInDuration = response.expiresIn;
                    this.isAuthenticated = true;
                    this.userId = response.userId;
                    this.setAuthTimer(expiresInDuration);
                    persistLoginToken(this.token, expiresInDuration);
                    this.authStatusListener.next(true);
                    this.router.navigate(['/']);
                }
            }, error => {
                this.authStatusListener.next(false);
            });

        const persistLoginToken = (token, duration) => {
            const now = new Date();
            const expirationDate = new Date(now.getTime() + duration * 1000);
            this.saveAuthData(token, expirationDate, this.userId);
        };
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.userId = null;
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
            this.userId = authInformation.userId;
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

    getUserId() {
        return this.userId;
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

    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        if (!token || !expirationDate) {
            return;
        }

        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        };
    }

}
