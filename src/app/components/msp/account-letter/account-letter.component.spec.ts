import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AccountLetterComponent } from './account-letter.component';
import { MspDataService } from '../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {MspProgressBarComponent} from '../common/progressBar/progressBar.component';
import {RouterTestingModule} from '@angular/router/testing';
import { ProcessService } from '../service/process.service';
import {MspLogService} from '../service/log.service';
import {HttpClientModule} from '@angular/common/http';

describe('AccountLetterComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountLetterComponent, MspProgressBarComponent],
      imports: [FormsModule, RouterTestingModule, HttpClientModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService, ProcessService , MspLogService
      ]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(AccountLetterComponent);
    expect(fixture.componentInstance instanceof AccountLetterComponent).toBe(true, 'should create ApplicationComponent');

  });
});
