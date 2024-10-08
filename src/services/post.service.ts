import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {PostData} from "../PostData";
import {UserData} from "../UserData";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private url: string = "http://localhost:5265";

  constructor(private http: HttpClient) {
  }

  // GET existing data
  getPosts(): Observable<PostData[]> {
    let params = new HttpParams().set('id_retrieving_user', (JSON.parse(localStorage.getItem('auth-token')!)).sub);
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt, 'Content-Type': 'application/json'});
    return this.http.get<PostData[]>(this.url + '/api/posts', {params: params})
  }

  getPostById(id: string): Observable<PostData> {
    let params = new HttpParams().set('id_retrieving_user', (JSON.parse(localStorage.getItem('auth-token')!)).sub);
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt, 'Content-Type': 'application/json'});
    return this.http.get<PostData>(this.url + '/api/posts/' + id, {params: params});
  }

  getPostsOfUser(userId: string): Observable<PostData[]> {
    let params = new HttpParams().set('id_retrieving_user', (JSON.parse(localStorage.getItem('auth-token')!)).sub);
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt, 'Content-Type': 'application/json'});
    return this.http.get<PostData[]>(this.url + '/api/posts/user/' + userId, {params: params});
  }

  getPostsOfUserByFilter(userId: string, filter: string): Observable<PostData[]> {
    let params = new HttpParams().set('id_retrieving_user', (JSON.parse(localStorage.getItem('auth-token')!)).sub);
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt, 'Content-Type': 'application/json'});
    return this.http.get<PostData[]>(this.url + '/api/posts/user' + userId + '/' + filter, {params: params});
  }

  // POST new posts on the server
  addNewPost(post: PostData): Observable<PostData> {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt, 'Content-Type': 'application/json'});
    return this.http.post<PostData>(this.url + '/api/posts/new', post);
  }

  // PUT updated things on the server for a specific post
  updatePost(post: PostData, action: string, comment?: { user: UserData, content: string }): void {
    switch (action) {
      case 'add-like':
        post.likes++;
        break;
      case 'add-comment':
        if (post.comments)
          post.comments?.push(comment!);
        else
          post.comments = [comment!];
        break;
      case 'remove-like':
        post.likes--;
        break;
      case 'remove-comment':
        post.comments = post.comments?.filter(comment_ => comment_ !== comment);
        break;
      case 'repost':
        post.reposts++;
        break;
      case 'share':
        post.shares++;
    }

    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    const params = new HttpParams().set('action', action).append('id_retrieving_user', (JSON.parse(jwt!)).sub);
    this.http.put(this.url + '/api/posts/update/' + post.id, comment, {params: params}).subscribe()
  }

  // DELETE the post from the server
  deletePost(post: PostData): void {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    this.http.delete(this.url + '/api/posts/delete/' + post.id).subscribe()
  }
}
