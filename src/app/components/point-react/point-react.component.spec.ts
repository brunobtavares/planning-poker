/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PointReactComponent } from './point-react.component';

describe('PointReactComponent', () => {
  let component: PointReactComponent;
  let fixture: ComponentFixture<PointReactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointReactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointReactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
