import {Injectable} from '@angular/core';
import {
  AuthRequest,
  UserDetail,
  UserList,
  UserLock,
  UserPasswordReset,
  UserPoints,
  UserSearch
} from '../dtos/auth-request';
import {Observable, switchMap} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {jwtDecode} from 'jwt-decode';
import {Globals} from '../global/globals';
import {formatDate} from "@angular/common";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authBaseUri: string = this.globals.backendUri + '/authentication';

  constructor(private httpClient: HttpClient, private globals: Globals) {
  }

  /**
   * Login in the user. If it was successful, a valid JWT token will be stored
   *
   * @param authRequest User data
   */
  loginUser(authRequest: AuthRequest): Observable<string> {
    return this.httpClient.post(this.authBaseUri, authRequest, {responseType: 'text'})
      .pipe(
        tap((authResponse: string) => this.setToken(authResponse))
      );
  }

  registerUser(userDetail: UserDetail): Observable<string> {
    return this.httpClient.post(`${this.authBaseUri}/register`, userDetail, { responseType: 'text' });
  }

  adminRegisterUser(userDetail: UserDetail): Observable<string> {
    return this.httpClient.post(`${this.authBaseUri}/adminregister`, userDetail, { responseType: 'text' });
  }

  getUser(userId: string): Observable<UserDetail> {
    console.log(userId);
    return this.httpClient.get<UserDetail>(`${this.authBaseUri}/user/${userId}`);
  }

  editUser(userDetail: UserDetail): Observable<string> {
    return this.httpClient.put(`${this.authBaseUri}/user/${userDetail.userId}`, userDetail, { responseType: 'text' });
  }

  deleteUser(userId: string): Observable<any> {
    return this.httpClient.delete(`${this.authBaseUri}/user/${userId}`, { responseType: 'text' });
  }

  toggleAccountLock(userLock: UserLock): Observable<string> {
    return this.httpClient.put(`${this.authBaseUri}/toggle-lock`, userLock, { responseType: 'text' });
  }

  getUserId(): Observable<string> {
    console.log("Get user id");
    return this.httpClient.put(`${this.authBaseUri}/get-id`, this.getUserEmail(), {responseType: 'text'});
  }

  requestReset(authRequest: AuthRequest): Observable<string> {
    return this.httpClient.post(`${this.authBaseUri}/request-password-reset`,authRequest, {responseType: 'text'});
  }

  adminRequestReset(authRequest: AuthRequest): Observable<string> {
    return this.httpClient.post(`${this.authBaseUri}/admin-reset-user-password`, authRequest, {responseType: 'text'});
  }

  resetPassword(userPasswordRest: UserPasswordReset): Observable<string> {
    return this.httpClient.put(`${this.authBaseUri}/reset-password`, userPasswordRest, {responseType: 'text'});
  }

  search(searchParams: UserSearch): Observable<UserList[]> {
    if (searchParams == null) {
      return this.httpClient.get<UserList[]>(`${this.authBaseUri}/users`);
    }
    let params: HttpParams = new HttpParams();
    if (searchParams.email && searchParams.email !== '') {
      params = params.append('email', searchParams.email);
    }
    if (searchParams.firstName && searchParams.firstName !== '') {
      params = params.append('firstName', searchParams.firstName);
    }
    if (searchParams.lastName && searchParams.lastName !== '') {
      params = params.append('lastName', searchParams.lastName);
    }
    if (searchParams.phoneNumber && searchParams.phoneNumber !== '') {
      params = params.append('phoneNumber', searchParams.phoneNumber);
    }
    if (searchParams.address && searchParams.address !== '') {
      params = params.append('address', searchParams.address);
    }
    if (searchParams.earliestDate) {
      params = params.append('earliestDate', formatDate(searchParams.earliestDate, 'yyyy-MM-dd', 'en-DK'));
    }
    if (searchParams.latestDate) {
      params = params.append('latestDate', formatDate(searchParams.latestDate, 'yyyy-MM-dd', 'en-DK'));
    }
    if (searchParams.admin !== null) {
      params = params.append('admin', searchParams.admin);
    }
    if (searchParams.accountLocked !== null) {
      params = params.append('accountLocked', searchParams.accountLocked);
    }

    return this.httpClient.get<UserList[]>(`${this.authBaseUri}/users?${params}`);
  }

  /**
   * Check if a valid JWT token is saved in the localStorage
   */
  isLoggedIn() {
    return !!this.getToken() && (this.getTokenExpirationDate(this.getToken()).valueOf() > new Date().valueOf());
  }

  logoutUser() {
    localStorage.removeItem('authToken');
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * Returns the user role based on the current token
   */
  getUserRole() {
    if (this.getToken() != null) {
      const decoded: any = jwtDecode(this.getToken());
      const authInfo: string[] = decoded.rol;
      if (authInfo.includes('ROLE_ADMIN')) {
        return 'ADMIN';
      } else if (authInfo.includes('ROLE_USER')) {
        return 'USER';
      }
    }
    return 'UNDEFINED';
  }

  /**
   * Returns the user email based on the current token
   */
  getUserEmail(): string {
    let token = this.getToken();
    if(token == null) return null;

    const decoded: any = jwtDecode(token);
    return decoded.sub;
  }

  /**
   * Returns the user points based on the user ID
   */
  getUserPoints(userId: string): Observable<UserPoints> {
    return this.httpClient.get<UserPoints>(`${this.authBaseUri}/user/${userId}/points`);
  }

  /**
   * Returns the user points based on the current token (email -> user ID -> points)
   */
  getUserPointsByEmail(): Observable<UserPoints> {
    return this.getUserId().pipe(
      switchMap(userId => this.getUserPoints(userId))
    );
  }

  decodeToken(token: string): string {
    if(token == null) return null;

    const decoded: any = jwtDecode(token);
    return decoded.sub;
  }


  private setToken(authResponse: string) {
    localStorage.setItem('authToken', authResponse);
  }

  private getTokenExpirationDate(token: string): Date {

    const decoded: any = jwtDecode(token);
    if (decoded.exp === undefined) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

}
