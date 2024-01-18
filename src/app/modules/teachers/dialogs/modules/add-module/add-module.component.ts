import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { LETTER_ICON } from '../../../../../../assets/svg/icons-svg';
import { LoadingComponent } from '../../../../shared-modules/shared-components/loading/loading.component';
import { ToastModule } from 'primeng/toast';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ModuleService } from '../../../services/module.service';
import { TeacherService } from '../../../services/teacher.service';

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
      this.data = Array.from(
        new Set(
          response.data!.map((course) =>
            JSON.stringify({
              name: course.name,
              id: course.id,
            })
          )
        )
      ).map((course) => JSON.parse(course));
      this.filteredOptions = this.myControl!.valueChanges.pipe(
        startWith(''),
        map((value: any) => {
          const name = typeof value === 'string' ? value : value?.name;
          return name ? this._filter(name as string) : this.data.slice();
        })
      );
    });
  }

  displayFn(course: { name: string; id: number }): string {
    return course && course.name ? course.name : '';
  }

  private _filter(name: string) {
    const filterValue = name.toLowerCase();
    return this.data.filter((option: { name: string; id: string }) =>
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
  }

  callServiceAddModule() {
    console.log(this.myControl.value.id);
    console.log(this.addModuleFormGroup.value);
    this.addModuleFormGroup.markAllAsTouched();
    if (this.addModuleFormGroup.valid && this.myControl.valid) {
      this.spinnerStatus = true;
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
