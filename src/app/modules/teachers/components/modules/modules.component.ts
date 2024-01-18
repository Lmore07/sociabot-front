import { Component } from '@angular/core';
import { ModuleResponse } from '../../interfaces/modules.interface';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ModuleService } from '../../services/module.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationService, MessageService, PrimeIcons } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { LoadingComponent } from '../../../shared-modules/shared-components/loading/loading.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { AddModuleComponent } from '../../dialogs/modules/add-module/add-module.component';

@Component({
  selector: 'app-modules',
  standalone: true,
  imports: [
    TooltipModule,
    TagModule,
    TableModule,
    ToastModule,
    LoadingComponent,
    ConfirmDialogModule,
    MultiSelectModule,
    CommonModule,
    ToolbarModule,
    DropdownModule,
    ReactiveFormsModule,
    FormsModule,
    SelectButtonModule,
  ],
  providers: [ConfirmationService, MessageService, ModuleService],
  templateUrl: './modules.component.html',
  styleUrl: './modules.component.css',
})
export class ModulesComponent {
  modules!: ModuleResponse[];
  formGroup!: FormGroup;
  spinnerStatus = false;
  coursesNames: any;
  selectedCourse!: any;

  stateOptions: any[] = [
    { label: 'Activos', value: true },
    { label: 'Inactivos', value: false },
  ];

  constructor(
    private moduleService: ModuleService,
    public dialogAddmodule: MatDialog,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.formGroup = new FormGroup({
      status: new FormControl(true),
    });
    this.getAllModules();
  }

  clear(table: Table) {
    table.clear();
  }

  getAllModules() {
    this.spinnerStatus = true;
    this.moduleService.getAllModules(this.formGroup.value['status']).subscribe(
      (response) => {
        this.spinnerStatus = false;
        this.modules = response.data!;
        this.coursesNames = Array.from(
          new Set(
            response.data!.map((module) =>
              JSON.stringify({
                name: module.courses.name,
                id: module.courses.id,
              })
            )
          )
        ).map((course) => JSON.parse(course));
      },
      (error) => {
        this.spinnerStatus = false;
        this.showToast(
          'informationToast',
          'error',
          'Ocurrió un error',
          'No se lograron obtener los módulos'
        );
      }
    );
  }

  filterByCourse() {
    console.log(this.selectedCourse);
    if (this.selectedCourse == null) {
      this.getAllModules();
      return;
    }
    this.spinnerStatus = true;
    this.moduleService
      .getModulesByCourseId(
        this.selectedCourse.id,
        this.formGroup.value['status']
      )
      .subscribe(
        (response) => {
          this.spinnerStatus = false;
          this.modules = response.data!;
        },
        (error) => {
          this.spinnerStatus = false;
          this.showToast(
            'informationToast',
            'error',
            'Ocurrió un error',
            'No se lograron obtener los módulos'
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

  exportToExcel() {}

  getSeverity(status: boolean) {
    switch (status) {
      case true:
        return 'success';
      case false:
        return 'danger';
    }
  }

  openDialogStudent(moduleId: string, moduleName: string): void {}

  openDialogAddmodule(): void {
    const dialogRef = this.dialogAddmodule.open(AddModuleComponent, {
      data: { courses: this.coursesNames },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {
        this.showToast(
          'informationToast',
          'success',
          'Proceso exitoso',
          'Módulo creado correctamente'
        );
      } else {
        this.showToast(
          'informationToast',
          'error',
          'Ocurrió un error',
          'Fallo al crear el módulo'
        );
      }
      if (this.selectedCourse) {
        this.filterByCourse();
      } else {
        this.getAllModules();
      }
      console.log('The dialog was closed');
    });
  }

  openDialogEditmodule(
    moduleName: string,
    moduleDescription: string,
    moduleId: string
  ): void {}

  handleChange(e: any) {
    this.getAllModules();
  }

  iconActions() {
    if (this.formGroup.value['status']) {
      return PrimeIcons.THUMBS_DOWN_FILL;
    }
    return PrimeIcons.THUMBS_UP_FILL;
  }

  activaOrDesactivatemodule(status: boolean, event: Event, moduleId: string) {
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

  messageToastFailed(status: boolean, caseMessage: number) {
    let message = '';
    let stringStatus = status ? 'desactivar' : 'activar';
    switch (caseMessage) {
      case 1:
        message = '¿Esta seguro de ' + stringStatus + ' el curso?';
        break;
      case 2:
        message = 'El curso se logro ' + stringStatus + ' correctamente';
        break;
      case 3:
        message = 'El curso no se logro ' + stringStatus + ' correctamente';
        break;
    }
    console.log(message);
    return message;
  }

  callServiceChangeStatus(status: boolean, moduleId: string) {
    this.spinnerStatus = true;
  }
}
