import {Component, ElementRef, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {ReportService} from "../../services/report.service";

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {

  @ViewChild('firstName', {static: false}) firstName!: ElementRef<HTMLInputElement>;
  @ViewChild('lastName', {static: false}) lastName!: ElementRef<HTMLInputElement>;
  @ViewChild('number', {static: false}) number!: ElementRef<HTMLInputElement>;
  @ViewChild('content', {static: false}) content!: ElementRef<HTMLTextAreaElement>;

  constructor(private router: Router, private userService: UserService, private reportService: ReportService) {
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

  sendMessage(): void {
    let payload: { firstName: string, lastName: string, number: string, content: string } = {
      firstName: this.firstName.nativeElement.value,
      lastName: this.lastName.nativeElement.value,
      number: this.lastName.nativeElement.value,
      content: this.content.nativeElement.value,
    }
    this.reportService.sendMessage(payload);
  }

}
