import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TeacherService } from '../../../services/teacher.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DomSanitizer } from '@angular/platform-browser';
import { LETTER_ICON } from '../../../../../../assets/svg/icons-svg';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../../shared-modules/shared-components/loading/loading.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    LoadingComponent,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.css',
})
export class AddCourseComponent {
  addCourseFormGroup!: FormGroup;
  spinnerStatus = false;

  constructor(
    public dialogRef: MatDialogRef<AddCourseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private teacherService: TeacherService,
    private formAddCourseBuilder: FormBuilder,
    public iconRegistry: MatIconRegistry,
    public sanitizer: DomSanitizer,
    private messageService: MessageService
  ) {
    this.registerIcons();
    this.createFormAddCourse();
  }

  registerIcons() {
    this.iconRegistry.addSvgIconLiteral(
      'iconLetter',
      this.sanitizer.bypassSecurityTrustHtml(LETTER_ICON)
    );
  }

  createFormAddCourse() {
    this.addCourseFormGroup = this.formAddCourseBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  callServiceAddCourse() {
    this.addCourseFormGroup.markAllAsTouched();
    if (this.addCourseFormGroup.valid) {
      this.spinnerStatus = true;
      this.teacherService.addCourse(this.addCourseFormGroup.value).subscribe(
        (data) => {
          this.spinnerStatus = false;
          this.dialogRef.close(true);
        },
        (error) => {
          this.spinnerStatus = false;
          this.dialogRef.close(false);
        }
      );
    } else {
      this.showToast(
        'informationToast',
        'error',
        'Ocurrió un error',
        'Por favor, ingrese todos los campos'
      );
    }
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
