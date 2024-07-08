import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomepageComponent} from "./homepage/homepage.component";
import {PostComponent} from "./post/post.component";
import {NotificationsDashboardComponent} from "./notifications-dashboard/notifications-dashboard.component";
import {SearchPageComponent} from "./search-page/search-page.component";
import {TrendingPostsComponent} from "./trending-posts/trending-posts.component";
import {MessagesDashboardComponent} from "./messages-dashboard/messages-dashboard.component";
import {UserSettingsComponent} from "./user-settings/user-settings.component";
import {AboutUsComponent} from "./about-us/about-us.component";
import {ContactUsComponent} from "./contact-us/contact-us.component";

const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'home', component: HomepageComponent},
  {path: 'posts/:id', component: PostComponent},
  {path: 'notifications', component: NotificationsDashboardComponent},
  {path: 'search', component: SearchPageComponent},
  {path: 'search/trending', component: TrendingPostsComponent},
  {path: 'messages', component: MessagesDashboardComponent},
  {path: 'user-settings', component: UserSettingsComponent},
  {path: 'users/:id', component: UserSettingsComponent},
  {path: 'about', component: AboutUsComponent},
  {path: 'contact', component: ContactUsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
