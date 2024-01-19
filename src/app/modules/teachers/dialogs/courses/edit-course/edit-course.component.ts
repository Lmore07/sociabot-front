import { Component, Inject } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DomSanitizer } from '@angular/platform-browser';
import { LETTER_ICON } from '../../../../../../assets/svg/icons-svg';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../../shared-modules/shared-components/loading/loading.component';
import { ToastModule } from 'primeng/toast';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TeacherService } from '../../../services/teacher.service';

@Component({
  selector: 'app-edit-course',
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
  providers: [],
  templateUrl: './edit-course.component.html',
  styleUrl: './edit-course.component.css',
})
export class EditCourseComponent {
  editCourseFormGroup!: FormGroup;
  spinnerStatus = false;

  constructor(
    public dialogRef: MatDialogRef<EditCourseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private teacherService: TeacherService,
    private formAddCourseBuilder: FormBuilder,
    public iconRegistry: MatIconRegistry,
    public sanitizer: DomSanitizer
  ) {
    this.registerIcons();
    this.createFormAddCourse();
  }

  ngOnInit() {
    console.log(this.data);
  }

  registerIcons() {
    this.iconRegistry.addSvgIconLiteral(
      'iconLetter',
      this.sanitizer.bypassSecurityTrustHtml(LETTER_ICON)
    );
  }

  createFormAddCourse() {
    this.editCourseFormGroup = this.formAddCourseBuilder.group({
      name: [this.data.name, [Validators.required]],
      description: [this.data.description, [Validators.required]],
    });
  }

  callServiceEditCourse() {
    this.spinnerStatus = true;
    this.teacherService
      .editCourse(this.data.id, this.editCourseFormGroup.value)
      .subscribe(
        (data) => {
          this.spinnerStatus = false;
          this.dialogRef.close(true);
        },
        (error) => {
          this.spinnerStatus = false;
          this.dialogRef.close(false);
        }
      );
  }
}
