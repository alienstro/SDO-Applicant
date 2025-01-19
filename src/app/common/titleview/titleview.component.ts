import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title-view',
  standalone: true,
  imports: [],
  templateUrl: './titleview.component.html',
  styleUrl: './titleview.component.scss'
})
export class TitleViewComponent {

  @Input() title: string = ''
}
