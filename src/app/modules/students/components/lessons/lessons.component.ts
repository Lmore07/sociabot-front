import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsService } from '../../services/forms.service';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [
    TableModule,
    ToolbarModule,
    ButtonModule,
    SelectButtonModule,
    ReactiveFormsModule,
    TagModule,
    TooltipModule,
    RouterModule,
    ToastModule,
    DialogModule,
  ],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.css',
  providers: [MessageService],
})
export class LessonsComponent {
  constructor(private messageService: MessageService, private service: FormsService) { }
  forms!: any[];
  visible: boolean = false;

  ngOnInit() {
    this.getLessons();
  }

  getLessons() {
    this.service.getForms().subscribe((res: any) => {
      this.forms = res.data;
    }, (err: any) => {
      this.showToast(
        'info',
        'Ocurrió un error',
        'Lo sentimos no se pudo obtener las lecciones 🙁'
      );
    });
  }

  showToast(type: string, title: string, message: string) {
    this.messageService.clear();
    this.messageService.add({
      key: 'informationToast',
      severity: type,
      summary: title,
      detail: message,
    });
  }

  showDialog() {
    this.visible = true;
  }
}
