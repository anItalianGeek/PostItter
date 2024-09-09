import {Component, Input} from '@angular/core';
import {UserData} from "../../UserData";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

  @Input() user!: UserData;

  protected readonly localStorage = localStorage;
}
