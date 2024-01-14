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
import { MatDialog } from '@angular/material/dialog';
import { ViewStudentsComponent } from '../../dialogs/view-students/view-students.component';
import { AddCourseComponent } from '../../dialogs/add-course/add-course.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LoadingComponent } from '../../../shared-modules/shared-components/loading/loading.component';
import { EditCourseComponent } from '../../dialogs/edit-course/edit-course.component';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    TableModule,
    ToolbarModule,
    ButtonModule,
    ToastModule,
    SelectButtonModule,
    ReactiveFormsModule,
    TagModule,
    TooltipModule,
    LoadingComponent,
  ],
  providers: [MessageService],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css',
})
export class CoursesComponent {
  courses!: CoursesResponse[];
  formGroup!: FormGroup;
  spinnerStatus = false;

  stateOptions: any[] = [
    { label: 'Activos', value: true },
    { label: 'Inactivos', value: false },
  ];

  constructor(
    private teacherService: TeacherService,
    public dialogStudents: MatDialog,
    public dialogAdCourse: MatDialog,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.formGroup = new FormGroup({
      status: new FormControl(true),
    });
    this.getCourses();
  }

  getCourses() {
    this.spinnerStatus = true;
    this.teacherService
      .getMyCoursesByTeacher(this.formGroup.value['status'])
      .subscribe(
        (data) => {
          console.log(data);
          this.spinnerStatus = false;
          this.courses = data.data;
        },
        (error) => {
          this.spinnerStatus = false;
        }
      );
  }

  showToast(keyToast: string, type: string, title: string, message: string) {
    this.messageService.clear();
    this.messageService.add({
      key: keyToast,
      severity: type,
      summary: title,
      detail: message,
    });
  }

  exportToExcel() {}

  getSeverity(status: boolean) {
    switch (status) {
      case true:
        return 'success';
      case false:
        return 'danger';
    }
  }

  openDialogStudent(courseId: string, courseName: string): void {
    const dialogRef = this.dialogStudents.open(ViewStudentsComponent, {
      data: { courseId: courseId, courseName: courseName },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  openDialogAddCourse(): void {
    const dialogRef = this.dialogStudents.open(AddCourseComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {
        this.showToast(
          'informationToast',
          'success',
          'Proceso exitoso',
          'Curso creado correctamente'
        );
        this.getCourses();
      } else {
        this.showToast(
          'informationToast',
          'error',
          'Ocurrió un error',
          'Fallo al crear el curso'
        );
      }
      console.log('The dialog was closed');
    });
  }

  openDialogEditCourse(courseDescription: string, courseName: string): void {
    const dialogRef = this.dialogStudents.open(EditCourseComponent, {
      data: { name: courseName, courseDescription: courseDescription },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {
        this.showToast(
          'informationToast',
          'success',
          'Proceso exitoso',
          'Curso editado correctamente'
        );
        this.getCourses();
      } else {
        this.showToast(
          'informationToast',
          'error',
          'Ocurrió un error',
          'Fallo al editar el curso'
        );
      }
      console.log('The dialog was closed');
    });
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
