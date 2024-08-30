import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {PostData} from "../PostData";
import {UserData} from "../UserData";

@Injectable({
  providedIn: 'root'
})
export class SearchEngineService {

  private readonly url: string = "http://localhost:5265/"

  constructor(private http: HttpClient) {
  }

  searchPosts(prompt: string): Observable<PostData[]> {
    let params = new HttpParams().set("prompt", prompt);
    return this.http.get<PostData[]>(this.url + "api/searchEngine/posts", {params: params});
  }

  searchUsers(prompt: string): Observable<UserData[]> {
    let params = new HttpParams().set("prompt", prompt);
    return this.http.get<UserData[]>(this.url + "api/searchEngine/users", {params: params});
  }

  searchHashtags(prompt: string): Observable<PostData[]> {
    let params = new HttpParams().set("prompt", prompt);
    return this.http.get<PostData[]>(this.url + "api/searchEngine/hashtags", {params: params});
  }

}
