import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CoursesService } from '../../services/courses.service';
import { MessageService } from 'primeng/api';
import {ToastModule} from 'primeng/toast';


@Component({
  selector: 'app-join-course',
  standalone: true,
  imports: [CardModule, ButtonModule, FormsModule, ToastModule],
  templateUrl: './join-course.component.html',
  styleUrl: './join-course.component.css',
  providers: [MessageService]
})
export class JoinCourseComponent {


  constructor(private service: CoursesService, private messageService: MessageService) { }

  licenseKey!: string;

  async joinCourse() {
    this.service.joinCourse(this.licenseKey).subscribe((data: any) => {
      // alert(data.message);
      this.showToast(
        'informationToast',
        'success',
        data.message,
        'Correcto'
      );
    });
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

}
