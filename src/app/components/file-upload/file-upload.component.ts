import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileUpload } from '../../interface';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  selectedFile: File | null = null;

  @Output() fileSelected = new EventEmitter<FileUpload>();
  @Input() idLabel: string = '';
  @Input() title: string = '';

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }

    if(!this.selectedFile) return

    this.fileSelected.emit({
      idLabel: this.idLabel,
      file:this.selectedFile
    })
  }

}
