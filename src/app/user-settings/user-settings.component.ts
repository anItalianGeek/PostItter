import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {UserData} from "../../UserData";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.css'
})
export class UserSettingsComponent implements AfterViewInit {

  user!: UserData; // TODO understand how to add users
  @ViewChild('darkMode', {static: false}) darkModeCB!: ElementRef<HTMLInputElement>;
  @ViewChild('privateProfile', {static: false}) privateProfileCB!: ElementRef<HTMLInputElement>;
  @ViewChild('everyoneCanText', {static: false}) everyoneCanTextCB!: ElementRef<HTMLInputElement>;

  // TODO make sure to allow name changes by adding view child elements and finish more things related to posts if necessary

  constructor(private router: Router) {
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

  ngAfterViewInit() {
    if (this.user.darkMode)
      this.darkModeCB.nativeElement.checked = true;
    if (this.user.privateProfile)
      this.privateProfileCB.nativeElement.checked = true;
    else if (this.user.everyoneCanText)
      this.everyoneCanTextCB.nativeElement.checked = true;
  }

  toggleDarkMode(event: MouseEvent): void {
    event.stopPropagation();
    this.user.darkMode = !this.user.darkMode;
  }

  togglePrivateProfile(event: MouseEvent): void {
    event.stopPropagation();
    this.user.privateProfile = !this.user.privateProfile;
    this.user.everyoneCanText = false;
    console.log('private profile', this.user.privateProfile);
    console.log('everyone can text', this.user.everyoneCanText);
  }

  toggleTextsFromAll(event: MouseEvent): void {
    event.stopPropagation();
    this.user.everyoneCanText = !this.user.everyoneCanText;
    console.log('everyone can text', this.user.everyoneCanText);
  }

  changeUsername(): void {

  }

  changeDisplayName(): void {

  }

  changeBio(): void {

  }
}
