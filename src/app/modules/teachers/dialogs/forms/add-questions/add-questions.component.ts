import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormControl,
  FormRecord,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-add-questions',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NzIconModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    NzButtonModule,
    MatDialogModule,
    ToastModule,
  ],
  templateUrl: './add-questions.component.html',
  styleUrl: './add-questions.component.css',
  providers: [MessageService],
})
export class AddQuestionsComponent {
  addQAFormGroup: FormRecord<FormControl<string>> = this.fb.record({});
  placeholderText!: string;
  listOfControl: Array<{ id: number; controlInstance: string }> = [];

  constructor(
    public dialogRef: MatDialogRef<AddQuestionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: NonNullableFormBuilder
  ) {}

  ngOnInit() {
    if (this.data?.type === 'questions') {
      this.placeholderText = 'El contenido de la pregunta';
    } else {
      this.placeholderText = 'El contenido de la respuesta';
    }
    if (this.data?.action == 'add') {
      this.addField();
    } else {
      this.addFieldForEdit();
    }
  }

  saveQuestionsOrAnswers() {
    if (this.data?.action != 'view') {
      let arrayJson: { [key: string]: string }[] = [];
      if (this.addQAFormGroup.valid) {
        Object.values(this.addQAFormGroup.controls).forEach(
          (control, index) => {
            arrayJson.push({
              [(this.data?.type == 'questions' ? 'question_' : 'answer_') +
              index]: control.value,
            });
          }
        );
        this.dialogRef.close(arrayJson);
      } else {
        Object.values(this.addQAFormGroup.controls).forEach((control) => {
          if (control.invalid) {
            control.markAsTouched();
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
    }else{
      this.dialogRef.close();
    }
  }

  addField(e?: MouseEvent): void {
    e?.preventDefault();
    const id =
      this.listOfControl.length > 0
        ? this.listOfControl[this.listOfControl.length - 1].id + 1
        : 0;
    const control = {
      id,
      controlInstance: `${
        this.data?.type == 'questions' ? 'questions' : 'answers'
      }${id}`,
    };
    const index = this.listOfControl.push(control);
    this.addQAFormGroup.addControl(
      this.listOfControl[index - 1].controlInstance,
      this.fb.control('', Validators.required)
    );
  }

  addFieldForEdit() {
    for (let index = 0; index < this.data?.data.length; index++) {
      const control = {
        id: index,
        controlInstance: `${
          this.data?.type == 'questions' ? 'questions' : 'answers'
        }${index}`,
      };
      this.listOfControl.push(control);
      this.addQAFormGroup.addControl(
        this.listOfControl[index].controlInstance,
        this.fb.control(
          this.data?.data[index][
            (this.data?.type == 'questions' ? 'question_' : 'answer_') + index
          ],
          Validators.required
        )
      );
    }
  }

  removeField(i: { id: number; controlInstance: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      this.addQAFormGroup.removeControl(i.controlInstance);
    }
  }
}
