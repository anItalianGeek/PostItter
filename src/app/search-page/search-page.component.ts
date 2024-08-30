import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserData} from "../../UserData";
import {PostData} from "../../PostData";
import {combineLatest, debounceTime, distinctUntilChanged, map, Observable, of, Subject, switchMap} from "rxjs";
import {Router} from "@angular/router";
import {SearchEngineService} from "../../services/search-engine.service";

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export class SearchPageComponent implements OnInit, AfterViewInit {

  activatedFilter: number = 3;
  @ViewChild('filters', {static: false}) searchFilters!: ElementRef<HTMLElement>;
  @ViewChild('searchBar', {static: false}) searchBar!: ElementRef<HTMLInputElement>;
  responseData: (PostData | UserData)[] = [];
  searchKeywords: Subject<string> = new Subject<string>();
  posts: Observable<PostData[]> = new Observable();
  users: Observable<UserData[]> = new Observable();
  hashtags: Observable<PostData[]> = new Observable();

  constructor(private router: Router, private searchEngineService: SearchEngineService) {
    let token = localStorage.getItem('auth-token');
    if (token === null) {
      router.navigateByUrl('/login');
    } else {
      token = JSON.parse(token);
      // @ts-ignore
      if (Math.floor(Date.now() / 1000) > token.exp)
        router.navigateByUrl('/login');
    }
  }

  ngOnInit() {
    this.searchKeywords.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(searchKeyword => this.retrieveData(searchKeyword))
    ).subscribe();
  }

  ngAfterViewInit(): void {
    this.searchFilters.nativeElement.getElementsByTagName('li')[3].classList.add('selected');
  }

  changeFilter(index: number): void {
    this.searchFilters.nativeElement.getElementsByTagName('li')[this.activatedFilter].classList.remove('selected');
    this.searchFilters.nativeElement.getElementsByTagName('li')[index].classList.add('selected');
    this.activatedFilter = index;
  }

  pushTerm() {
    this.searchKeywords.next(this.searchBar.nativeElement.value);
  }

  retrieveData(keyword: string): Observable<any[]> {
    switch (this.activatedFilter) {
      case 0:
        return this.searchEngineService.searchUsers(keyword);
      case 1:
        return this.searchEngineService.searchPosts(keyword);
      case 2:
        return this.searchEngineService.searchHashtags(keyword);
      case 3:
        return combineLatest([
          this.searchEngineService.searchUsers(keyword),
          this.searchEngineService.searchPosts(keyword),
          this.searchEngineService.searchHashtags(keyword)
        ]).pipe(
          map(([users, posts, hashtags]) => [...users, ...posts, ...hashtags])
        );
      default:
        return of([]);
    }
  }

  isUserData(item: any): item is UserData {
    return (item as UserData).username !== undefined;
  }

  isPostData(item: any): item is PostData {
    return (item as PostData).body !== undefined;
  }

}
