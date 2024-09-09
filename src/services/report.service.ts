import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserData} from "../UserData";

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private readonly url: string = 'http://localhost:5265';

  constructor(private http: HttpClient) {
  }

  sendReport(reportedUser: UserData, reason: string, explanation: string): void {
    let jwt = JSON.parse(localStorage.getItem('auth-token')!);
    let reportData: { reported_by: UserData, reportedUser: UserData, reason: string, explanation: string } = {
      reported_by: {id: jwt.sub, displayName: jwt.displayname, username: jwt.username, profilePicture: ''},
      reportedUser: reportedUser,
      reason: reason,
      explanation: explanation
    };
    this.http.post(this.url + '/api/submitReport', reportData).subscribe();
  }

  sendMessage(payload: { firstName: string, lastName: string, number: string, content: string }): void {
    this.http.post(this.url + '/api/contact', payload).subscribe();
  }

}
