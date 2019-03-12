import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NgFilemanagerModule } from 'projects/ng-filemanager/src/public_api';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule, NgFilemanagerModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
