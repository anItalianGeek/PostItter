import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserData} from "../../UserData";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {LoginService} from "../../services/login.service";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.css'
})
export class UserSettingsComponent implements AfterViewInit, OnInit {

  isLoaded: boolean = false;
  user!: UserData;
  @ViewChild('darkMode', {static: false}) darkModeCB!: ElementRef<HTMLInputElement>;
  @ViewChild('privateProfile', {static: false}) privateProfileCB!: ElementRef<HTMLInputElement>;
  @ViewChild('everyoneCanText', {static: false}) everyoneCanTextCB?: ElementRef<HTMLInputElement>;
  @ViewChild('twoFA', {static: false}) twoFACB!: ElementRef<HTMLInputElement>;
  @ViewChild('likeNotif', {static: false}) likeNotifCB!: ElementRef<HTMLInputElement>;
  @ViewChild('commentNotif', {static: false}) commentNotifCB!: ElementRef<HTMLInputElement>;
  @ViewChild('replyNotif', {static: false}) replyNotifCB!: ElementRef<HTMLInputElement>;
  @ViewChild('followNotif', {static: false}) followNotifCB!: ElementRef<HTMLInputElement>;
  @ViewChild('messageNotif', {static: false}) messageNotifCB!: ElementRef<HTMLInputElement>;
  @ViewChild('deletionMessageInput', {static: false}) deletionMessageInput!: ElementRef<HTMLInputElement>;
  @ViewChild('changeUsername', {static: false}) changeUsername!: ElementRef<HTMLInputElement>;
  @ViewChild('changeDisplayName', {static: false}) changeDisplayName!: ElementRef<HTMLInputElement>;
  @ViewChild('changeBio', {static: false}) changeBio!: ElementRef<HTMLInputElement>;
  @ViewChild('oldPasswordInput', {static: false}) oldPasswordInput!: ElementRef<HTMLInputElement>;
  @ViewChild('newPasswordInput', {static: false}) newPasswodInput?: ElementRef<HTMLInputElement>;
  @ViewChild('confirmPasswordInput', {static: false}) confirmPasswordInput?: ElementRef<HTMLInputElement>;
  @ViewChild('pfp_selector', {static: false}) pfp_selector!: ElementRef<HTMLInputElement>;
  accountDeletionProcess: boolean = false;
  deletionMessage: string = "";
  changesWereMade: boolean = false;
  interval: any;

  constructor(private router: Router, private userService: UserService, private loginService: LoginService) {
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
    forkJoin({
      dataUser: this.userService.getUserById((JSON.parse(localStorage.getItem('auth-token')!)).sub)
    }).subscribe(
      response => this.user = response.dataUser
    );
  }

  ngAfterViewInit() {
    console.log(this.user)
    this.revertChanges();

    this.pfp_selector.nativeElement.addEventListener('change', (event: Event) => {
      const component = event.target as HTMLInputElement;
      if (component.files && component.files.length > 0) {
        const file = component.files[0];

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (e: ProgressEvent<FileReader>) => {
          const img = new Image();
          img.src = e.target!.result as string;

          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Set canvas size to 512x512
            canvas.width = 512;
            canvas.height = 512;

            // Draw the image onto the canvas, scaling it to 512x512
            ctx?.drawImage(img, 0, 0, 512, 512);

            // Convert the canvas back to a Blob (or Base64 string)
            canvas.toBlob((blob: Blob | null) => {
              if (blob) {
                // Now you can upload 'blob' as your resized image
                // For example, you could use a formData object to send it to your server
                const formData = new FormData();
                let extension: string = file.name.substring(file.name.indexOf('.'));
                formData.append('file', blob, this.user.username + extension);

                this.user.profilePicture = this.user.username + extension;
                // TODO push picture to cloud
              }
            }, file.type);
          };

          component.files = null; // reset important values to allow the next file to be read correctly
          component.value = '';
        };
      }
    });

    this.interval = setInterval(() => {
      console.log("interval triggered");
      this.checkIfChange();
    }, 500);
  }

  checkIfChange(): void {
    if (
      this.user.darkMode == this.darkModeCB.nativeElement.checked &&
      this.user.privateProfile == this.privateProfileCB.nativeElement.checked &&
      (this.user.privateProfile || this.user.everyoneCanText == this.everyoneCanTextCB?.nativeElement.checked) && // skip check if profile is private!
      this.user.twoFA == this.twoFACB.nativeElement.checked &&
      this.user.commentNotification == this.commentNotifCB.nativeElement.checked &&
      this.user.replyNotification == this.replyNotifCB.nativeElement.checked &&
      this.user.followNotification == this.followNotifCB.nativeElement.checked &&
      this.user.likeNotification == this.likeNotifCB.nativeElement.checked &&
      this.user.messageNotification == this.messageNotifCB.nativeElement.checked
    ) this.changesWereMade = false;
    else this.changesWereMade = true;
    console.log('checked!! changesWereMade is ', this.changesWereMade)
  }

  togglePrivateProfile(): void {
    this.user.privateProfile = !this.user.privateProfile;

    if (!this.user.privateProfile)
      this.user.everyoneCanText = false;
  }

  toggleTextsFromAll(): void {
    if (!this.user.privateProfile)
      this.user.everyoneCanText = !this.user.everyoneCanText;
  }

  saveChanges(): void {
    if (this.newPasswodInput && this.confirmPasswordInput) {
      if (this.newPasswodInput.nativeElement.value ==
        this.confirmPasswordInput.nativeElement.value)
        this.userService.updatePassword(this.confirmPasswordInput.nativeElement.value);
    }

    this.userService.updateUser(this.user);
  }

  revertChanges() {
    if (this.user.darkMode)
      this.darkModeCB.nativeElement.checked = true;

    if (this.user.privateProfile)
      this.privateProfileCB.nativeElement.checked = true;

    if (!this.user.privateProfile && this.user.everyoneCanText)
      this.everyoneCanTextCB!.nativeElement.checked = true;

    if (this.user.twoFA)
      this.twoFACB.nativeElement.checked = true;

    if (this.user.commentNotification)
      this.commentNotifCB.nativeElement.checked = true;

    if (this.user.followNotification)
      this.followNotifCB.nativeElement.checked = true;

    if (this.user.likeNotification)
      this.likeNotifCB.nativeElement.checked = true;

    if (this.user.messageNotification)
      this.messageNotifCB.nativeElement.checked = true;

    if (this.user.replyNotification)
      this.replyNotifCB.nativeElement.checked = true;

    this.oldPasswordInput.nativeElement.value = '';
    if (this.newPasswodInput && this.confirmPasswordInput) {
      this.newPasswodInput!.nativeElement.value = '';
      this.confirmPasswordInput!.nativeElement.value = '';
    }
    this.changeUsername.nativeElement.value = '';
    this.changeDisplayName.nativeElement.value = '';
    this.changeBio.nativeElement.value = '';
  }

  logOut(): void {
    this.loginService.logOut();
  }

  deleteAccount(): void {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    this.deletionMessage = "";
    for (let i = 0; i < 7; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      this.deletionMessage += characters[randomIndex];
    }
    this.accountDeletionProcess = true;
  }

  confirmDeletion(changedMind: boolean): void {
    if (changedMind) {
      this.accountDeletionProcess = false;
      return;
    }

    if (this.deletionMessage == this.deletionMessageInput.nativeElement.value) {
      const token = JSON.parse(localStorage.getItem('auth-token')!);
      this.userService.deleteUser(token.sub);
    } else {
      alert("Deleting Process Cancelled. Message didn't match.");
    }
    this.deletionMessage = "";
    this.accountDeletionProcess = false;
  }
}
