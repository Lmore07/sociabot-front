import { TeacherService } from './../../services/teacher.service';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CoursesResponse } from '../../interfaces/courses.interface';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-courses',
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
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css',
})
export class CoursesComponent {
  courses!: CoursesResponse[];
  formGroup!: FormGroup;

  stateOptions: any[] = [
    { label: 'Activos', value: true },
    { label: 'Inactivos', value: false },
  ];

  constructor(private teacherService: TeacherService) {}

  ngOnInit() {
    this.formGroup = new FormGroup({
      status: new FormControl(true),
    });
    this.getCourses();
  }

  getCourses() {
    this.teacherService
      .getMyCoursesByTeacher(this.formGroup.value['status'])
      .subscribe((data) => {
        console.log(data);
        this.courses = data.data;
      });
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

  iconActions() {
    if (this.formGroup.value['status']) {
      return PrimeIcons.THUMBS_DOWN_FILL;
    }
    return PrimeIcons.THUMBS_UP_FILL;
  }
}
