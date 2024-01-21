import { Component, Inject } from '@angular/core';
import { LoadingComponent } from '../../../../shared-modules/shared-components/loading/loading.component';
import { ToastModule } from 'primeng/toast';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AsyncPipe } from '@angular/common';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModuleService } from '../../../services/module.service';
import { TeacherService } from '../../../services/teacher.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { CoursesResponse } from '../../../interfaces/courses.interface';
import { Observable, map, skip, startWith } from 'rxjs';
import { LETTER_ICON } from '../../../../../../assets/svg/icons-svg';

@Component({
  selector: 'app-move-module',
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
  templateUrl: './move-module.component.html',
  styleUrl: './move-module.component.css',
})
export class MoveModuleComponent {
  spinnerStatus = false;
  myControl = new FormControl<any>('', [Validators.required]);
  courses!: CoursesResponse[];
  filteredOptions!: Observable<any[]>;

  constructor(
    public dialogRef: MatDialogRef<MoveModuleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private moduleService: ModuleService,
    private teacherService: TeacherService,
    public iconRegistry: MatIconRegistry,
    public sanitizer: DomSanitizer,
    private messageService: MessageService
  ) {
    this.registerIcons();
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
      let defaultValue = this.courses.find(
        (course) => course.name === this.data.name
      );
      this.myControl.patchValue(defaultValue);
      this.filteredOptions = this.myControl.valueChanges.pipe(
        skip(1),
        startWith(''),
        map((value: any) => {
          const name = typeof value === 'string' ? value : value?.name;
          return name ? this._filter(name as string) : this.courses.slice();
        })
      );
    });
  }

  callServiceMoveModule() {
    console.log(this.myControl.value);
    console.log(this.data);
    this.spinnerStatus = true;
    this.moduleService
      .moveModuleToAnotherCourse(this.data.id, this.myControl.value.id)
      .subscribe(
        (response) => {
          this.spinnerStatus = false;
          this.showToast(
            'informationToast',
            'success',
            'Módulo movido',
            'El módulo se movió correctamente'
          );
          this.dialogRef.close(true);
        },
        (error) => {
          this.spinnerStatus = false;
          this.showToast(
            'informationToast',
            'error',
            'Error al mover el módulo',
            error.error.message
          );
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
}
