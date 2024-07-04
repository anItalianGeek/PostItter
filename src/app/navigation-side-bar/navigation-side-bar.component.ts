import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-navigation-side-bar',
  templateUrl: './navigation-side-bar.component.html',
  styleUrl: './navigation-side-bar.component.css'
})
export class NavigationSideBarComponent implements AfterViewInit {

  @ViewChild('main', {static: false}) navBar!: ElementRef<HTMLElement>;

  ngAfterViewInit() {
    this.navBar.nativeElement.style.height = window.innerHeight + 'px';
    this.navBar.nativeElement.getElementsByTagName('ul')[1].style.bottom = '0';
    this.navBar.nativeElement.style.position = 'fixed';
    this.navBar.nativeElement.style.top = '0';
    this.navBar.nativeElement.style.left = '0';
  }

}
