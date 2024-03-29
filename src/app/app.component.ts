import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerService } from './shared-modules/components/spinner/spinner.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: []
})
export class AppComponent {
[x: string]: any;
  title = 'sociabot';
  constructor(public spinnerService: SpinnerService) {}
}
