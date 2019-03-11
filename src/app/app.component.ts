import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IFileManagerFile } from 'projects/ng-filemanager/src/lib/ng-filemanager.models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-component-library';

  isUploadingFiles = false;
  files: Array<IFileManagerFile> = null;

  onSubmitFiles(form: NgForm) {
    console.log(form);
    if (form.invalid) {
      return false;
    }
    this.isUploadingFiles = true;

    const formData: FormData = new FormData();

    const files = form.value.files;

    formData.append('payload', JSON.stringify({ title: 'test' }));

    if (typeof files !== 'undefined' && files != null && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append('file' + i, files[i].browserFile);
      }
    }

    setTimeout(() => {
      this.isUploadingFiles = false;
      alert('Done! See console log');
      console.log(formData);
    }, 2000);
  }
}
