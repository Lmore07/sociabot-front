import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DATE_ICON, LETTER_ICON } from '../../../../../../assets/svg/icons-svg';
import { LoadingComponent } from '../../../../../shared-modules/components/loading/loading.component';
import { FormsService } from '../../../services/forms.service';
import { ModuleService } from '../../../services/module.service';
import { ModuleResponse } from '../../../interfaces/modules.interface';
import { Observable, map, skip, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AddQuestionsComponent } from '../add-questions/add-questions.component';

@Component({
  selector: 'app-add-form',
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
  templateUrl: './add-form.component.html',
  styleUrl: './add-form.component.css',
})
export class AddFormComponent {
  addFormGroup!: FormGroup;
  spinnerStatus = false;
  modules!: ModuleResponse[];
  myControl = new FormControl<any>('', [Validators.required]);
  filteredOptions!: Observable<any[]>;
  temporalQuestions!: [];
  temporalAnswers!: [];
  textButtonQuestions = 'Agregar Preguntas';
  textButtonAnswers = 'Agregar Respuestas';

  constructor(
    public dialogRef: MatDialogRef<AddFormComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formService: FormsService,
    private moduleService: ModuleService,
    private formAddCourseBuilder: FormBuilder,
    public iconRegistry: MatIconRegistry,
    public sanitizer: DomSanitizer,
    private messageService: MessageService
  ) {
    this.registerIcons();
    this.createAddForm();
  }

  ngOnInit() {
    console.log(this.data);
    console.log('probando');
    if (this.data?.type == 'view') {
      this.textButtonQuestions = 'Ver preguntas';
      this.textButtonAnswers = 'Ver respuestas';
    } else if (this.data?.type == 'edit') {
      this.textButtonQuestions = 'Editar preguntas';
      this.textButtonAnswers = 'Editar respuestas';
    }
    this.getModules();
  }

  registerIcons() {
    this.iconRegistry.addSvgIconLiteral(
      'iconLetter',
      this.sanitizer.bypassSecurityTrustHtml(LETTER_ICON)
    );
    this.iconRegistry.addSvgIconLiteral(
      'iconDate',
      this.sanitizer.bypassSecurityTrustHtml(DATE_ICON)
    );
  }

  getModules() {
    this.moduleService.getAllModules(true).subscribe((response) => {
      this.modules = Array.from(
        new Set(
          response.data!.map((course) =>
            JSON.stringify({
              name: course.name,
              id: course.id,
            })
          )
        )
      ).map((course) => JSON.parse(course));
      if (this.data != null) {
        let defaultValue = response.data!.find(
          (course) => course.name === this.data.form.name
        );
        this.myControl.patchValue(defaultValue);
      }
      this.filteredOptions = this.myControl!.valueChanges.pipe(
        skip(1),
        startWith(''),
        map((value: any) => {
          const name = typeof value === 'string' ? value : value?.name;
          return name ? this._filter(name as string) : this.modules.slice();
        })
      );
    });
  }

  displayFn(course: { name: string; id: number }): string {
    return course && course.name ? course.name : '';
  }

  private _filter(name: string) {
    const filterValue = name.toLowerCase();
    return this.modules.filter((option: ModuleResponse) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  createAddForm() {
    this.addFormGroup = this.formAddCourseBuilder.group({
      name: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      questions: ['', Validators.required],
      answers: ['', Validators.required],
    });
    if (this.data?.type == 'view') {
      this.addFormGroup.patchValue(this.data.form);
      this.addFormGroup.get('questions')?.setValue('Preguntas');
      this.addFormGroup.get('answers')?.setValue('Respuestas');
      this.temporalQuestions = this.data.form.questions;
      this.temporalAnswers = this.data.form.answers;
      this.myControl.setValue(this.data.moduleName);
    } else if (this.data?.type == 'edit') {
      this.addFormGroup.patchValue(this.data.form);
      this.addFormGroup.get('questions')?.setValue('Preguntas');
      this.addFormGroup.get('answers')?.setValue('Respuestas');
      this.temporalQuestions = this.data.form.questions;
      this.temporalAnswers = this.data.form.answers;
    }
  }

  callServiceAddForm() {
    this.addFormGroup.markAllAsTouched();
    if (this.data?.type == 'edit') {
      if (this.addFormGroup.valid) {
        this.spinnerStatus = true;
        this.editModuleService();
      } else {
        this.showToast(
          'informationToast',
          'error',
          'Ocurrió un error',
          'Por favor, ingrese todos los campos'
        );
      }
    } else {
      if (this.addFormGroup.valid && this.myControl.valid) {
        this.spinnerStatus = true;
        this.addModuleService();
      } else {
        this.showToast(
          'informationToast',
          'error',
          'Ocurrió un error',
          'Por favor, ingrese todos los campos'
        );
      }
    }
  }

  addQuestions() {
    let dialogRef;
    if (this.textButtonQuestions == 'Editar preguntas') {
      dialogRef = this.dialog.open(AddQuestionsComponent, {
        data: {
          type: 'questions',
          action: 'edit',
          data: this.temporalQuestions,
        },
      });
    } else if (this.textButtonQuestions == 'Agregar preguntas') {
      dialogRef = this.dialog.open(AddQuestionsComponent, {
        data: {
          type: 'questions',
          action: 'add',
        },
      });
    } else {
      dialogRef = this.dialog.open(AddQuestionsComponent, {
        data: {
          type: 'questions',
          action: 'view',
          data: this.temporalQuestions,
        },
      });
    }

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      console.log('The dialog was closed');
      if (result != undefined) {
        this.addFormGroup.get('questions')?.setValue('Preguntas agregadas');
        this.temporalQuestions = result;
        this.textButtonQuestions = 'Editar preguntas';
      } else {
        this.addFormGroup.get('questions')?.markAsTouched();
      }
    });
  }

  addAnswers() {
    let dialogRef;
    if (this.textButtonAnswers == 'Editar respuestas') {
      dialogRef = this.dialog.open(AddQuestionsComponent, {
        data: {
          type: 'answers',
          action: 'edit',
          data: this.temporalAnswers,
        },
      });
    } else if (this.textButtonAnswers == 'Agregar respuestas') {
      dialogRef = this.dialog.open(AddQuestionsComponent, {
        data: {
          type: 'answers',
          action: 'add',
        },
      });
    } else {
      dialogRef = this.dialog.open(AddQuestionsComponent, {
        data: {
          type: 'answers',
          action: 'view',
          data: this.temporalAnswers,
        },
      });
    }

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.addFormGroup.get('answers')?.setValue('Respuestas agregadas');
        this.temporalAnswers = result;
        this.textButtonAnswers = 'Editar respuestas';
      } else {
        this.addFormGroup.get('answers')?.markAsTouched();
      }
      console.log('The dialog was closed');
      console.log(result);
    });
  }

  addModuleService() {
    this.formService
      .createForm(this.formatDataToCreateForm(), this.myControl.value.id)
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

  editModuleService() {
    console.log('Id de formulario a modificar: ' + this.data.id);
    this.formService
      .updateForm(this.formatDataToCreateForm(), this.data?.id)
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

  formatDataToCreateForm() {
    return {
      name: this.addFormGroup.get('name')?.value,
      startDate: this.addFormGroup.get('startDate')?.value,
      endDate: this.addFormGroup.get('endDate')?.value,
      questionsAndAnswers: [
        {
          questions: this.temporalQuestions,
          answers: this.temporalAnswers,
        },
      ],
    };
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
