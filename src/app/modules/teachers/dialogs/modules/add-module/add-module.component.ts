import { AsyncPipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Observable, map, skip, startWith } from 'rxjs';
import { LETTER_ICON } from '../../../../../../assets/svg/icons-svg';
import { CoursesResponse } from '../../../interfaces/courses.interface';
import { ModuleService } from '../../../services/module.service';
import { TeacherService } from '../../../services/teacher.service';
import { LoadingComponent } from '../../../../../shared-modules/components/loading/loading.component';
import { MatGridListModule } from '@angular/material/grid-list';
@Component({
  selector: 'app-add-module',
  standalone: true,
  imports: [
    LoadingComponent,
    ToastModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    FormsModule,
    MatCheckboxModule,
    AsyncPipe,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatGridListModule
  ],
  providers: [MessageService],
  templateUrl: './add-module.component.html',
  styleUrl: './add-module.component.css',
})
export class AddModuleComponent {
  addModuleFormGroup!: FormGroup;
  spinnerStatus = false;
  formGroup!: FormGroup;
  filteredOptions!: Observable<any[]>;
  myControl = new FormControl<any>('', [Validators.required]);
  courses!: CoursesResponse[];

  constructor(
    public dialogRef: MatDialogRef<AddModuleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formAddCourseBuilder: FormBuilder,
    private moduleService: ModuleService,
    private teacherService: TeacherService,
    public iconRegistry: MatIconRegistry,
    public sanitizer: DomSanitizer,
    private messageService: MessageService
  ) {
    this.registerIcons();
    this.createFormAddCourse();
  }

  ngOnInit() {
    this.getCourses();
  }

  getCourses() {
    this.teacherService.getMyCoursesByTeacher(true).subscribe((response) => {
      this.courses = Array.from(
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
          return name ? this._filter(name as string) : this.courses.slice();
        })
      );
    });
  }

  displayFn(course: { name: string; id: number }): string {
    return course && course.name ? course.name : '';
  }

  private _filter(name: string) {
    const filterValue = name.toLowerCase();
    return this.courses.filter((option: { name: string; id: string }) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  registerIcons() {
    this.iconRegistry.addSvgIconLiteral(
      'iconLetter',
      this.sanitizer.bypassSecurityTrustHtml(LETTER_ICON)
    );
  }

  createFormAddCourse() {
    this.addModuleFormGroup = this.formAddCourseBuilder.group({
      name: ['', [Validators.required]],
      goals: ['', [Validators.required]],
      isPublic: [true, [Validators.required]],
    });
    if (this.data != null) {
      this.addModuleFormGroup.patchValue(this.data.form);
    }
  }

  callServiceAddModule() {
    this.addModuleFormGroup.markAllAsTouched();
    if (this.data) {
      if (this.addModuleFormGroup.valid) {
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
      if (this.addModuleFormGroup.valid && this.myControl.valid) {
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
    this.moduleService
      .createModule(this.addModuleFormGroup.value, this.myControl.value.id)
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
    this.moduleService
      .updateModule(this.addModuleFormGroup.value, this.data.id)
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

  showToast(keyToast: string, type: string, title: string, message: string) {
    this.messageService.clear();
    this.messageService.add({
      key: keyToast,
      severity: type,
      summary: title,
      detail: message,
    });
  }

  generateGoals() {
    if (this.addModuleFormGroup.controls.name.value !== '') {
      this.moduleService.generateGoals(this.addModuleFormGroup.controls.name.value).subscribe( (data: any) => {
        this.addModuleFormGroup.controls.goals.setValue(data.data);
      }, (error) => {
        this.showToast('informationToast', 'error', 'Ocurrió un error al generar los objetivos', 'Por favor, intente de nuevo');
      });
    }
  }
}
