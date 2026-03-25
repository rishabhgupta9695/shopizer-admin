import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NbThemeModule, NbDialogModule, NbToastrModule, NbToastrService, NbDialogRef } from '@nebular/theme';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';

import { BrandFormComponent } from './brand-form.component';

describe('BrandFormComponent', () => {
  let component: BrandFormComponent;
  let fixture: ComponentFixture<BrandFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule, FormsModule, NbThemeModule.forRoot(), NbDialogModule.forRoot()],
      providers: [{ provide: NbDialogRef, useValue: { close: () => {} } }, { provide: ToastrService, useValue: { success: () => {}, error: () => {}, warning: () => {} } }, { provide: NbToastrService, useValue: { success: () => {}, danger: () => {}, warning: () => {} } }],
      declarations: [ BrandFormComponent ]
    })
    .overrideTemplate(BrandFormComponent, '<div></div>')
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
