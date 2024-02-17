import { Component } from '@angular/core';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  constructor(private service: ProfileService) { }

  // myData = {
  //   id: 1,
  //   email: 'email@gmail.com',
  //   firstName: 'Andres',
  //   lastName: 'Gomez',
  //   age : '23',
  //   createdAt: '02/02/2021',
  //   updatedAt: '14/02/2024',
  //   gender: 'Hombre'
  // }
  myData: any;

  ngOnInit() {
    this.service.getData().subscribe((data:any) => {
      data.data.age = data.data.birthDate ? new Date().getFullYear() - new Date(data.data.birthDate).getFullYear() : '';
      data.data.gender = data.data.gender === 'MALE' ? 'Hombre' : 'Mujer';
      this.myData = data.data;
    });
  }

}
