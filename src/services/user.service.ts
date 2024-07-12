import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
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

}
