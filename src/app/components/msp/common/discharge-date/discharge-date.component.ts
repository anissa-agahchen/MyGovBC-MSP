import {Component, Input, EventEmitter, Output, ViewChild} from '@angular/core'
import { NgForm } from '@angular/forms';

import {Person} from "../../model/person.model";
import * as moment from 'moment';

require('./discharge-date.component.less');

@Component({
  selector: 'msp-discharge-date',
  templateUrl: './discharge-date.component.html'
})
export class MspDischargeDateComponent {

  lang = require('./i18n');
  @Output() onChange = new EventEmitter<any>();

  // Create today for comparison in check later
  today = moment();

  @ViewChild('formRef') form: NgForm;
  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(values => {
      this.onChange.emit(values);
    });
  }
  

  // Parse person's date
  date() {
    return moment({
      year: this.year,
      month: this.month - 1, // moment use 0 index for month :(
      day: this.day,
    });
  }


  @Input() year: number;
  @Output() yearChange = new EventEmitter<number>();
  @Input() month: number;
  @Output() monthChange = new EventEmitter<number>();
  @Input() day: number;
  @Output() dayChange = new EventEmitter<number>();

  /**
   * Determine if date of birth is valid for the given person
   *
   * @returns {boolean}
   */
  isValid(): boolean {

    // Validate
    if (!this.date().isValid()) {
      return false;
    }

    return true;
  }

  futureCheck(): boolean {

    // Check not in future
    if (this.date().isAfter(this.today)) {
      return false;
    }

    return true;
  }
}
