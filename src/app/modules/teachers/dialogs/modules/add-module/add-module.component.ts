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
import {AsyncPipe} from '@angular/common';

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
  myControl = new FormControl<string>('');

  constructor(
    public dialogRef: MatDialogRef<AddModuleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formAddCourseBuilder: FormBuilder,
    public iconRegistry: MatIconRegistry,
    public sanitizer: DomSanitizer,
    private messageService: MessageService
  ) {
    this.registerIcons();
    this.createFormAddCourse();
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      courseId: new FormControl('', [Validators.required]),
    });
    this.filteredOptions = this.formGroup.get('courseId')?.value.valueChanges.pipe(
      startWith(''),
      map((value: any) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.data.courses.slice();
      })
    );
  }

  private _filter(name: string) {
    const filterValue = name.toLowerCase();
    return this.data.courses.filter((option: { name: string; id: string }) =>
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
    console.log(this.addModuleFormGroup);
  }
}
