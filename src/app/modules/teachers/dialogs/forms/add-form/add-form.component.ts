import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DomSanitizer } from '@angular/platform-browser';
import moment from 'moment-timezone';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Observable, map, skip, startWith } from 'rxjs';
import {
  DATE_ICON,
  LETTER_ICON,
  QUESTION_ICON,
} from '../../../../../../assets/svg/icons-svg';
import { LoadingComponent } from '../../../../../shared-modules/components/loading/loading.component';
import { ModuleResponse } from '../../../interfaces/modules.interface';
import { FormsService } from '../../../services/forms.service';
import { ModuleService } from '../../../services/module.service';
import { AddQuestionsComponent } from '../add-questions/add-questions.component';

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
    MatDialogClose
  ],
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
  textButtonQuestions = 'Agregar preguntas';
  minDate!: Date;
  minDateEnd!: Date;

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
    if (data?.type == 'view' || data?.type == 'edit') {
      this.data.form.startDate = moment(this.data.form.startDate)
        .locale('es')
        .tz('America/Guayaquil');
      this.data.form.endDate = moment(this.data.form.endDate)
        .locale('es')
        .tz('America/Guayaquil');
    }
    this.createAddForm();
  }

  ngOnInit() {
    if (this.data?.type == 'view') {
      this.textButtonQuestions = 'Ver preguntas';
    } else if (this.data?.type == 'edit') {
      this.textButtonQuestions = 'Editar preguntas';
    }
    this.dateMin();
    this.getModules();
  }

  registerIcons() {
    this.iconRegistry.addSvgIconLiteral(
      'iconLetter',
      this.sanitizer.bypassSecurityTrustHtml(LETTER_ICON)
    );
    this.iconRegistry.addSvgIconLiteral(
      'iconQuestion',
      this.sanitizer.bypassSecurityTrustHtml(QUESTION_ICON)
    );
    this.iconRegistry.addSvgIconLiteral(
      'iconDate',
      this.sanitizer.bypassSecurityTrustHtml(DATE_ICON)
    );
  }

  dateMin() {
    const currentDate = new Date();
    this.minDate = currentDate;
    if (this.data?.type == 'edit') {
      this.minDateEnd = this.data.form.startDate.clone().add(1, 'days');
    }
    this.addFormGroup.valueChanges.subscribe((value) => {
      if (value.startDate != null) {
        this.minDateEnd = value.startDate.clone().add(1, 'days');
      }
    });
  }

  getModules() {
    this.moduleService.getAllModules(true).subscribe((response) => {
      this.modules = Array.from(
        new Set(
          response.data.map((course) =>
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
    return course?.name ?? '';
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
    });
    if (this.data?.type == 'view') {
      this.addFormGroup.patchValue(this.data.form);
      this.addFormGroup.get('questions')?.setValue('Preguntas');
      this.temporalQuestions = this.data.form.questions;
      this.myControl.setValue(this.data.moduleName);
    } else if (this.data?.type == 'edit') {
      this.addFormGroup.patchValue(this.data.form);
      this.addFormGroup.get('questions')?.setValue('Preguntas');
      this.temporalQuestions = this.data.form.questions;
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
      if (result != undefined) {
        this.addFormGroup.get('questions')?.setValue('Preguntas agregadas');
        this.temporalQuestions = result;
        this.textButtonQuestions = 'Editar preguntas';
      } else {
        this.addFormGroup.get('questions')?.markAsTouched();
      }
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
      questionsAndAnswers: this.temporalQuestions,
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
