import { API_URL } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponse {
  name: string;
  message: string;
  image: string | null;
  userId: number;
  expiresIn: number;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  // initialUser = new User(0, '', null, '', new Date());
  user = new BehaviorSubject<User | null>(null);
  tokenExpirationTimer: any;

  register(name: string, email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${API_URL}/register`, {
        name,
        email,
        password,
      })
      .pipe(catchError(this.handleError));
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${API_URL}/login`, {
        email,
        password,
      })
      .pipe(
        catchError(this.handleError),
        tap((res) => {
          this.handleAuthentication(
            res.userId,
            res.name,
            res.image,
            res.token,
            res.expiresIn
          );
        })
      );
  }

  loginWithGoogle() {
   window.location.href=`${API_URL}/auth/google`
  }

  loginWithGitHub() {
   window.location.href=`${API_URL}/auth/github`
  }

  autoLogIn() {
    const userDate = localStorage.getItem('userData');
    const loadedUser = userDate ? JSON.parse(userDate) : null;

    if (!loadedUser) return;

    let currentUser = new User(
      loadedUser.id,
      loadedUser.name,
      loadedUser.image,
      loadedUser._token,
      new Date(loadedUser._tokenExpirationDate)
    );

    if (currentUser.token) {
      this.user.next(currentUser);

      const expirationDuration =
        new Date(loadedUser._tokenExpirationDate).getTime() -
        new Date().getTime();

      this.autoLogOut(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogOut(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleError(errRes: HttpErrorResponse) {
    let errorMessage = `Unknown Error occured!`;
    console.log(errRes);
    if (!errRes.error || !errRes.error.error) {
      return throwError(errorMessage);
    }
    errorMessage = errRes.error.error;
    return throwError(errorMessage);
  }

  private handleAuthentication(
    userId: number,
    name: string,
    image: string | null,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

    let user = new User(userId, name, image, token, expirationDate);

    this.user.next(user);

    this.autoLogOut(expiresIn * 1000);

    localStorage.setItem('userData', JSON.stringify(user));
  }
}
