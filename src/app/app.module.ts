import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomepageComponent} from './homepage/homepage.component';
import {NavigationSideBarComponent} from './navigation-side-bar/navigation-side-bar.component';
import {PostComponent} from './post/post.component';
import {NgOptimizedImage} from "@angular/common";
import { NotificationsDashboardComponent } from './notifications-dashboard/notifications-dashboard.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { TrendingPostsComponent } from './trending-posts/trending-posts.component';
import { MessagesDashboardComponent } from './messages-dashboard/messages-dashboard.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    NavigationSideBarComponent,
    PostComponent,
    NotificationsDashboardComponent,
    SearchPageComponent,
    TrendingPostsComponent,
    MessagesDashboardComponent,
    UserSettingsComponent,
    AboutUsComponent,
    ContactUsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
