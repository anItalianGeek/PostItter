import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly url: string = "http://localhost:5265";

  constructor(private http: HttpClient, private router: Router) {
  }

  // POST the login request to the server and get a token
  logIn(payload: LoginUserInput): Observable<any> {
    return this.http.post('http://localhost:5265/api/login', payload, {observe: 'response'});
  }

  logInWith2faCode(code: string): Observable<JwtWebToken> {
    let params = new HttpParams().set('email_active_use', localStorage.getItem('temp-email') || "")
    return this.http.post<JwtWebToken>('http://localhost:5265/api/2fa/authenticate', code, {params: params});
  }

  // POST the sign-up request
  signUp(payload: LoginUserInput): Observable<JwtWebToken> {
    return this.http.post<JwtWebToken>(this.url + '/api/authguard/signup', payload);
  }

  // when the user wants to log out, simply delete the auth-token existing
  logOut() {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    this.http.delete(this.url + '/api/authguard/logout', {headers});
    localStorage.removeItem('auth-token');
    this.router.navigateByUrl('/login');
  }

  // GET information about a desired username, whether it is available or not
  checkUsenameAvailability(username: string): Observable<boolean> {
    let params = new HttpParams().set('name', username);
    return this.http.get<boolean>(this.url + 'api/authguard/check', {params: params});
  }

  requestPasswordRecovery(recoveryEmail: string) {
    this.http.post(this.url + 'api/PasswordRecovery/requestChange', recoveryEmail);
  }
}

export interface LoginUserInput {
  email: string;
  password: string;
  username?: string;
  displayName?: string;
}

export interface JwtWebToken {
  sub: string;
  username: string;
  displayName: string;
  iat: Date;
  exp: Date;
  server_signature: string;
}
