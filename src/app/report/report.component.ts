import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {UserData} from "../../UserData";
import {ReportService} from "../../services/report.service";

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent {

  @Input() reportedUser!: UserData;
  @Output() showReportWindowChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('explanation', {static: false}) explanation!: ElementRef<HTMLTextAreaElement>;
  selectedOption: string = '';

  constructor(private reportService: ReportService) {
  }

  submitReport(): void {
    let explanation: string = this.explanation.nativeElement.value;
    let reason: string = this.selectedOption;
    if (confirm("You are about to report a user, are you sure you want to do this?")) {
      this.reportService.sendReport(this.reportedUser, reason, explanation);
      this.showReportWindowChange.emit(false);
    }
  }

  cancelReport(): void {
    this.showReportWindowChange.emit(false);
  }

  protected readonly localStorage = localStorage;
}
