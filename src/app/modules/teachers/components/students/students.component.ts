import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { LoadingComponent } from '../../../../shared-modules/components/loading/loading.component';
import { MatDialog } from '@angular/material/dialog';
import { StudentsService } from '../../services/students.service';
import { StudentsByTeacherResponse } from '../../interfaces/courses-students.interface';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    TooltipModule,
    TagModule,
    TableModule,
    ToastModule,
    LoadingComponent,
    ConfirmDialogModule,
    MultiSelectModule,
    CommonModule,
    ToolbarModule,
    DropdownModule,
    ReactiveFormsModule,
    FormsModule,
    SelectButtonModule,
  ],
  providers: [MessageService, ConfirmationService, StudentsService],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css',
})
export class StudentsComponent {
  students!: StudentsByTeacherResponse[];
  formGroup!: FormGroup;
  spinnerStatus = false;
  coursesNames: any;
  selectedCourse!: any;

  stateOptions: any[] = [
    { label: 'Activos', value: true },
    { label: 'Inactivos', value: false },
  ];

  constructor(
    public dialog: MatDialog,
    private studentService: StudentsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.formGroup = new FormGroup({
      status: new FormControl(true),
    });
    this.getAllStudents();
  }

  getAllStudents() {
    this.spinnerStatus = true;
    this.studentService
      .getStudentsByTeacher(this.formGroup.value['status'])
      .subscribe(
        (response) => {
          this.spinnerStatus = false;
          this.students = response.data!;
          this.coursesNames = Array.from(
            new Set(
              response.data!.map((module) =>
                JSON.stringify({
                  name: module.course.name,
                  id: module.course.id,
                })
              )
            )
          ).map((course) => JSON.parse(course));
        },
        (error) => {
          this.spinnerStatus = false;
          this.showToast(
            'informationToast',
            'error',
            'Ocurrió un error',
            'No se lograron obtener los estudiantes'
          );
        }
      );
  }

  filterByCourse() {
    if (this.selectedCourse == null) {
      this.getAllStudents();
      return;
    }
    this.spinnerStatus = true;
    this.studentService
      .getStudentsByCourse(
        this.selectedCourse.id,
        this.formGroup.value['status']
      )
      .subscribe(
        (response) => {
          this.spinnerStatus = false;
          this.students = response.data!;
        },
        (error) => {
          this.spinnerStatus = false;
          this.showToast(
            'informationToast',
            'error',
            'Ocurrió un error',
            'No se lograron obtener los módulos'
          );
        }
      );
  }

  exportToExcel() {}

  handleChange(e: any) {
    this.selectedCourse = null;
    this.getAllStudents();
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
}
