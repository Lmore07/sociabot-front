import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { CoursesService } from '../../services/courses.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { MarkdownModule, provideMarkdown } from 'ngx-markdown';

@Component({
  selector: 'app-list-chats',
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
    MarkdownModule,
  ],
  templateUrl: './list-chats.component.html',
  styleUrl: './list-chats.component.css',
  providers: [MessageService, provideMarkdown()],
})
export class ListChatsComponent {
  modules!: any[];
  id = '';
  visibleObservation: boolean = false;
  observations: string = '';

  constructor(
    private service: CoursesService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('moduleId') || '';
    this.getChats();
  }

  getChats() {
    this.service.getChatsByModule(this.id).subscribe(
      (res: any) => {
        let indexAux = 0;
        this.modules = res.data.map((chat: any) => {
          return {
            ...chat,
            index: ++indexAux,
          };
        });
      },
      (err: any) => {
        this.showToast(
          'info',
          'Ocurrió un error',
          'Lo sentimos no se pudo obtener los chats 🙁'
        );
      }
    );
  }

  newChat() {
    this.service.newChat(this.id).subscribe(
      (res: any) => {
        this.router.navigate([res.data.chatId], { relativeTo: this.route }); // Redirigir a la ruta deseada con el ID
      },
      (err: any) => {
        this.showToast(
          'info',
          'Ocurrió un error',
          'Lo sentimos no se pudo crear el chat 🙁'
        );
      }
    );
  }

  getObservations(chatId: string) {
    this.service.getObservations(chatId).subscribe(
      (res: any) => {
        this.showToast(
          'success',
          'Proceso exitoso',
          'Se han generado las observaciones del chat'
        );
        setTimeout(() => {
          location.reload();
        }, 1000);
      },
      (err: any) => {
        this.showToast(
          'info',
          'Ocurrió un error',
          'Lo sentimos no se pudo obtener la retroalimentación 🙁'
        );
      }
    );
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

  showObservationDialog(observation: string) {
    this.visibleObservation = true;
    this.observations = observation;
  }
}
