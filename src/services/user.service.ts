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
  getDarkModeStatus(): Observable<boolean> {
    let params = new HttpParams().set('user', (JSON.parse(localStorage.getItem('auth-token')!)).sub);
    return this.http.get<boolean>(this.url + '/api/users/darkModeStatus', {params: params});
  }

  getUserById(id: string): Observable<UserData> {
    let params = new HttpParams().set('currentUser', (JSON.parse(localStorage.getItem('auth-token')!)).sub);
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    return this.http.get<UserData>(this.url + '/api/users/' + id, {params: params});
  }

  getFollowers(id: string): Observable<UserData[] | undefined> {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    return this.http.get<UserData[]>(this.url + '/api/users/' + id + '/followers');
  }

  getFollowing(id: string): Observable<UserData[] | undefined> {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    return this.http.get<UserData[]>(this.url + '/api/users/' + id + '/following');
  }

  blockUser(id: string, userData: UserData): void {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    this.http.post(this.url + '/api/users/' + id + '/block/' + userData.id, {}).subscribe()

  }

  unblockUser(id: string, userData: UserData): void {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    this.http.post(this.url + '/api/users/' + id + '/unblock/' + userData.id, {}).subscribe()
  }

  followUser(id: string, followerId: string, notification?: NotificationData): void {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    this.http.post(this.url + '/api/users/' + id + '/follow/' + followerId, notification).subscribe()
  }

  unfollowUser(id: string, followerId: string): void {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    this.http.delete(this.url + '/api/users/' + id + '/unfollow/' + followerId).subscribe()
  }

  // PUT updated values for a user
  updateUser(userData: UserData): void {
    const jwt = localStorage.getItem('auth-token');
    //const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    this.http.put<{ content: string }>(this.url + '/api/users/' + userData.id, userData, {observe: 'response'})
      .subscribe(response => {
        if (response.body?.content) {
          const newWindow = window.open();
          if (newWindow) {
            newWindow.document.write(response.body.content);
            newWindow.document.close();
          } else {
            console.error('Unable to open new window');
          }
        }
      });
  }

  updatePassword(newPassword: string) {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    this.http.post(this.url + '/api/users/changePassword', newPassword).subscribe()
  }

  // DELETE a user from the server
  deleteUser(id: string): void {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    this.http.delete(this.url + '/api/users/' + id).subscribe()
  }

  removeTwoFA(): void {
    let token = JSON.parse(localStorage.getItem('auth-token')!);
    let params = new HttpParams().set('id_active_user', token.sub);
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    this.http.delete(this.url + '/api/2fa', {params: params}).subscribe()
  }
}
