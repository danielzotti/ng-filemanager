import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgFilemanagerModule, NgFilemanagerComponent } from 'projects/ng-filemanager/src/public_api';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, NgFilemanagerModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
