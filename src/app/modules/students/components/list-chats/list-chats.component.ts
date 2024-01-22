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
  ],
  templateUrl: './list-chats.component.html',
  styleUrl: './list-chats.component.css'
})
export class ListChatsComponent {
  modules!: any[];
  id = '';


  constructor(private service: CoursesService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('moduleId') || '';
    this.getChats();
  }

  getChats() {
    this.service
      .getChatsByModule(this.id)
      .subscribe((res: any) => {
        let indexAux = 0;
        this.modules = res.data.map ((chat: any) => {
          return {
            ...chat,
            index: ++indexAux
          }
        });
        console.log(this.modules);
      });
  }

  newChat() {
    this.service
      .newChat(this.id)
      .subscribe((res: any) => {
        this.router.navigate([res.data.chatId], {relativeTo: this.route}); // Redirigir a la ruta deseada con el ID
      });
  }
}
