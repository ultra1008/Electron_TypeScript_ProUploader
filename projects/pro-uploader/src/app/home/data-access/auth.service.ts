import { $pf, LoginRequest, LoginResponse, LoginType } from 'pfshared/pfapi';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, map, Observable, throwError } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private $http: HttpClient) { }

  autoLogin(): Observable<User> {
    const url = `${$pf.apiUrl}/signin`;
    const user = this.getUserFromLocalStorage();

    if (user) {
      let request: LoginRequest = {
        DealerCode: user.DealerCode,
        UserName: user.UserName,
        AccessToken: user.AuthorizationKey,
        SourceApplication: "PRO Uploader",
        LoginType: LoginType.Api
      };

      return this.$http.post<LoginResponse>(url, request).pipe(
        map((loginResponse) => new User(loginResponse.DealerCode, loginResponse.UserName, loginResponse.AuthorizationKey)),
      );
    }

    return throwError(() => new Error("Not authorized"));
  }

  login(dealerCode: string, username: string, password: string, rememberMe: boolean): Observable<User> {
    const url = `${$pf.apiUrl}/signin`;

    let request: LoginRequest = {
      DealerCode: dealerCode,
      UserName: username,
      Password: password,
      AccessToken: $pf.apiKey,
      Persist: rememberMe,
      SourceApplication: "PRO Uploader",
      LoginType: LoginType.Dealer
    };

    return this.$http.post<LoginResponse>(url, request).pipe(
      map((loginResponse) => {
        let user = new User(loginResponse.DealerCode, loginResponse.UserName, loginResponse.AuthorizationKey);
        if (rememberMe) {
          this.setUserInLocalStorage(user);
        }
        return user;
      })
    );
  }

  setUserInLocalStorage(user: User) {
    localStorage.setItem('userData', JSON.stringify(user));
  }

  getUserFromLocalStorage(): User {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const user = new User(userData.dealerCode, userData.username, userData.authorizationKey);
      return user;
    }
    return null;
  }

  logout(): Observable<void> {
    const user = this.getUserFromLocalStorage();

    if (user) {
      localStorage.removeItem('userData');
      const url = `${$pf.apiUrl}/signout/${user.AuthorizationKey}`;
      return this.$http.delete<void>(url, {});
    }

    return EMPTY;
  }
}