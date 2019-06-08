# @danielzotti/ng-filemanager

Fully customizable multiple file input for Angular with >= IE10 browser support (remember to activate polyfills in `polyfills.ts`!)

- [Live demo](https://danielzotti.github.io/ng-filemanager)

- [NPM](https://www.npmjs.com/package/@danielzotti/ng-filemanager)

- Try it yourself:
  - Run `npm install`
  - Run `npm run start` for a dev server
  - Navigate to `http://localhost:4200/`

# How to use it

## Install the package

Run `npm i @danielzotti/ng-filemanager --save`

## Import the module

Import `NgFilemanagerModule` from `@danielzotti/ng-filemanager` in `app.module.ts`

```typescript
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { NgFilemanagerModule } from "@danielzotti/ng-filemanager";

import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, NgFilemanagerModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

## Use it in a component

### Basic template
- Easy to use
- No validation or file size/number limitation

```html
<form #form="ngForm" novalidate (submit)="onSubmitFiles(form)">
  <ng-filemanager [(ngModel)]="files" name="files"></ng-filemanager>
  <button>Submit</button>
</form>
```

### Completely customizable UI and validation

#### validation

- min file number `min`
- max file number `max`
- max total file size `maxFileSize`
- disabled input when uploading `isLoading`
- custom errors [`exactFileNumber`,`minFileNumber`,`maxFileNumber`,`minFileSize`]

#### UI

- browse file custom text `selectText`
- browse file custom icon `selectIcon`
- delete all files custom text `deleteAllText`
- delete all files custom icon `deleteAllIcon`
- delete single file custom icom `deleteIcon`

```html
<form #form="ngForm" novalidate (submit)="onSubmitFiles(form)">
  <ng-filemanager
    [(ngModel)]="files"
    name="files"
    [min]="2"
    [max]="5"
    [maxFileSize]="1024000"
    #filesRef="ngModel"
    [isLoading]="isUploadingFiles"
  >
    <ng-template #selectText>
      <span>Browse files</span>
    </ng-template>
    <ng-template #selectIcon> <i class="fa fa-files-o"></i>&nbsp; </ng-template>
    <ng-template #deleteAllIcon> <i class="fa fa-trash"></i>&nbsp; </ng-template>
    <ng-template #deleteAllText>
      <span>Delete all files</span>
    </ng-template>
    <ng-template #deleteIcon>
      <i class="fa fa-trash"></i>
    </ng-template>
  </ng-filemanager>

  <div class="error-message" *ngIf="filesRef.dirty && filesRef.errors?.exactFileNumber">
    <span>you must upload a file</span>
  </div>
  <div class="error-message" *ngIf="filesRef.dirty && filesRef.errors?.minFileNumber">
    <span>you must upload at least 2 files</span>
  </div>
  <div class="error-message" *ngIf="filesRef.dirty && filesRef.errors?.maxFileNumber">
    <span>you cannot upload more than 5 files</span>
  </div>
  <div class="error-message" *ngIf="filesRef.dirty && filesRef.errors?.maxFileSize">
    <span>you cannot upload more than 1MB</span>
  </div>

  <div class="buttons">
    <button type="submit" class="default-button" [disabled]="form.invalid || isUploadingFiles">
      Update
      <span *ngIf="isUploadingFiles">
        (loading...)
      </span>
    </button>
    <button type="reset" class="default-button" [disabled]="isUploadingFiles" *ngIf="form.touched">
      Reset
    </button>
  </div>
</form>
```

#### Style

```scss
.ng-filemanager__container {
  // the ng-filemanager input container
}

.ng-filemanager__input {
  // the real input file (should be hidden)
  // "display: none" already set in ng-filemanager component css
}

.ng-filemanager__buttons-container {
  // "browse" and "delete all" container
}

.ng-filemanager__button {
  // "browse" and "delete all" button
}

.ng-filemanager__button__icon {
  // "browse" and "delete all" button icon
}

.ng-filemanager__file-list {
  // container of all uploaded files
}

.ng-filemanager__file {
  // single file item
}

.ng-filemanager__file__button {
  // single file "delete" button
}

.ng-filemanager__file__button__icon {
  // single file button icon
}
```

### How to manage file upload in typescript component

```typescript
onSubmitFiles(form: NgForm) {
    // manage form validation
    if (form.invalid) {
      alert('Form invalid! See console log for details');
      console.log('Form invalid', form);
      return false;
    }
    this.isUploadingFiles = true;

    const formData: FormData = new FormData();

    const files = form.value.files;

    // add other form input data to formData
    formData.append('payload', JSON.stringify({ customJsonProperty: 'customValue' }));

    // add every single file to formData
    if (typeof files !== 'undefined' && files != null && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append('file' + i, files[i].browserFile);
      }
    }
    const fakeUrl = 'http://www.mocky.io/v2/5c87748e320000d9123bd1fb';
    this.http.post(fakeUrl, formData).subscribe(res => {
      this.isUploadingFiles = false;
      alert('Done! See network details in developer console (Header of https://www.mocky.io/v2/5c87748e320000d9123bd1fb)');
      form.reset();
    });
  }
```
