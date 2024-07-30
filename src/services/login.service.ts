import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url: string = "http://192.168.31.200";

  constructor(private http: HttpClient, private router: Router, private userService: UserService) {
  }

  // POST the login request to the server and get a token
  logIn(payload: { email: string, password: string, username?: string, displayName?: string }): void {
    this.http.post<{
      token: string
    }>(this.url + '/api/login', payload).subscribe(value => localStorage.setItem('auth-token', value.token));
  }

  // when the user wants to log out, simply delete the auth-token existing
  logOut() {
    localStorage.removeItem('auth-token');
    this.router.navigateByUrl('/login');
  }

}
