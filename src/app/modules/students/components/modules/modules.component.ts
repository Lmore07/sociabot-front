import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { CoursesService } from '../../services/courses.service';
import { MessageService, PrimeIcons } from 'primeng/api';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';


@Component({
  selector: 'app-modules',
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
    CardModule,
  ],
  templateUrl: './modules.component.html',
  styleUrl: './modules.component.css',
  providers: [MessageService],
})
export class ModulesComponent {
  modules!: any[];
  id = '';

    
    constructor(private service: CoursesService, private route: ActivatedRoute, private messageService: MessageService) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('courseId') || '';
    this.getModules();
  }
  getModules() {
    this.service
      .getModulesByCourse(this.id)
      .subscribe((res: any) => {
        this.modules = res.data;
      }, (err: any) => {
        this.showToast(
          'info',
          'Ocurrió un error',
          'Lo sentimos no se pudo obtener los módulos 🙁'
        );
      });
  }


  getSeverity(status: boolean) {
    switch (status) {
      case true:
        return 'success';
      case false:
        return 'danger';
    }
  }

  handleChange(e: any) {
    this.getModules();
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
}
