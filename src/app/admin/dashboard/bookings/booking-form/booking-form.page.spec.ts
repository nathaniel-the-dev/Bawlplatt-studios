import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingFormPage } from './booking-form.page';

describe('BookingFormPage', () => {
  let component: BookingFormPage;
  let fixture: ComponentFixture<BookingFormPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingFormPage ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
