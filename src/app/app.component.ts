import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IFileManagerFile } from 'projects/ng-filemanager/src/lib/ng-filemanager.models';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private http: HttpClient) {}

  isUploadingFiles = false;
  files: Array<IFileManagerFile> = null;
  simpleFiles: Array<IFileManagerFile> = null;
  customFiles: Array<IFileManagerFile> = null;
  completeFiles: Array<IFileManagerFile> = null;

  onSubmitFiles(form: NgForm) {
    if (form.invalid) {
      alert('Form invalid! See console log for details');
      console.log('Form invalid', form);
      return false;
    }
    this.isUploadingFiles = true;

    const formData: FormData = new FormData();

    const files = form.value.completeFiles;

    formData.append('payload', JSON.stringify({ title: 'test' }));

    if (typeof files !== 'undefined' && files != null && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append('file' + i, files[i].browserFile);
      }
    }
    const fakeUrl = 'https://www.mocky.io/v2/5c87748e320000d9123bd1fb';
    this.http.post(fakeUrl, formData).subscribe(res => {
      this.isUploadingFiles = false;
      alert('Done! See network details in developer console (Header of https://www.mocky.io/v2/5c87748e320000d9123bd1fb)');
      form.reset();
    });
  }
}
