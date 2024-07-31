import { Component, OnInit } from '@angular/core';
import { EmployeeService, Employee } from '../employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  displayedEmployees: Employee[] = [];
  searchText: string = '';
  filterJobTitle: string = '';
  sortField: string = '';
  sortDirection: string = 'asc';
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe(response => {
      if (response.success) {
        this.employees = response.data;
        this.filteredEmployees = [...this.employees];
        this.updateDisplayedEmployees();
      }
    });
  }

  applyFilters(): void {
    const searchTextLower = this.searchText.toLowerCase();
    const filterJobTitleLower = this.filterJobTitle.toLowerCase();

    this.filteredEmployees = this.employees.filter(employee => {
      const matchesName = employee.firstName.toLowerCase().includes(searchTextLower) || 
                          employee.lastName.toLowerCase().includes(searchTextLower);
      const matchesJobTitle = employee.jobTitle.toLowerCase().includes(filterJobTitleLower);
      return matchesName && matchesJobTitle;
    });

    this.sortEmployees();
    this.currentPage = 1; 
    this.updateDisplayedEmployees();
  }

  clearFilters(): void {
    this.searchText = '';
    this.filterJobTitle = '';
    this.filteredEmployees = [...this.employees];
    this.currentPage = 1;
    this.updateDisplayedEmployees();
  }

  sortEmployees(): void {
    if (this.sortField) {
      this.filteredEmployees.sort((a, b) => {
        const fieldA = (a as any)[this.sortField];
        const fieldB = (b as any)[this.sortField];

        if (typeof fieldA === 'string' && typeof fieldB === 'string') {
          return this.compareStrings(fieldA.toLowerCase(), fieldB.toLowerCase());
        } else {
          return this.compareValues(fieldA, fieldB);
        }
      });
      this.updateDisplayedEmployees();
    }
  }

  compareStrings(a: string, b: string): number {
    if (a < b) {
      return this.sortDirection === 'asc' ? -1 : 1;
    } else if (a > b) {
      return this.sortDirection === 'asc' ? 1 : -1;
    } else {
      return 0;
    }
  }

  compareValues(a: any, b: any): number {
    if (a < b) {
      return this.sortDirection === 'asc' ? -1 : 1;
    } else if (a > b) {
      return this.sortDirection === 'asc' ? 1 : -1;
    } else {
      return 0;
    }
  }

  setSortField(field: string, direction: string): void {
    this.sortField = field;
    this.sortDirection = direction;
    this.sortEmployees();
  }

  updateDisplayedEmployees(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedEmployees = this.filteredEmployees.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updateDisplayedEmployees();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
  }
}
