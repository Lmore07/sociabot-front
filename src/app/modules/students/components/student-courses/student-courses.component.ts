import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { MyCoursesResponse } from '../../interfaces/student-courses.interfaces';
import { CoursesService } from '../../services/courses.service';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-student-courses',
  standalone: true,
  imports: [
    TableModule,
    ToolbarModule,
    ButtonModule,
    SelectButtonModule,
    ReactiveFormsModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './student-courses.component.html',
  styleUrl: './student-courses.component.css'
})
export class StudentCoursesComponent {
  constructor(private service: CoursesService) {}
  courses!: MyCoursesResponse[];
  formGroup!: FormGroup;
  
  stateOptions: any[] = [
    { label: 'Activos', value: true },
    { label: 'Inactivos', value: false },
  ];

  ngOnInit() {
    this.formGroup = new FormGroup({
      status: new FormControl(true),
    });
    this.getCourses();
  }
  getCourses() {
    this.service
      .getMyCoursesByStudent(this.formGroup.value['status'])
      .subscribe((data) => {
        console.log(data);
        this.courses = data.data;
      });
  }
  iconActions() {
    if (this.formGroup.value['status']) {
      return PrimeIcons.THUMBS_DOWN_FILL;
    }
    return PrimeIcons.THUMBS_UP_FILL;
  }

  getSeverity(status: boolean) {
    switch (status) {
      case true:
        return 'success';
      case false:
        return 'danger';
    }
  }

  handleChange(e: any) {
    this.getCourses();
  }
}
