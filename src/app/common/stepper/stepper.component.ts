import { CommonModule } from '@angular/common';
import { Component, input, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
})
export class StepperComponent implements OnInit {
  @Input() progressName: string = '';
  @Input() disable: boolean = true;
  @Input() date: string | null = '';

  ngOnInit() {
    console.log('Progress Name:', this.progressName);
    console.log('Date:', this.date);
  }
}
