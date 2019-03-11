import { Pipe, PipeTransform } from '@angular/core';
/*
 * Trasforma un numero in una dimensione di un file trasformata e arrotondata
 * Usage:
 *   value | fileSize
 */
@Pipe({ name: 'fileSize' })
export class FileSizePipe implements PipeTransform {
  transform(value: number /*, args:string*/): string {
    // if (typeof value !== "number" || value == null) {
    //    return value.toString();
    // }

    if (isNaN(value)) {
      value = 0;
    }

    if (value < 1024) {
      return value + ' Bytes';
    }

    value /= 1024;

    if (value < 1024) {
      return value.toFixed(2) + ' Kb';
    }

    value /= 1024;

    if (value < 1024) {
      return value.toFixed(2) + ' Mb';
    }

    value /= 1024;

    if (value < 1024) {
      return value.toFixed(2) + ' Gb';
    }

    value /= 1024;

    return value.toFixed(2) + ' Tb';
  }
}
