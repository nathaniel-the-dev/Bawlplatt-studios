import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeBookingPage } from './make-booking.page';

describe('MakeBookingPage', () => {
  let component: MakeBookingPage;
  let fixture: ComponentFixture<MakeBookingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakeBookingPage ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
