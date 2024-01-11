import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {
  EYE_OFF_ICON,
  EYE_ON_ICON,
  LOCK_ICON,
  MAIL_ICON,
} from '../../../../../assets/svg/icons-svg';
import { SecurityService } from '../../services/security.service';
import { UserType } from '../../enums/user-type.enum';
import { LoadingComponent } from '../../../shared-modules/shared-components/loading/loading.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    LoadingComponent,
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ToastModule,
  ],
  providers: [SecurityService, MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  //VARIABLES
  spinnerStatus = false;
  hide = true;
  loginFormGroup!: FormGroup;

  constructor(
    public iconRegistry: MatIconRegistry,
    public securityService: SecurityService,
    public sanitizer: DomSanitizer,
    private messageService: MessageService,
    public router: Router,
    public loginFormBuilder: FormBuilder
  ) {
    this.registerIcons();
    this.configureLoginForm();
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
  }

  configureLoginForm() {
    this.loginFormGroup = this.loginFormBuilder.group({
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
      password: ['', [Validators.required]],
    });
  }

  buttonLogin() {
    this.loginFormGroup.markAllAsTouched();
    if (this.loginFormGroup.invalid) {
      this.showToast(
        'informationToast',
        'error',
        'Ocurrió un error',
        'Debes ingresar todos los campos'
      );
    } else {
      this.callLoginService();
    }
  }

  callLoginService() {
    this.spinnerStatus = true;
    this.securityService.login(this.loginFormGroup.value).subscribe(
      (data) => {
        this.spinnerStatus = false;
        sessionStorage.setItem('token', JSON.stringify(data.data.token));
        this.showToast(
          'informationToast',
          'success',
          'Inicio de sesión exitoso',
          'Bienvenido '
        );
        if (data.data.role == UserType.STUDENT) {
          setTimeout(() => {
            this.router.navigateByUrl('/students');
          }, 1000);
        } else {
        }
      },
      (err) => {
        this.spinnerStatus = false;
        this.showToast(
          'informationToast',
          'error',
          'Inicio de sesión fallido',
          'Revisa las credenciales'
        );
      }
    );
  }

  forgotPassword() {}

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
