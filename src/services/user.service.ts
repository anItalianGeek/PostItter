import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserData} from "../UserData";

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
    return this.http.get<UserData>(this.url + '/api/users/' + id, {params: params});
  }

  getFollowers(id: string): Observable<UserData[] | undefined> {
    return this.http.get<UserData[]>(this.url + 'api/users/' + id + '/followers');
  }

  getFollowing(id: string): Observable<UserData[] | undefined> {
    return this.http.get<UserData[]>(this.url + 'api/users/' + id + '/following');
  }

  // POST new user to the server
  addNewUser(userData: UserData): void {
    this.http.post(this.url + '/api/users/' + userData.id, userData).subscribe({
      next: value => console.log('user added succesfully!', value),
    });
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

  followUser(id: string, followerId: string): void {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    this.http.post(this.url + '/api/users/' + id + '/follow' + followerId, {headers: headers});
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

}
