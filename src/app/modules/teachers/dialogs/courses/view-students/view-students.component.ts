import { TeacherService } from '../../../services/teacher.service';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);

@Component({
  selector: 'app-view-students',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    SelectButtonModule,
    TagModule,
    TooltipModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }],
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
    private teacherService: TeacherService
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
}
