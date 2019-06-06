import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ViewChild,
  ElementRef,
  ContentChild,
  AfterContentInit,
  TemplateRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { FileSizePipe } from './file-size.pipe';
import { IFileManager, IFileManagerFile, IFile } from './ng-filemanager.models';

const INPUT_FILE_CONTROL_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgFilemanagerComponent),
  multi: true
};

const INPUT_FILE_CONTROL_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => NgFilemanagerComponent),
  multi: true
};

@Component({
  selector: 'ng-filemanager',
  templateUrl: './ng-filemanager.component.html',
  styles: ['./ng-filemanager.component.scss'],
  providers: [INPUT_FILE_CONTROL_ACCESSOR, INPUT_FILE_CONTROL_VALIDATOR, FileSizePipe]
})
export class NgFilemanagerComponent implements ControlValueAccessor, Validator {
  constructor(private fileSizePipe: FileSizePipe) {}

  get fileManager(): IFileManager {
    return {
      files: this.files,
      fileSize: this.totalFileSize,
      maxFileSize: this.maxFileSize,
      hasExceededMaxFileSize: this.maxFileSize ? this.totalFileSize > this.maxFileSize : false,
      hasExceededMaxFileNumber: this.max != null ? this.files.length > this.max : false,
      hasExceededMinFileNumber: this.min != null ? this.files.length < this.min : false
    };
  }

  get totalFileSize(): number {
    if (this.files.length === 0) {
      return 0;
    }

    let fileSize = 0;
    for (let i = 0; i < this.files.length; i++) {
      fileSize += this.files[i].size;
    }
    return fileSize;
  }

  get hasFilterOnFileTypes() {
    return this.acceptedFileTypes ? this.acceptedFileTypes.length > 0 : false;
  }

  get hasError(): boolean {
    return this.hasExceededMaxFileNumber || this.hasExceededMaxFileSize || this.hasExceededMinFileNumber;
  }

  get isMultiple() {
    return this.min !== 1 || this.max !== 1;
  }

  @Input()
  min: number = null;

  @Input()
  max: number = null;

  @Input()
  maxFileSize: number = null;

  @Input()
  acceptedFileTypes: Array<string> = null; // ['text/csv'];

  @Input()
  isLoading = false;

  @Output()
  filesChanged: EventEmitter<IFileManager> = new EventEmitter<IFileManager>();

  @ViewChild('fileInput')
  fileInput: ElementRef;

  files: Array<IFileManagerFile> = [];
  hasExceededMaxFileSize = false;
  hasExceededMaxFileNumber = false;
  hasExceededMinFileNumber = false;

  // ControlValueAccessor

  private onTouch: Function;
  private onModelChange: Function;

  @ContentChild('selectIcon') selectIcon: ElementRef;
  @ContentChild('selectText') selectText: ElementRef;
  @ContentChild('deleteAllIcon') deleteAllIcon: ElementRef;
  @ContentChild('deleteAllText') deleteAllText: ElementRef;
  @ContentChild('deleteIcon') deleteIcon: TemplateRef<any>;

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(files: Array<IFileManagerFile>): void {
    if (!files) {
      files = [];
    }
    this.files = files;
  }

  // setDisabledState?(isDisabled: boolean): void {
  //   throw new Error("Method not implemented.");
  // }

  // Validator

  validate(control: FormControl) {
    if (typeof control !== 'undefined' && control != null) {
      const errors = {};

      if (this.maxFileSize && this.totalFileSize > this.maxFileSize) {
        errors['maxFileSize'] = true;
      }

      if (this.max && this.min && this.max === this.min) {
        if (this.files.length !== this.max) {
          errors['exactFileNumber'] = true;
        }
      } else {
        if (this.max !== null && this.files.length > this.max) {
          errors['maxFileNumber'] = true;
        }

        if (this.min !== null && this.files.length < this.min) {
          errors['minFileNumber'] = true;
        }
      }
      return errors;
    }
  }

  onOpenFileSelector() {
    if (!this.fileInput && !this.fileInput.nativeElement) {
      return;
    }

    const el = this.fileInput.nativeElement as HTMLInputElement;
    el.click();
  }

  onFileChange() {
    if (!this.fileInput && !this.fileInput.nativeElement) {
      return;
    }

    const el = this.fileInput.nativeElement as HTMLInputElement;
    if (el.files && el.files[0]) {
      let filteredFiles: Array<File> = Array.from(el.files);

      if (this.hasFilterOnFileTypes) {
        filteredFiles = this.getFilterFilesByTypes(filteredFiles, this.acceptedFileTypes);
      }

      if (this.files.length === 0 || !this.isMultiple) {
        this.files = this.convertFileToUiFile(Array.from(filteredFiles));
      } else {
        this.files = this.getOnlyNewFilesFromBrowser(this.files, filteredFiles);
      }
      // this.files = [...this.files, ...this.convertFileToUiFile(filteredFiles)];
    }
    // Fix per l'evento "change" che non viene triggerato quando si reinserisci di nuovo lo stesso file
    el.value = '';

    this.propagateChange();
  }

  onDeleteAllFiles = () => {
    if (this.files == null || this.files.length === 0) {
      return;
    }
    this.files = [];
    this.propagateChange();
  }

  onDeleteFile = (file: IFileManagerFile) => {
    if (this.files == null || this.files.length === 0) {
      return;
    }
    this.files = this.files.filter(item => item !== file);
    this.propagateChange();
  }

  propagateChange() {
    this.onModelChange(this.fileManager.files);
    this.onTouch();
    // this.filesChanged.emit(this.fileManagerModel);
  }

  private convertFileToUiFile = (files: Array<File>): Array<IFileManagerFile> => {
    if (!files) {
      return [];
    }
    const filesToReturn = files.map(f => {
      const file: IFileManagerFile = {
        contentType: f.type,
        date: (<any>f).lastModifiedDate,
        extension: this.getFileExtension(f),
        // id: null, //in questo modo sarà undefined. NB: Il null spacca la serializzazione lato server!!!
        isDeleted: false,
        size: f.size,
        title: f.name,
        browserFile: f
      };
      return file;
    });
    return filesToReturn;
  }

  private getFilterFilesByTypes = (files: Array<File>, types: Array<string>) => {
    return files.filter(el => types.includes(el.type));
  }

  private getOnlyNewFilesFromBrowser = (existingFiles: Array<IFileManagerFile>, newFiles: Array<File>) => {
    // NB: existingFiles.filter(el => newFiles.includes(el)); non funziona perché li vede come oggetti diversi!
    let newUiFiles: Array<IFileManagerFile> = this.convertFileToUiFile(newFiles);

    // Elimino i doppioni
    for (let i = 0; i < existingFiles.length; i++) {
      const f = existingFiles[i];

      newUiFiles = newUiFiles.filter(item => item.title !== f.title);
    }
    return existingFiles.concat(newUiFiles);
  }

  // Helpers
  private getFileIcon(f: File | IFile) {
    return 'fa fa-file';
  }

  private getFileExtension(f: File): string {
    return '';
  }
}
