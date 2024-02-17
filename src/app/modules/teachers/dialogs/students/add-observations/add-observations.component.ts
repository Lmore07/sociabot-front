import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { LoadingComponent } from '../../../../../shared-modules/components/loading/loading.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ToastModule } from 'primeng/toast';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { LETTER_ICON } from '../../../../../../assets/svg/icons-svg';
import { TeacherService } from '../../../services/teacher.service';

@Component({
  selector: 'app-add-observations',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    LoadingComponent,
    NzButtonModule,
    MatDatepickerModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './add-observations.component.html',
  styleUrl: './add-observations.component.css',
})
export class AddObservationsComponent {
  addFormGroup!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddObservationsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formAddCourseBuilder: FormBuilder,
    public iconRegistry: MatIconRegistry,
    private teacherService: TeacherService,
    public sanitizer: DomSanitizer,
    private messageService: MessageService
  ) {
    this.registerIcons();
    this.createAddForm();
  }

  registerIcons() {
    this.iconRegistry.addSvgIconLiteral(
      'iconLetter',
      this.sanitizer.bypassSecurityTrustHtml(LETTER_ICON)
    );
  }

  createAddForm() {
    this.addFormGroup = this.formAddCourseBuilder.group({
      observations: [this.data.observations ?? '', [Validators.required]],
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

  callServiceAddForm() {
    this.addFormGroup.markAllAsTouched();
    if (this.addFormGroup.valid) {
      this.teacherService
        .addObservations(this.data.id, this.addFormGroup.value)
        .subscribe(
          (data: any) => {
            this.dialogRef.close(true);
          },
          (error) => {
            this.showToast(
              'informationToast',
              'error',
              'Ocurrió un error',
              'Observación no se agregó'
            );
            this.dialogRef.close(false);
          }
        );
    } else {
      this.showToast(
        'informationToast',
        'error',
        'Ocurrió un error',
        'No ha agregado observaciones'
      );
    }
  }
}
