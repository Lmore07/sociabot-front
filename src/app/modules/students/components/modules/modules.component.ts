import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { CoursesService } from '../../services/courses.service';
import { PrimeIcons } from 'primeng/api';
import { ActivatedRoute, RouterModule } from '@angular/router';


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
    RouterModule
  ],
  templateUrl: './modules.component.html',
  styleUrl: './modules.component.css'
})
export class ModulesComponent {
  modules!: any[];
  id = '';

    
    constructor(private service: CoursesService, private route: ActivatedRoute,) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('courseId') || '';
    this.getModules();
  }
  getModules() {
    this.service
      .getModulesByCourse(this.id)
      .subscribe((res: any) => {
        this.modules = res.data;
        console.log(this.modules);
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

}
