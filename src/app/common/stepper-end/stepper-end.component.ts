import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stepper-end',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper-end.component.html',
  styleUrl: './stepper-end.component.scss'
})
export class StepperEndComponent {

  @Input() progressName: string = ''
   @Input() note: string = ''
  @Input() disable: boolean = false
  @Input() date: string | null = ''

}
