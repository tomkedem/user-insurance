import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PolicyService } from '../../../services/policy.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface InsurancePolicy {
  id: number;
  policyNumber: string;
  insuranceAmount: number;
  startDate: string;
  endDate: string;
  userId: number; // Foreign key referencing User.id
}

@Component({
  selector: 'app-insurance-policy-form',
  standalone: true,
  imports: [MatButtonModule,MatDialogModule,MatSnackBarModule,ReactiveFormsModule],
  templateUrl: './insurance-policy-form.component.html',
  styleUrl: './insurance-policy-form.component.css'
})
export class InsurancePolicyFormComponent implements OnInit{
  @Input() paramid: number = 0;  
  @Input() paramuserid: number = 0;  
  @Input() action: string = '';

  constructor(private snackBar: MatSnackBar,private policyService: PolicyService, private activatedRoute: ActivatedRoute,private fb: FormBuilder) { }
  ActionOnPage = 'Add Policy';
  policyForm = this.fb.group({
    id: [0],
    policyNumber: ['', Validators.required],
    insuranceAmount: [0, [Validators.required, Validators.min(0)]],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    userId: [0],
  });
// export interface InsurancePolicy {
  //   id: number;
  //   policyNumber: string;
  //   insuranceAmount: number;
  //   startDate: Date;
  //   endDate: Date;
  //   userId: number; // Foreign key referencing User.id
  // }

  get f(): { [key: string]: AbstractControl } {
    return this.policyForm.controls;
  }
  userId: any;
  ngOnInit(): void {
    console.log('Getting insurance action', this.action);
    console.log('Getting insurance paramid', this.paramid);
    console.log('Getting insurance paramuserid', this.paramuserid);
    console.log('Getting insurance policy', this.activatedRoute);
    
      console.log('polisy id: ',this.paramid)  
      

      if (this.action === 'Add') {
        console.log('New Policy');
        this.ActionOnPage = 'Add Policy';
        this.userId = this.paramuserid;
      } else {
        console.log('Edit Policy');
        this.ActionOnPage = 'Edit Policy';
        this.getPolicyDetails(Number(this.paramid))
      }
    
  }
  getPolicyDetails(id: number) {
    this.policyService.getPolicyById(id).subscribe(res => {
      console.log('policy==> ', res) ;
      this.policyForm.patchValue({
        id: res.id,
        policyNumber: res.policyNumber.toString(),
        insuranceAmount: res.insuranceAmount,
        startDate: res.startDate.toString().substring(0, 10),
        endDate: res.endDate.toString().substring(0, 10),
        userId: res.userId,
      });
    });
    console.log('policyForm==> ', this.policyForm) ;
  } 
  
  onSubmit() {
      if (this.action ==='Add' && this.policyForm.valid) {
        const newPolicy = this.policyForm.value as InsurancePolicy;
        newPolicy.userId = this.userId;
        this.policyService.createPolicy(newPolicy).subscribe(res => {       
            this.snackBar.open('Policy added successfully. Good luck!', 'Close', {
            duration: 5000,
          });
        });
      }
      else if(this.policyForm.valid){
        const newPolicy = this.policyForm.value as InsurancePolicy;
        newPolicy.userId = this.paramuserid;
        console.log('newPolicy', newPolicy);
       
        this.policyService.updatePolicy(newPolicy).subscribe(res => {       
            this.snackBar.open('Policy updated successfully. Good luck!', 'Close', {
            duration: 5000,
          });
        });
        // this.userService.updateUser(newUser).subscribe(user => {
        //   const userIndex = this.users.findIndex(u => u.id === newUser.id);
        //   if (userIndex !== -1) {
        //     this.users[userIndex] = newUser;
        //     this.newUserForm.reset();
        //     this.bEdit = false;
        //     this.resetTable();
        //   }
        // });
        
      }    
  }

  onCancel() {
    this.policyForm.reset();
  }
}
