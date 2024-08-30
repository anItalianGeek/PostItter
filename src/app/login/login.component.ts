import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged, Subject, switchMap} from "rxjs";
import {Router} from "@angular/router";
import {JwtWebToken, LoginService, LoginUserInput} from "../../services/login.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, AfterViewInit {

  isLoaded: boolean = false;
  @ViewChild('main', {static: false}) main!: ElementRef<HTMLInputElement>;
  @ViewChild('password', {static: false}) password!: ElementRef<HTMLInputElement>;
  @ViewChild('email', {static: false}) email!: ElementRef<HTMLInputElement>;
  @ViewChild('password_signup', {static: false}) password_signup!: ElementRef<HTMLInputElement>;
  @ViewChild('email_signup', {static: false}) email_signup!: ElementRef<HTMLInputElement>;
  @ViewChild('username', {static: false}) username!: ElementRef<HTMLInputElement>;
  @ViewChild('displayname', {static: false}) displayname!: ElementRef<HTMLInputElement>;
  loginPage: boolean = true;
  showPasswordRecoveryForm: boolean = false;
  usernameInputs: Subject<string> = new Subject<string>();
  usernameAvailable = false;
  requestCode: boolean = false;

  constructor(private loginService: LoginService, private router: Router) {
    this.usernameInputs.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(username => this.loginService.checkUsenameAvailability(username))
    ).subscribe(response => this.usernameAvailable = response);
  }

  ngOnInit() {
    this.isLoaded = true;
    setInterval(() => {
      if (!this.loginPage) {
        if (this.usernameAvailable)
          this.username.nativeElement.style.borderColor = '';
        else
          this.username.nativeElement.style.borderColor = 'red';
      }
    }, 500);
  }

  ngAfterViewInit(): void {
    this.main.nativeElement.style.height = window.innerHeight - 100 + 'px';
  }

  showSignUpPage() {
    this.loginPage = !this.loginPage;
  }

  logIn(): void {
    const token: string | null = localStorage.getItem('auth-token');
    if (token != null && JSON.parse(token).exp > Math.floor(Date.now() / 1000)) {
      this.router.navigateByUrl('/home');
      alert('You are already logged in! You have been redirected to the home page.');
      return;
    }

    let payload: LoginUserInput = {
      email: this.email.nativeElement.value,
      password: this.password.nativeElement.value
    };

    localStorage.setItem('temp-email', payload.email);

    this.loginService.logIn(payload).subscribe(response => {
      if (response.status === 200) {
        const token = response.body as JwtWebToken;
        localStorage.setItem('auth-token', JSON.stringify(token));
        localStorage.removeItem('temp-email');
      } else {
        this.requestCode = true;
      }
    });
  }

  logInWith2faCode(code: string) {
    this.loginService.logInWith2faCode(code).subscribe(response => {
      localStorage.setItem('auth-token', JSON.stringify(response));
      localStorage.removeItem('temp-email');
      this.requestCode = false;
      this.router.navigateByUrl('/home');
    });
  }

  signUp(): void {
    let payload: LoginUserInput = {
      email: this.email_signup.nativeElement.value,
      password: this.password_signup.nativeElement.value,
      username: this.username.nativeElement.value,
      displayName: this.displayname.nativeElement.value,
    };

    if (this.usernameAvailable) {
      this.loginService.signUp(payload)
        .subscribe({
          next: (value) => {
            localStorage.setItem('auth-token', JSON.stringify(value));
            this.router.navigateByUrl('/home');
          },
          error: (err) => {
            alert('An Error occured while signing up. Please try again later.');
          }
        });
    } else {
      alert("Your proposed username is unavailable!");
    }
  }

  requestPasswordRecovery(recoveryEmail: string) {
    this.showPasswordRecoveryForm = false;
    this.loginService.requestPasswordRecovery(recoveryEmail);
  }

}
