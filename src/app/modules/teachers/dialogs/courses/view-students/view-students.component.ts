import { TeacherService } from '../../../services/teacher.service';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService, PrimeIcons } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { StudentsService } from '../../../services/students.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

registerLocaleData(localeEs);

@Component({
  selector: 'app-view-students',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    SelectButtonModule,
    TagModule,
    TooltipModule,
    ToastModule,
    ConfirmDialogModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    ConfirmationService,
    MessageService,
  ],
  templateUrl: './view-students.component.html',
  styleUrl: './view-students.component.css',
})
export class ViewStudentsComponent {
  students!: any[];
  formGroup!: FormGroup;
  today = new Date();

  stateOptions: any[] = [
    { label: 'Activos', value: true },
    { label: 'Inactivos', value: false },
  ];

  constructor(
    public dialogRef: MatDialogRef<ViewStudentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private teacherService: TeacherService,
    private studentService: StudentsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.formGroup = new FormGroup({
      status: new FormControl(true),
    });
    this.getStudents();
  }

  getStudents() {
    this.teacherService
      .getStudentsByCourse(this.data.courseId, this.formGroup.value['status'])
      .subscribe((data) => {
        this.students = data.data!;
      });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  handleChange(e: any) {
    this.getStudents();
  }

  getSeverity(status: boolean) {
    switch (status) {
      case true:
        return 'success';
      case false:
        return 'danger';
    }
  }

  iconActions() {
    if (this.formGroup.value['status']) {
      return PrimeIcons.THUMBS_DOWN_FILL;
    }
    return PrimeIcons.THUMBS_UP_FILL;
  }

  ageCalculate(birthDate: Date) {
    const fechaNacimientoDate = new Date(birthDate);
    let edad = this.today.getFullYear() - fechaNacimientoDate.getFullYear();
    return edad + ' años';
  }

  activateOrDesactivateStudent(event: Event, studentId: string) {
    console.log(event);
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: this.messageToastFailed(this.formGroup.value.status, 1),
      header: 'Confirmación',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.callServiceChangeStatus(studentId, this.formGroup.value.status);
      },
      reject: () => {
        this.showToast(
          'informationToast',
          'info',
          'No se completó la operación',
          this.messageToastFailed(this.formGroup.value.status, 3)
        );
      },
    });
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

  messageToastFailed(status: boolean, caseMessage: number) {
    let message = '';
    let stringStatus = status ? 'desactivar' : 'activar';
    switch (caseMessage) {
      case 1:
        message =
          '¿Esta seguro de ' + stringStatus + ' el estudiante del curso?';
        break;
      case 2:
        message = 'El estudiante se logro ' + stringStatus + ' correctamente';
        break;
      case 3:
        message = 'Se canceló la acción';
        break;
      case 4:
        message = 'No se logró  realizar correctamente la operación';
        break;
    }
    return message;
  }

  callServiceChangeStatus(studentId: string, status: boolean) {
    this.studentService
      .changeStatusStudent(studentId, this.data?.courseId)
      .subscribe(
        (response) => {
          this.getStudents();
          this.showToast(
            'informationToast',
            'success',
            'Proceso exitoso',
            this.messageToastFailed(status, 2)
          );
        },
        (error) => {
          this.showToast(
            'informationToast',
            'error',
            'Ocurrió un error',
            this.messageToastFailed(status, 4)
          );
        }
      );
  }
}
