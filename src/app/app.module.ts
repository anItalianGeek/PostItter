import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomepageComponent} from './homepage/homepage.component';
import {NavigationSideBarComponent} from './navigation-side-bar/navigation-side-bar.component';
import {PostComponent} from './post/post.component';
import {DatePipe, NgOptimizedImage} from "@angular/common";
import {NotificationsDashboardComponent} from './notifications-dashboard/notifications-dashboard.component';
import {SearchPageComponent} from './search-page/search-page.component';
import {MessagesDashboardComponent} from './messages-dashboard/messages-dashboard.component';
import {UserSettingsComponent} from './user-settings/user-settings.component';
import {AboutUsComponent} from './about-us/about-us.component';
import {ContactUsComponent} from './contact-us/contact-us.component';
import {UserComponent} from './user/user.component';
import {UserDetailsComponent} from './user-details/user-details.component';
import {LoginComponent} from './login/login.component';
import {PostDetailComponent} from './post-detail/post-detail.component';
import {NotificationComponent} from './notification/notification.component';
import {ProfileComponent} from './profile/profile.component';
import {HttpClientModule} from "@angular/common/http";
import {LoaderComponent} from './loader/loader.component';
import {CommentComponent} from './comment/comment.component';
import {ReportComponent} from './report/report.component';
import {FormsModule} from "@angular/forms";
import {ShareComponent} from './share/share.component';
import {ChatComponent} from './chat/chat.component';
import {ChatDetailComponent} from './chat-detail/chat-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    NavigationSideBarComponent,
    PostComponent,
    NotificationsDashboardComponent,
    SearchPageComponent,
    MessagesDashboardComponent,
    UserSettingsComponent,
    AboutUsComponent,
    ContactUsComponent,
    UserComponent,
    UserDetailsComponent,
    LoginComponent,
    PostDetailComponent,
    NotificationComponent,
    ProfileComponent,
    LoaderComponent,
    CommentComponent,
    ReportComponent,
    ShareComponent,
    ChatComponent,
    ChatDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgOptimizedImage,
    FormsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {
}
