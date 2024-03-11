import { Component, ElementRef, Renderer2, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { MyCoursesResponse } from '../../interfaces/student-courses.interfaces';
import { CoursesService } from '../../services/courses.service';
import { MessageService, PrimeIcons } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { JoinCourseComponent } from '../join-course/join-course.component';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-courses',
  standalone: true,
  imports: [
    TableModule,
    ToolbarModule,
    ButtonModule,
    SelectButtonModule,
    ReactiveFormsModule,
    TagModule,
    TooltipModule,
    DialogModule,
    JoinCourseComponent,
    RouterModule,
    ToastModule,
    CardModule,
    CommonModule,
  ],
  templateUrl: './student-courses.component.html',
  styleUrl: './student-courses.component.css',
  providers: [MessageService],
})
export class StudentCoursesComponent {

  visible: any;
  constructor(private service: CoursesService, private messageService: MessageService, private renderer: Renderer2) { }
  courses: MyCoursesResponse[] = [];
  formGroup!: FormGroup;
  @ViewChildren('pCard') pCards: ElementRef[];

  stateOptions: any[] = [
    { label: 'Activos', value: true },
    { label: 'Inactivos', value: false },
  ];

  ngAfterViewInit() {
    setTimeout(() => {
      let maxHeight = 0;

      // Encuentra la altura máxima
      this.pCards.forEach((card) => {
        const height = card.nativeElement.offsetHeight;
        console.log(height);
        if (height > maxHeight) {
          maxHeight = height;
        }
      });

      // Establece la altura máxima para todos los p-card
      this.pCards.forEach((card) => {
        this.renderer.setStyle(card.nativeElement, 'height', `${maxHeight}px`);
      });
    });
  }
  ngOnInit() {
    this.formGroup = new FormGroup({
      status: new FormControl(true),
    });
    this.getCourses();
  }
  getCourses() {
    this.service
      .getMyCoursesByStudent(this.formGroup.value['status'])
      .subscribe((data) => {
        this.courses = data.data;
      }, (err: any) => {
        this.showToast(
          'info',
          'Ocurrió un error',
          'Lo sentimos no se pudo obtener los cursos 🙁'
        );
      });
  }
  iconActions() {
    if (this.formGroup.value['status']) {
      return PrimeIcons.THUMBS_DOWN_FILL;
    }
    return PrimeIcons.THUMBS_UP_FILL;
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
    this.getCourses();
  }

  showDialog() {
    this.visible = true;
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
