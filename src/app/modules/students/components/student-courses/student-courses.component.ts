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
import { MessageService, PrimeIcons } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { JoinCourseComponent } from '../join-course/join-course.component';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';

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
    DialogModule,
    JoinCourseComponent,
    RouterModule,
    ToastModule
  ],
  templateUrl: './student-courses.component.html',
  styleUrl: './student-courses.component.css',
  providers: [MessageService],
})
export class StudentCoursesComponent {

  visible: any;
  constructor(private service: CoursesService, private messageService: MessageService) { }
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
      }, (err: any) => {
        this.showToast(
          'info',
          'Ocurrió un error',
          'Lo sentimos no se pudo obtener los cursos 🙁'
        );
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

  showDialog() {
    this.visible = true;
  }

  showToast(type: string, title: string, message: string) {
    this.messageService.clear();
    this.messageService.add({
      key: 'informationToast',
      severity: type,
      summary: title,
      detail: message,
    });
  }
}
