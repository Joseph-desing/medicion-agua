import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterReadingPage } from './register-reading.page';

describe('RegisterReadingPage', () => {
  let component: RegisterReadingPage;
  let fixture: ComponentFixture<RegisterReadingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterReadingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
