import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of, switchMap} from "rxjs";
import {UserData} from "../UserData";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url: string = "http://192.168.31.200";

  constructor(private http: HttpClient) {
  }

  // GET the existing users
  getUserById(id: string): Observable<UserData> {
    return this.http.get<UserData>(this.url + '/api/users/' + id);
  }

  getFollowers(id: string): Observable<UserData[] | undefined> {
    return this.getUserById(id).pipe(
      switchMap(user => {
        if (user.followers) return of(user.followers);
        else return of([]);
      })
    );
  }

  getFollowing(id: string): Observable<UserData[] | undefined> {
    return this.getUserById(id).pipe(
      switchMap(user => {
        if (user.following) return of(user.following);
        else return of([]);
      })
    )
  }

  // POST new user to the server
  addNewUser(userData: UserData): void {
    this.http.post(this.url + '/api/users/' + userData.id, userData).subscribe({
      next: value => console.log('user added succesfully!', value),
    });
  }

  // PUT updated values for a user
  updateUser(userData: UserData): void {
    this.http.post(this.url + '/api/users/' + userData.id, userData).subscribe({
      next: value => console.log('user updated successfully!', value),
    })
  }

  // DELETE a user from the server
  deleteUser(id: string): void {
    this.http.delete(this.url + '/api/users/' + id).subscribe({
      next: value => console.log('user deleted successfully!', value)
    })
  }

}
