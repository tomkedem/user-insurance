import { Component, Inject, OnInit } from '@angular/core';
import { InsurancePolicyFormComponent } from '../../modules/insurance-policy-form/insurance-policy-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-from',
  standalone: true,
  imports: [InsurancePolicyFormComponent, MatButtonModule,MatDialogModule],
  templateUrl: './popup-from.component.html',
  styleUrl: './popup-from.component.css'
})
export class PopupFromComponent implements OnInit{
  constructor(@Inject(MAT_DIALOG_DATA) public data:any, private dialogRef: MatDialogRef<PopupFromComponent>) {}
  ngOnInit(): void {
    console.log('Getting insurance policy', this.data);
    this.inputData=this.data
  }
  inputData: any;
  closePopUp(){
    console.log('Close using close button');
    this.dialogRef.close('Close using close button');
  }
  cancelPopUp(){
    this.dialogRef.close('CancelPopUp using close button');
  }
}
