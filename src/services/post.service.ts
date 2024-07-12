import {Injectable} from '@angular/core';
import {Observable, of, switchMap} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {PostData} from "../PostData";
import {UserService} from "./user.service";
import {UserData} from "../UserData";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private url: string = "http://192.168.31.200";

  constructor(private http: HttpClient, private userService: UserService) {
  }

  // GET existing data
  getPostById(id: string): Observable<PostData> {
    return this.http.get<PostData>(this.url + '/api/posts/' + id);
  }

  getPostsOfUser(userId: string): Observable<PostData[] | undefined> {
    return this.userService.getUserById(userId).pipe(
      switchMap(user => {
        return of(user.posts);
      })
    );
  }

  getPostsOfUserByFilter(userId: string, filter: string): Observable<PostData[]> {
    return this.userService.getUserById(userId).pipe(
      switchMap(user => {
        if (!user.posts)
          return of([]);

        switch (filter) {
          case 'likes':
            if (user.likedPosts)
              return of(user.likedPosts);
            else
              return of([]);
          case 'comments':
            if (user.commentedPosts)
              return of(user.commentedPosts);
            else
              return of([]);
          case 'reposts':
            const posts: PostData[] = [];
            for (const post of user.posts) {
              if (typeof post.body !== 'string')
                posts.push(post);
            }
            return of(posts);
        }

        return of([]);
      })
    )
  }

  // POST new posts on the server
  addNewPost(post: PostData): void {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.post<PostData>(this.url + '/api/posts/' + post.id, post, {headers: headers}).subscribe({ // TODO must delete this shit once debugs are finished
      next: (response) => {
        console.log('File added successfully');
      }
    });
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

    this.http.put<PostData>(this.url + '/api/posts/' + post.id, post).subscribe({
      next: value => console.log('file updated successfully!', value)
    });
  }

  // DELETE the post from the server
  deletePost(post: PostData): void {
    this.http.delete(this.url + '/api/posts/' + post.id).subscribe({
      next: (response) => {
        console.log('File deleted successfully');
      },
    })
  }
}
