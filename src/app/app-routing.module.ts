import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomepageComponent} from "./homepage/homepage.component";
import {NotificationsDashboardComponent} from "./notifications-dashboard/notifications-dashboard.component";
import {SearchPageComponent} from "./search-page/search-page.component";
import {MessagesDashboardComponent} from "./messages-dashboard/messages-dashboard.component";
import {UserSettingsComponent} from "./user-settings/user-settings.component";
import {AboutUsComponent} from "./about-us/about-us.component";
import {ContactUsComponent} from "./contact-us/contact-us.component";
import {LoginComponent} from "./login/login.component";
import {PostDetailComponent} from "./post-detail/post-detail.component";
import {UserDetailsComponent} from "./user-details/user-details.component";
import {ProfileComponent} from "./profile/profile.component";

const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomepageComponent},
  {path: 'posts/:id', component: PostDetailComponent},
  {path: 'notifications', component: NotificationsDashboardComponent},
  {path: 'search', component: SearchPageComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'messages', component: MessagesDashboardComponent},
  {path: 'user-settings', component: UserSettingsComponent},
  {path: 'users/:id', component: UserDetailsComponent},
  {path: 'about', component: AboutUsComponent},
  {path: 'contact', component: ContactUsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
