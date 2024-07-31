import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  jobTitle: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://api.test.ulaznice.hr/paganini/api/job-interview/employees';

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<{ success: boolean, data: Employee[] }> {
    return this.http.get<{ success: boolean, data: Employee[] }>(this.apiUrl).pipe(
      map(response => ({
        ...response,
        data: response.data.map(employee => ({
          ...employee,
          dateOfBirth: new Date(employee.dateOfBirth).toISOString().split('T')[0]
        }))
      }))
    );
  }
}
