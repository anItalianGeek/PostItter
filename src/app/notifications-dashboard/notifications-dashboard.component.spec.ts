import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsDashboardComponent } from './notifications-dashboard.component';

describe('NotificationsDashboardComponent', () => {
  let component: NotificationsDashboardComponent;
  let fixture: ComponentFixture<NotificationsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationsDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
