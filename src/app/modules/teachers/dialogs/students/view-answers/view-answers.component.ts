import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { StudentsService } from '../../../services/students.service';
import { AddObservationsComponent } from '../add-observations/add-observations.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-view-answers',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    SelectButtonModule,
    TagModule,
    TooltipModule,
  ],
  providers: [MessageService],
  templateUrl: './view-answers.component.html',
  styleUrl: './view-answers.component.css',
})
export class ViewAnswersComponent {
  lessons!: any[];
  formGroup!: FormGroup;
  today = new Date();

  stateOptions: any[] = [
    { label: 'Activos', value: true },
    { label: 'Inactivos', value: false },
  ];

  constructor(
    public dialogRef: MatDialogRef<ViewAnswersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: StudentsService,
    private messageService: MessageService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.formGroup = new FormGroup({
      status: new FormControl(true),
    });
    this.getAnswers();
  }

  getAnswers() {
    this.service.getAnswersByFormId(this.data.id).subscribe((data: any) => {
      this.lessons = data.data;
    });
  }

  addObservation(lessonId: string, observations: string) {
    const dialogRef = this.dialog.open(AddObservationsComponent, {
      data: {
        id: lessonId,
        observations: observations,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.showToast(
          'informationToast',
          'success',
          'Proceso exitóso',
          'Observación agregada'
        );
        this.getAnswers();
      } else {
        this.showToast(
          'informationToast',
          'error',
          'Ocurrió un error',
          'Observación no se agregó'
        );
      }
    });
  }

  getSeverity(score: number) {
    if (score >= 7) {
      return 'success';
    } else if (score < 7 && score >= 5) {
      return 'warning';
    }
    return 'danger';
  }

  onNoClick(): void {
    this.dialogRef.close();
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

  handleChange(e: any) {
    this.getAnswers();
  }
}
