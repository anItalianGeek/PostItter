import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserData} from "../../UserData";
import {PostData} from "../../PostData";
import {debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap} from "rxjs";

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
  posts: PostData[] = [];
  users: UserData[] = [];

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

  retrieveData(keyword: string): Observable<any> {
    return of([]); // not implemented yet
  }

}
