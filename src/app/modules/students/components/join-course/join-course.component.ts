import { Component } from '@angular/core';
import {  CardModule} from 'primeng/card';
import {  ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-join-course',
  standalone: true,
  imports: [CardModule, ButtonModule, FormsModule ],
  templateUrl: './join-course.component.html',
  styleUrl: './join-course.component.css'
})
export class JoinCourseComponent {

  licenseKey!: string;

  async joinCourse() {
    
  }

}
