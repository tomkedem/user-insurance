import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
 
  handleError(error: any): void {
    
    // Here you can use the variable 'error' to determine which error occurred
    // and handle it accordingly, for example:
    switch (error) {
      case 'FormValidationError':
        console.error('Form validation error occurred');
        break;
      default:
        console.error('Unknown error occurred' , error);
        break;
    }   
    
  }
}
