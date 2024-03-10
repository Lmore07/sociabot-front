import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CoursesService } from '../../services/courses.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-join-course',
  standalone: true,
  imports: [CardModule, ButtonModule, FormsModule, ToastModule, RouterModule],
  templateUrl: './join-course.component.html',
  styleUrl: './join-course.component.css',
  providers: [MessageService]
})
export class JoinCourseComponent {


  constructor(private service: CoursesService, private messageService: MessageService, private router: Router) { }

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

      setTimeout(() => {
        console.log(this.router.url);
        if (this.router.url === '/students/courses')
          window.location.reload();
        else
          this.router.navigate(['/students/courses'], { onSameUrlNavigation: 'reload' });
      }, 1000);

    }, (error: any) => {
      // alert(error.error.message);
      this.showToast(
        'informationToast',
        'error',
        'Error',
        error.error.message,
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
