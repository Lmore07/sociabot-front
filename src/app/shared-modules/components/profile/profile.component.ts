import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  myData = {
    id: 1,
    email: 'email@gmail.com',
    firstName: 'Andres',
    lastName: 'Gomez',
    age : '23',
    createdAt: '02/02/2021',
    updatedAt: '14/02/2024',
    gender: 'Hombre'
  }

}
