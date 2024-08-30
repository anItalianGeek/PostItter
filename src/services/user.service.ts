import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserData} from "../UserData";
import {NotificationData} from "../NotificationData";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url: string = "http://localhost:5265";

  constructor(private http: HttpClient) {
  }

  // GET the existing users
  getUserById(id: string): Observable<UserData> {
    let params = new HttpParams().set('currentUser', (JSON.parse(localStorage.getItem('auth-token')!)).sub);
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    return this.http.get<UserData>(this.url + '/api/users/' + id, {params: params, headers: headers});
  }

  getFollowers(id: string): Observable<UserData[] | undefined> {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    return this.http.get<UserData[]>(this.url + 'api/users/' + id + '/followers', {headers: headers});
  }

  getFollowing(id: string): Observable<UserData[] | undefined> {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    return this.http.get<UserData[]>(this.url + 'api/users/' + id + '/following', {headers: headers});
  }

  blockUser(id: string, userData: UserData): void {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    this.http.post(this.url + '/api/users/' + id + '/block', userData, {headers}).subscribe({
      next: value => console.log('user blocked successfully!', value),
    })
  }

  unblockUser(id: string, userData: UserData): void {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    this.http.post(this.url + '/api/users/' + id + '/unblock', userData, {headers}).subscribe({
      next: value => console.log('user unblocked successfully!', value),
    })
  }

  followUser(id: string, followerId: string, notification?: NotificationData): void {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    this.http.post(this.url + '/api/users/' + id + '/follow' + followerId, notification, {headers: headers});
  }

  unfollowUser(id: string, followerId: string): void {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    this.http.delete(this.url + '/api/users/' + id + '/unfollow' + followerId, {headers: headers});
  }

  // PUT updated values for a user
  updateUser(userData: UserData): void {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    this.http.post(this.url + '/api/users/' + userData.id, userData, {headers}).subscribe({
      next: value => console.log('user updated successfully!', value),
    })
  }

  updatePassword(newPassword: string) {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    this.http.post(this.url + '/api/users/changePassword', newPassword, {headers}).subscribe({
      next: value => console.log('user updated successfully!', value),
    });
  }

  // DELETE a user from the server
  deleteUser(id: string): void {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    this.http.delete(this.url + '/api/users/' + id, {headers}).subscribe({
      next: value => console.log('user deleted successfully!', value)
    })
  }

  removeTwoFA(): void {
    let token = JSON.parse(localStorage.getItem('auth-token')!);
    let params = new HttpParams().set('id_active_user', token.sub);
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    this.http.delete(this.url + 'api/2fa', {headers: headers, params: params});
  }
}
