import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormsService } from '../../services/forms.service';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.css'
})
export class FormsComponent {
  formsFormGroup!: FormGroup;
  questionAndAnswer: any = [{
    question: 'What is your name?',
    answers: [
      'John',
      'Jane',
      'Doe'
    ]
  }, {
    question: 'What is your age?',
    answers: [
      '18-24',
      '25-34',
      '35-44',
      '45-54',
      '55-64',
      '65+'
    ]
  }];
  name: string = '';

  constructor(
    private formBuilder: FormBuilder, private service: FormsService
  ) {
  }

  ngOnInit() {
    this.service.getFormById('clsnmrasr000114m8kbwkmy4u').subscribe((form: any) => {
      console.log(form);
      this.questionAndAnswer = form.data.questionsAndAnswers;
      this.name = form.data.name;
    });
  }

  

}
