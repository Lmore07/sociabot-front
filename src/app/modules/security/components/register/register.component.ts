import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastModule } from 'primeng/toast';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MessageService } from 'primeng/api';
import { roleUserValidator } from '../../validators/role.validator';
import {
  CAKE_ICON,
  CALENDAR_ICON,
  EYE_OFF_ICON,
  EYE_ON_ICON,
  LETTER_ICON,
  LOCK_ICON,
  MAIL_ICON,
  ROLE_ICON,
} from '../../../../../assets/svg/icons-svg';
import { Router, RouterLink } from '@angular/router';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { dateRangeValidator } from '../../validators/dateBirthday.validator';
import { SecurityService } from '../../services/security.service';
import { LoadingComponent } from '../../../shared-modules/shared-components/loading/loading.component';

const moment = _rollupMoment || _moment;
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
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    ToastModule,
    KeyFilterModule,
    MatButtonModule,
    MatIconModule,
    LoadingComponent,
    MatChipsModule,
    MatSelectModule,
    RouterLink,
  ],
  providers: [
    MessageService,
    SecurityService,
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  //VARIABLES
  spinnerStatus = false;
  hide = true;
  signUpFormGroup!: FormGroup;
  minDate!: Date;
  maxDate!: Date;
  blockSpace: RegExp = /[^s]/;
  allowLetters: RegExp = /^[a-zA-ZÀ-ÿ\s]{1,50}$/;

  constructor(
    public iconRegistry: MatIconRegistry,
    public sanitizer: DomSanitizer,
    public router: Router,
    private securityService: SecurityService,
    private messageService: MessageService,
    public loginFormBuilder: FormBuilder
  ) {
    this.registerIcons();
    this.configureSignUpForm();
    this.minAndMaxDate();
  }

  registerIcons() {
    this.iconRegistry.addSvgIconLiteral(
      'iconLock',
      this.sanitizer.bypassSecurityTrustHtml(LOCK_ICON)
    );
    this.iconRegistry.addSvgIconLiteral(
      'iconEyeOff',
      this.sanitizer.bypassSecurityTrustHtml(EYE_OFF_ICON)
    );
    this.iconRegistry.addSvgIconLiteral(
      'iconEyeOn',
      this.sanitizer.bypassSecurityTrustHtml(EYE_ON_ICON)
    );
    this.iconRegistry.addSvgIconLiteral(
      'iconMail',
      this.sanitizer.bypassSecurityTrustHtml(MAIL_ICON)
    );
    this.iconRegistry.addSvgIconLiteral(
      'iconLetter',
      this.sanitizer.bypassSecurityTrustHtml(LETTER_ICON)
    );
    this.iconRegistry.addSvgIconLiteral(
      'iconCalendar',
      this.sanitizer.bypassSecurityTrustHtml(CALENDAR_ICON)
    );
    this.iconRegistry.addSvgIconLiteral(
      'iconRole',
      this.sanitizer.bypassSecurityTrustHtml(ROLE_ICON)
    );
    this.iconRegistry.addSvgIconLiteral(
      'iconCake',
      this.sanitizer.bypassSecurityTrustHtml(CAKE_ICON)
    );
  }

  minAndMaxDate() {
    const currentDate = new Date();
    this.maxDate = new Date();
    this.minDate = new Date(
      currentDate.getFullYear() - 80,
      currentDate.getMonth(),
      currentDate.getDate()
    );
  }

  configureSignUpForm() {
    this.signUpFormGroup = this.loginFormBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(
            /^(?!.*([._-]{2,}))[a-zA-Z0-9]+[a-zA-Z0-9._-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
          ),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*['"!@#$%^&*()_/+{}.:<>?-]).{8,20}$/
          ),
        ],
      ],
      role: ['', [Validators.required, roleUserValidator()]],
      gender: ['', [Validators.required]],
      firstName: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]{1,50}$/)],
      ],
      lastName: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]{1,50}$/)],
      ],
      birthDate: ['', [Validators.required, dateRangeValidator()]],
    });
  }

  callSignUpService() {
    this.signUpFormGroup.markAllAsTouched();
    console.log(this.signUpFormGroup);
    if (this.signUpFormGroup.invalid) {
      this.showToast(
        'informationToast',
        'error',
        'Ocurrió un error',
        'Verifica los datos ingresados'
      );
    } else {
      this.securityService.signUp(this.signUpFormGroup.value).subscribe(
        (data) => {
          this.showToast(
            'informationToast',
            'success',
            'Registro exitoso',
            'Vuelva a iniciar sesión'
          );
          setTimeout(() => {
            this.router.navigateByUrl('/login');
          }, 1000);
        },
        (error) => {
          this.showToast(
            'informationToast',
            'error',
            'Ocurrió un error',
            'Por favor, revisa que todo este correcto'
          );
        }
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
