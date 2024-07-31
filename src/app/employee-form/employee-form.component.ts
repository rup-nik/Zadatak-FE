import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  showErrors = false;
  minDate: string = '1900-01-01'; 
  maxDate: string = new Date().toISOString().split('T')[0];

  constructor(private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', [Validators.required]],
      jobTitle: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.showErrors = true; 

    const dateOfBirthControl = this.employeeForm.get('dateOfBirth');
    
    if (dateOfBirthControl) {
      const dateValue = dateOfBirthControl.value;
      
      dateOfBirthControl.setErrors(null);
      
      if (!dateValue) {
        dateOfBirthControl.setErrors({ 'required': true });
      } else {
        const date = new Date(dateValue);
        if (date < new Date(this.minDate) || date > new Date(this.maxDate)) {
          dateOfBirthControl.setErrors({ 'dateRange': true });
        }
      }
    }

    if (this.employeeForm.valid) {
      console.log('Form Submitted:', this.employeeForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
