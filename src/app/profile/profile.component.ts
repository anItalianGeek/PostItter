import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserData} from "../../UserData";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  isLoaded: boolean = false;
  @ViewChild('filters', {static: false}) searchFilters!: ElementRef<HTMLElement>;
  activatedFilter = 3;
  user!: UserData;
  showAllFollowers: boolean = false;
  showAllFollowing: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService) {
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
    this.userService.getUserById((JSON.parse(localStorage.getItem('auth-token')!)).sub).subscribe(res => {
      this.user = res;
      this.isLoaded = true
    });
  }

  changeFilter(index: number): void {
    this.searchFilters.nativeElement.getElementsByTagName('li')[this.activatedFilter].classList.remove('selected');
    this.searchFilters.nativeElement.getElementsByTagName('li')[index].classList.add('selected');
    this.activatedFilter = index;
  }

  showFollowers(): void {
    this.showAllFollowers = true;
  }

  showFollowing(): void {
    this.showAllFollowing = true;
  }

  closeFollowersWindow(): void {
    this.showAllFollowers = false;
  }

  closeFollowingWindow(): void {
    this.showAllFollowing = false;
  }

}
