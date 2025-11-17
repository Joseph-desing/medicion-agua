import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyReadingsPage } from './my-readings.page';

describe('MyReadingsPage', () => {
  let component: MyReadingsPage;
  let fixture: ComponentFixture<MyReadingsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyReadingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
