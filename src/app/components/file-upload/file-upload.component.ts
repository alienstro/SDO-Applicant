import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FileUpload } from '../../interface';
import { SnackbarService } from '../../service/snackbar.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {

  constructor(private snackbarService: SnackbarService) {}
  selectedFile: File | null = null;

  @Output() fileSelected = new EventEmitter<FileUpload>();
  @Output() cancelFile = new EventEmitter<string>()

  @Input() idLabel: string = '';
  @Input() title: string = '';
  @Input() note: string = '';
  @Input() required: boolean = true;

  haveUploaded = false

  @ViewChild('fileInput') fileInput: any; // Reference to the file input element


  onFileSelected(event: Event): void {

    console.log('hola')

    const input = event.target as HTMLInputElement;

    if(!input.files) return

    if (input.files[0].type !== 'application/pdf') {
      this.snackbarService.showSnackbar('Submit file in PDF')
      return;
    }

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }

    if(!this.selectedFile) return


    this.fileSelected.emit({
      idLabel: this.idLabel,
      file:this.selectedFile!
    })

    this.haveUploaded = true
  }

  cancelUploadFile() {
    this.selectedFile = null
    this.cancelFile.emit(this.idLabel)
    this.haveUploaded = false

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

}
