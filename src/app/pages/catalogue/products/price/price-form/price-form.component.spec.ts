import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NbThemeModule, NbDialogModule, NbToastrModule, NbToastrService, NbDialogRef } from '@nebular/theme';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';

import { PriceFormComponent } from './price-form.component';

describe('PriceFormComponent', () => {
  let component: PriceFormComponent;
  let fixture: ComponentFixture<PriceFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule, FormsModule, NbThemeModule.forRoot(), NbDialogModule.forRoot()],
      providers: [{ provide: NbDialogRef, useValue: { close: () => {} } }, { provide: ToastrService, useValue: { success: () => {}, error: () => {}, warning: () => {} } }, { provide: NbToastrService, useValue: { success: () => {}, danger: () => {}, warning: () => {} } }],
      declarations: [ PriceFormComponent ]
    })
    .overrideTemplate(PriceFormComponent, '<div></div>')
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
