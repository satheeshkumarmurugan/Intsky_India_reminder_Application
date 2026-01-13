import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { interval } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';

interface Reminder {
  text: string;
  time: Date;
  expired: boolean;
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    FlexLayoutModule,
    MatIconModule
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {

  currentTime = new Date();
  isFastMode = false;

  reminderForm!: FormGroup;
  formData: Reminder[] = [];

  constructor(private fb: FormBuilder) {
    this.reminderForm = this.fb.group({
      reminderValue: ['', Validators.required],
      reminderTime: ['',Validators.required]
    });
  }

  ngOnInit(): void {
    interval(1000).subscribe(() => {

      if (this.isFastMode) {
        this.currentTime = new Date(this.currentTime.getTime() + 60000);
      } else {
        this.currentTime = new Date();
      }

      this.formData.forEach(reminder => {
        if (!reminder.expired && this.currentTime > reminder.time) {
          reminder.expired = true;
        }
      });
    });
  }

  toggleFastMode() {
    this.isFastMode = !this.isFastMode;
  }

  save() {
    if (this.reminderForm.invalid) return;

    const { reminderValue, reminderTime } = this.reminderForm.value;
    const [hStr, mStr] = reminderTime.split(':');
    let h = +hStr;
    const m = +mStr;
    const now = new Date();
    const tempDate = new Date();
    tempDate.setHours(h, m, 0);

    if (tempDate <= now) {
      h += 12;
      if (h >= 24) h -= 24;
      tempDate.setHours(h, m, 0);
    }

    this.formData.push({
      text: reminderValue,
      time: tempDate,
      expired: false
    });

    this.reminderForm.reset({
      reminderValue: '',
      reminderTime: ''
    }, { emitEvent: false });

  }

  editReminderTime(index: number) {

    const reminder = this.formData[index];
    const timeStr = prompt('Enter new time (hh:mm)', this.formatTime(reminder.time));

    if (timeStr) {

      const [hStr, mStr] = timeStr.split(':');
      let h = +hStr;
      const m = +mStr;

      const tempDate = new Date();

      tempDate.setHours(h, m, 0);

      if (tempDate <= new Date()) {
        h += 12;
        if (h >= 24) h -= 24;
        tempDate.setHours(h, m, 0);
      }

      reminder.time = tempDate;
      reminder.expired = false;
    }

  }

  formatTime(date: Date): string {
    const h = date.getHours() % 12 || 12;
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  }

}
