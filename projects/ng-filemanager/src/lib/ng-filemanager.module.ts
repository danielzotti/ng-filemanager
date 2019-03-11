import { NgModule } from '@angular/core';
import { NgFilemanagerComponent } from './ng-filemanager.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileSizePipe } from './file-size.pipe';

@NgModule({
  imports: [
    // Angular
    BrowserModule,
    CommonModule,
    FormsModule
  ],
  declarations: [
    NgFilemanagerComponent,
    // PIPES
    FileSizePipe
  ],
  exports: [NgFilemanagerComponent]
})
export class NgFilemanagerModule {}
