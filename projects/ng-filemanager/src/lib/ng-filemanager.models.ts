export interface IFile {
  id: number;
  date: Date;
  title: string;
  extension: string;
  size: number;
  contentType: string;
  isDeleted: boolean;
  // fileBlobId: number,
  // fileBlob: IFileBlob
}

export interface IFileManager {
  files: Array<IFileManagerFile>;
  fileSize: number;
  maxFileSize: number;
  hasExceededMaxFileSize: boolean;
  hasExceededMaxFileNumber: boolean;
  hasExceededMinFileNumber: boolean;
}

export interface IFileManagerFile {
  // IFile
  contentType: string;
  date: Date;
  extension: string;
  id?: number;
  isDeleted: boolean;
  size: number;
  title: string;
  browserFile: File;
}
