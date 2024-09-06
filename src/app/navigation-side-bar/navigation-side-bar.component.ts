import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserData} from "../../UserData";
import {UserService} from "../../services/user.service";
import {DarkModeSetter} from "../../darkModeSetter";

@Component({
  selector: 'app-navigation-side-bar',
  templateUrl: './navigation-side-bar.component.html',
  styleUrl: './navigation-side-bar.component.css'
})
export class NavigationSideBarComponent implements AfterViewInit, OnInit {

  @ViewChild('main', {static: false}) navBar!: ElementRef<HTMLElement>;

  user!: UserData;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getUserById((JSON.parse(localStorage.getItem('auth-token')!)).sub).subscribe(res => {
      this.user = res;

      if (localStorage.getItem('app-theme') == null) {
        this.userService.getDarkModeStatus().subscribe(response => {
          localStorage.setItem('app-theme', response ? 'dark' : 'light');
          this.navBar.nativeElement.classList.add('darkmode');
          if (response)
            DarkModeSetter.setDarkMode();
        })
      } else if (localStorage.getItem('app-theme') == 'dark') {
        this.navBar.nativeElement.classList.add('darkmode');
        DarkModeSetter.setDarkMode();
      }
    });
  }

  ngAfterViewInit() {
    this.navBar.nativeElement.style.height = window.innerHeight + 'px';
    this.navBar.nativeElement.getElementsByTagName('ul')[1].style.bottom = '0';
    this.navBar.nativeElement.style.position = 'fixed';
    this.navBar.nativeElement.style.top = '0';
    this.navBar.nativeElement.style.left = '0';
  }

}
