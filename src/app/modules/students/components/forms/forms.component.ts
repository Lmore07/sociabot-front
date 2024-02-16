import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormsService } from '../../services/forms.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.css'
})
export class FormsComponent {
  questionAndAnswer: any[] = [{
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
  id = '';
  selectedAnswers = [];

  constructor(
    private service: FormsService, private route: ActivatedRoute, private router: Router
  ) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('formId') || '';
    this.service.getFormById(this.id).subscribe((form: any) => {
      console.log(form);
      this.questionAndAnswer = form.data.questionsAndAnswers;
      this.name = form.data.name;
    });
  }

  selectAnswer(event: any, question: any) {
    if (event.target.value !== '-1') {
      if (!this.selectedAnswers.some((selectedAnswer: any) => selectedAnswer.question === question)) {
        this.selectedAnswers.push({
          question: question,
          positionAnswer: Number(event.target.value),
          answer: ""
        });
      } else {
        this.selectedAnswers = this.selectedAnswers.map((selectedAnswer: any) => {
          if (selectedAnswer.question === question) {
            return {
              question: question,
              positionAnswer: Number(event.target.value),
              answer: ""
            };
          }
          return selectedAnswer;
        });
      }
    }
  }

  submitForm() {
    const data = {
      formContent: this.selectedAnswers,
      formId: this.id
    }

    this.service.sendAnswers(data).subscribe((response: any) => {
      alert(`Tu nota es: ${response.data.score}`);
      this.router.navigate(['/students/lessons']);
    });
  }
}
