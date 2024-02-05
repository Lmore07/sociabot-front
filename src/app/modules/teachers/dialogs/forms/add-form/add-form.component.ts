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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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

  constructor(
    public dialogRef: MatDialogRef<AddFormComponent>,
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
      this.myControl.setValue(this.data.moduleName);
    } else if (this.data?.type == 'edit') {
      this.addFormGroup.patchValue(this.data.form);
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
          questions: this.addFormGroup.get('questions')?.value,
          answers: this.addFormGroup.get('answers')?.value,
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
