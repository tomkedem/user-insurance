import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { InsurancePolicy } from '../../../models/insurance-policy.model';
import { User } from '../../../models/user.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { PolicyService } from '../../../services/policy.service';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { TableTemplate } from '../../shared/TableTemplate';
import {SelectionModel} from '@angular/cdk/collections';
import { ViewChild } from '@angular/core';
import { IPolicyQueryParameters } from '../../../interface/IPolicyQueryParameters';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PopupFromComponent } from '../../shared/popup-from/popup-from.component';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [MatButtonModule,MatCardModule, MatTableModule,MatPaginatorModule,DatePipe,RouterModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit {

  user: User[] = [];
  policies: InsurancePolicy[] = []; // replace with your actual policy model
  filteredPolicies: any[] = []; // Assign an empty array as the initial value for 'filteredPolicies'
  filterStartDate: Date = new Date(); // Assign an initial value to 'filterStartDate'
  constructor(private dialog: MatDialog,private activatedRoute: ActivatedRoute,private userService: UserService, private policyService: PolicyService) {}
  dataTemplate:TableTemplate[]=[   
    { type:'number', key: 'id' ,lable: 'Policy ID'},
    { type:'string', key: 'policyNumber',lable: 'Policy number'},
    { type:'string', key: 'insuranceAmount',lable: 'Insurance amount' },     
    { type:'date', key: 'startDate',lable: 'Start date' },     
    { type:'date', key: 'endDate',lable: 'End date' },     
    
  ];
            
  displayedColumns: string[] = ['id', 'policyNumber','insuranceAmount', 'startDate','endDate', 'actions'];
 
  dataSource = new MatTableDataSource<InsurancePolicy>([]);  
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator,{static:true}) paginator! :MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize!: MatPaginator;
  
  pageSizeOptions: number[] = [5, 10, 20];
  page:number = 0;
  length=0;
  pageSize: number = 5;
  pageEvent!:PageEvent;
  sortColumn:any
  sortByOrder:any
  userId:number =0;
  
  onPageChange(e:any){     
    this.page=e.pageIndex;
    this.pageSize=e.pageSize;
    
    const innerParams: IPolicyQueryParameters = {
      userId: this.userId,
      pageSize:this.pageSize,
      pageNumber:this.page,
      isSortOrder:true,
      sortColumn:'id',     
      startDate: '',      
    };    
    this.getPoliciesByUserId(innerParams);           
   }
   onDateChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target ? target.value : '';
    console.log('Selected date: ', value);
    
      this.filterStartDate = new Date(value);    
    
      const date = new Date(value);
      const dateString = date.toDateString();
      
    const innerParams: IPolicyQueryParameters = {
      userId: this.userId,
      pageSize:this.pageSize,
      pageNumber:this.page,
      isSortOrder:true,
      sortColumn:'id',     
      
      startDate: dateString === 'Invalid Date' ? '' : dateString,    
    };   
    console.log('Filter Start Date: ', dateString); 
    console.log('Filter By innerParams: ', innerParams); 
    this.getPoliciesByUserId(innerParams); 
  }
  
  ngOnInit(): void {
    // this.getInsurancePolicies();
    console.log('Getting user details', this.activatedRoute);
    this.activatedRoute.params.subscribe(params => {
        console.log(params['id'])  
        this.userId = params['id']  
        this.getUserDetails(params['id'])
            
        const innerParams: IPolicyQueryParameters = {
          userId: params['id'],
          pageSize:this.pageSize,
          pageNumber:this.page,
          isSortOrder:true,
          sortColumn:'id',     
          startDate: '',       
        };    
        this.getPoliciesByUserId(innerParams);           
      });        
  }
  deletePolicy(id: number) {   
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.policyService.deletePolicy(id).subscribe(response => {
          const userIndex = this.policies.findIndex(u => u.id === id);
          if (userIndex !== -1) {
            this.policies.splice(userIndex, 1);         
              const innerParams: IPolicyQueryParameters = {
                userId: this.userId,
                pageSize:this.pageSize,
                pageNumber:this.page,
                isSortOrder:true,
                sortColumn:'id',     
                startDate:'',      
              };    
            this.getPoliciesByUserId(innerParams);
          }
        }, error => {
          // Handle errors during deletion
        });
      }
    });           
  }
      
// write method to get user details

  getUserDetails(id: number) {
    this.userService.getUserById(id).subscribe(u => {
      // Assign the retrieved user details to the first element of the 'user' array
      this.user[0] = u;
      console.log('User details', this.user[0]);
    });    
  }
  
  getPoliciesByUserId(params: IPolicyQueryParameters) {  
    this.policyService.getPolicies(params).subscribe(
      
      data => {
        console.log('Params', params)
        this.policies = data.insurancePolicies;
        console.log('Policies', this.policies); 
          this.dataSource = new MatTableDataSource(this.policies);      
          this.length = data.totalCount;  
          console.log('Total Count', this.length);        
      },
      error => {
        console.error('Error: ' + error);
      }
    );
  }
  addPolicy() {
    var _popup = this.dialog.open(PopupFromComponent,{
      width: '60%',      
      data: {
        action:'Add',
        userId: this.userId
      }
    });
    _popup.afterClosed().subscribe(result => {
      console.log('The dialog was result', result);
      if (result === 'Close using close button') {
        console.log('The dialog was closed');
        this.ngOnInit()
      }
    });
  }

  editPolicy(id: number) {

    var _popup = this.dialog.open(PopupFromComponent,{
      width: '60%',
      
      data: {
        action:'Edit',
        id:id,
        userId: this.userId
      }
    });
    _popup.afterClosed().subscribe(result => {
      console.log('The dialog was closed by ', result);
      if (result === 'Close using close button') {
        console.log('The dialog was closed');
        this.ngOnInit()
      }
    });
  }
  
  
  
  filterPolicies() {
    if (this.filterStartDate) {
      this.filteredPolicies = this.policies.filter(policy => 
        new Date(policy.startDate) >= new Date(this.filterStartDate)
      );
    } else {
      this.filteredPolicies = this.policies; // if no filter is set, show all policies
    }
  }
}
