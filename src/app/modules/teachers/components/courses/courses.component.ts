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
import { MessageService, ConfirmationService } from 'primeng/api';
import { LoadingComponent } from '../../../shared-modules/shared-components/loading/loading.component';
import { EditCourseComponent } from '../../dialogs/edit-course/edit-course.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

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
    ConfirmDialogModule,
    TooltipModule,
    LoadingComponent,
  ],
  providers: [MessageService, ConfirmationService],
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
    private confirmationService: ConfirmationService,
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

  openDialogEditCourse(
    courseName: string,
    courseDescription: string,
    courseId: string
  ): void {
    const dialogRef = this.dialogStudents.open(EditCourseComponent, {
      data: { name: courseName, description: courseDescription, id: courseId },
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

  activaOrDesactivateCourse(status: boolean, event: Event, courseId: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: this.messageToastFailed(status, 1),
      header: 'Confirmación',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.callServiceChangeStatus(status, courseId);
      },
      reject: () => {
        this.showToast(
          'informationToast',
          'error',
          'Ocurrió un error',
          this.messageToastFailed(status, 3)
        );
      },
    });
  }

  messageToastFailed(status: boolean, caseMessage: number) {
    let message = '';
    let stringStatus = status ? 'desactivar' : 'activar';
    switch (caseMessage) {
      case 1:
        message = '¿Esta seguro de ' + stringStatus + ' el curso?';
        break;
      case 2:
        message = 'El curso se logro ' + stringStatus + ' correctamente';
        break;
      case 3:
        message = 'El curso no se logro ' + stringStatus + ' correctamente';
        break;
    }
    console.log(message);
    return message;
  }

  callServiceChangeStatus(status: boolean, courseId: string) {
    this.spinnerStatus = true;
    this.teacherService.changeStatusCourse(courseId).subscribe(
      (data) => {
        this.spinnerStatus = false;
        console.log(data);
        this.showToast(
          'informationToast',
          'success',
          'Proceso exitoso',
          this.messageToastFailed(status, 2)
        );
        this.getCourses();
      },
      (error) => {
        this.spinnerStatus = false;
      }
    );
  }
}
