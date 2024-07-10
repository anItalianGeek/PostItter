import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements AfterViewInit {

  //TODO implement a login service
  @ViewChild('main', {static: false}) main!: ElementRef<HTMLElement>;
  @ViewChild('password', {static: false}) password!: ElementRef<HTMLElement>;
  @ViewChild('email', {static: false}) email!: ElementRef<HTMLElement>;
  loginPage: boolean = true;
  usernameInputs: Subject<string> = new Subject<string>();
  usernameAvaiable = false;

  constructor() {
    localStorage.setItem('authToken', 'pass for now with this');
    this.usernameInputs.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      switchMap(username => this.checkAvailability(username))
    ).subscribe();
  }

  checkAvailability(username: string): Observable<boolean> {
    return of(false); // TODO method not implemented yet
  }

  ngAfterViewInit(): void {
    this.main.nativeElement.style.height = window.innerHeight - 100 + 'px';
  }

  showSignUpPage() {
    this.loginPage = !this.loginPage;
  }

  // TODO literally everything is missing
  logIn(): void {
    new Router().navigateByUrl('/home');
  }

  signUp(): void {
    new Router().navigateByUrl('/home');
  }

}
