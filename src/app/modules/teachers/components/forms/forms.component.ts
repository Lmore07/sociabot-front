import { QuestionsAndAnswers } from './../../interfaces/forms.interface';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationService, MessageService, PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { LoadingComponent } from '../../../../shared-modules/components/loading/loading.component';
import { TeacherService } from '../../services/teacher.service';
import { CommonModule, DatePipe } from '@angular/common';
import { AddFormComponent } from '../../dialogs/forms/add-form/add-form.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsService } from '../../services/forms.service';
import { FormsResponse } from '../../interfaces/forms.interface';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [
    TableModule,
    ToolbarModule,
    ButtonModule,
    ToastModule,
    CommonModule,
    SelectButtonModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    TagModule,
    ConfirmDialogModule,
    TooltipModule,
    LoadingComponent,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.css',
})
export class FormsComponent {
  forms!: FormsResponse[];
  formGroup!: FormGroup;
  spinnerStatus = false;
  modulesNames: any;
  selectedModule!: any;

  stateOptions: any[] = [
    { label: 'Activos', value: true },
    { label: 'Inactivos', value: false },
  ];

  constructor(
    private formsService: FormsService,
    public dialog: MatDialog,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.formGroup = new FormGroup({
      status: new FormControl(true),
    });
    this.getForms();
  }

  getForms() {
    this.spinnerStatus = true;
    this.formsService.getMyForms(this.formGroup.value['status']).subscribe(
      (response) => {
        this.spinnerStatus = false;
        this.forms = response.data!;
        this.modulesNames = Array.from(
          new Set(
            response.data!.map((module) =>
              JSON.stringify({
                name: module.module.name,
                id: module.module.id,
              })
            )
          )
        ).map((module) => JSON.parse(module));
      },
      (error) => {
        this.spinnerStatus = false;
        this.showToast(
          'informationToast',
          'error',
          'Ocurrió un error',
          'No se lograron obtener los formularios'
        );
      }
    );
  }

  handleChange(e: any) {
    this.selectedModule = null;
    this.getForms();
  }

  filterByModule() {
    if (this.selectedModule == null) {
      this.getForms();
      return;
    }
    this.spinnerStatus = true;
    this.formsService
      .getMyFormsByModule(
        this.selectedModule.id,
        this.formGroup.value['status']
      )
      .subscribe(
        (response) => {
          this.spinnerStatus = false;
          this.forms = response.data!;
        },
        (error) => {
          this.spinnerStatus = false;
          this.showToast(
            'informationToast',
            'error',
            'Ocurrió un error',
            'No se lograron obtener los formularios'
          );
        }
      );
  }

  openDialogAddForm(): void {
    const dialogRef = this.dialog.open(AddFormComponent, {
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.showToast(
          'informationToast',
          'success',
          'Proceso exitoso',
          'Formulario creado correctamente'
        );
        this.getForms();
      } else {
        this.showToast(
          'informationToast',
          'error',
          'Ocurrió un error',
          'Fallo al crear el formulario'
        );
      }
    });
  }

  exportToExcel() {}

  openDialogEditForm(
    formName: string,
    startDate: Date,
    endDate: Date,
    questionsAndAnswers: QuestionsAndAnswers[],
    formId: string
  ) {
    const dialogRef = this.dialog.open(AddFormComponent, {
      data: {
        type: 'edit',
        form: {
          name: formName,
          startDate: startDate,
          endDate: endDate,
          questions: questionsAndAnswers
        },
        id: formId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.showToast(
          'informationToast',
          'success',
          'Proceso exitoso',
          'Formulario actualizado correctamente'
        );
        this.getForms();
      } else {
        this.showToast(
          'informationToast',
          'error',
          'Ocurrió un error',
          'Fallo al actualizar el formulario'
        );
      }
    });
  }

  openDialogViewForm(
    formName: string,
    startDate: Date,
    endDate: Date,
    questionsAndAnswers: QuestionsAndAnswers[],
    moduleName: string
  ) {
    const dialogRef = this.dialog.open(AddFormComponent, {
      data: {
        type: 'view',
        form: {
          name: formName,
          startDate: startDate,
          endDate: endDate,
          questions: questionsAndAnswers
        },
        moduleName: moduleName,
      },
    });
  }

  iconActions() {
    if (this.formGroup.value['status']) {
      return PrimeIcons.THUMBS_DOWN_FILL;
    }
    return PrimeIcons.THUMBS_UP_FILL;
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

  messageToastFailed(status: boolean, caseMessage: number) {
    let message = '';
    let stringStatus = status ? 'desactivar' : 'activar';
    switch (caseMessage) {
      case 1:
        message = '¿Esta seguro de ' + stringStatus + ' el formulario?';
        break;
      case 2:
        message = 'El formulario se logro ' + stringStatus + ' correctamente';
        break;
      case 3:
        message =
          'El formulario no se logro ' + stringStatus + ' correctamente';
        break;
    }
    return message;
  }

  activaOrDesactivateForm(status: boolean, event: Event, moduleId: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: this.messageToastFailed(status, 1),
      header: 'Confirmación',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.callServiceChangeStatus(status, moduleId);
      },
      reject: () => {
        this.showToast(
          'informationToast',
          'error',
          'Ocurrió un error',
          this.messageToastFailed(status, 3)
        );
      },
    });
  }

  callServiceChangeStatus(status: boolean, formId: string) {
    this.spinnerStatus = true;
    this.formsService.changeStatusForm(formId).subscribe(
      (response) => {
        this.spinnerStatus = false;
        this.showToast(
          'informationToast',
          'success',
          'Proceso exitoso',
          this.messageToastFailed(status, 2)
        );
        if (this.selectedModule) {
          this.filterByModule();
        } else {
          this.getForms();
        }
      },
      (error) => {
        this.spinnerStatus = false;
        this.showToast(
          'informationToast',
          'error',
          'Ocurrió un error',
          this.messageToastFailed(status, 3)
        );
      }
    );
  }
}
