import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormArray,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD MM YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'MM',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-add-questions',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    DividerModule,
    NzIconModule,
    MatDividerModule,
    MatRadioModule,
    MatCheckboxModule,
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
  providers: [
    MessageService,
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddQuestionsComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddQuestionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private messageService: MessageService,
    private fb: NonNullableFormBuilder,
    private fbQuestion: NonNullableFormBuilder
  ) {}

  hiddenRemove(index: number) {
    if (this.data?.action == 'view') {
      return true;
    }
    if (index == 0) {
      return true;
    } else {
      return false;
    }
  }

  addAnswer(index: number) {
    const answers = (this.form.get('questions') as FormArray)
      .at(index)
      .get('answers') as FormArray;
    if (answers.length < 5) {
      answers.push(
        this.fb.control('', {
          validators: [Validators.required],
        })
      );
    } else {
      this.showToast(
        'info',
        'Se excedió el número de opciones',
        'Informamos que el número máximo de opciones son 5'
      );
    }
  }

  removeAnswer(questionIndex: number, answerIndex: number) {
    const answers = (this.form.get('questions') as FormArray)
      .at(questionIndex)
      .get('answers') as FormArray;
    answers.removeAt(answerIndex);
  }

  ngOnInit() {
    if (this.data?.action == 'edit' || this.data?.action == 'view') {
      this.form = this.fb.group({
        questions: this.fb.array([]),
      });
      for (let index = 0; index < this.data.data.length; index++) {
        const questions = this.form.get('questions') as FormArray;
        questions.push(
          this.fb.group({
            question: this.fb.control(this.data.data[index].question, [
              Validators.required,
            ]),
            correctAnswer: this.fb.control(
              this.data.data[index].correctAnswer,
              [Validators.required]
            ),
            answers: this.fb.array([]),
          })
        );
        for (let j = 0; j < this.data.data[index].answers.length; j++) {
          const answers = (this.form.get('questions') as FormArray)
            .at(index)
            .get('answers') as FormArray;
          answers.push(
            this.fb.control(this.data.data[index].answers[j], [
              Validators.required,
            ])
          );
        }
      }
    } else {
      this.form = this.fb.group({
        questions: this.fb.array([
          this.fb.group({
            question: ['', [Validators.required]],
            correctAnswer: this.fb.control('', [Validators.required]),
            answers: this.fb.array([this.fb.control('', Validators.required)]),
          }),
        ]),
      });
    }
  }

  saveQuestionsOrAnswers() {
    if (this.data?.action != 'view') {
      this.form.markAllAsTouched();
      if (this.form.valid) {
        this.dialogRef.close(this.form.value.questions);
      } else {
        this.showToast(
          'warn',
          'Formulario No Válido',
          'Por favor verifique los campos obligatorios'
        );
      }
    } else {
      this.dialogRef.close();
    }
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

  addQuestion() {
    const questions = this.form.get('questions') as FormArray;
    questions.push(
      this.fb.group({
        question: this.fb.control('', Validators.required),
        correctAnswer: this.fb.control('', Validators.required),
        answers: this.fb.array([this.fb.control('', [Validators.required])]),
      })
    );
  }

  removeQuestion(index: number) {
    const questions = this.form.get('questions') as FormArray;
    questions.removeAt(index);
  }
}
