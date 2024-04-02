import {SelectionModel} from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';

import { AbstractControl, FormBuilder, 
  ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { TableTemplate } from '../../shared/TableTemplate';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-list',
  standalone: true,
  host: {ngSkipHydration: 'true'},
  imports: [MatButtonModule,MatCardModule, MatTableModule,MatDialogModule,MatPaginatorModule, ReactiveFormsModule,RouterModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  bAddNew: boolean = false;
  bEdit: boolean = false;
  selectedUser: User | null = null;
    constructor(private userService: UserService,
              private fb: FormBuilder,
              private dialog: MatDialog) { 
              
  }

  newUserForm = this.fb.group({
    id: [0],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });
  dataTemplate:TableTemplate[]=[   
    { type:'number', key: 'id' ,lable: 'User ID'},
    { type:'string', key: 'name',lable: 'Name'},
    { type:'string', key: 'email',lable: 'Email' },
     
  ];
            
  displayedColumns: string[] = ['id', 'name', 'email', 'actions'];
  
  dataSource = new MatTableDataSource<User>([]);  
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator,{static:true}) paginator! :MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize!: MatPaginator;
  
  pageSizeOptions: number[] = [5, 10, 20];
  page:number = 0;
  length=0;
  pageSize: number = 5;
  pageEvent!:PageEvent;
  sortByField:any
  sortByOrder:any

  onPageChange(e:any){     
    this.page=e.pageIndex;
    this.pageSize=e.pageSize;
    this.getUsers(this.pageSize,this.page);
   }
  get f(): { [key: string]: AbstractControl } {
    return this.newUserForm.controls;
  }

  ngOnInit(): void {
    
    this.getUsers(this.pageSize,this.page);
    this.dataSource.paginator = this.paginator;
    // this.sort.sortChange.subscribe((res:any)=>{    
      
    //   this.searchForm.patchValue({
    //     orderByField:res.active,
    //     sort: res.direction
    //   })
    //   this.getUsers();
    // })
  }  
    getUsers(pageSize:number ,page: number) {
      this.userService.getUsers('id', false, page, pageSize).subscribe({
        next: (res: any) => {   
       
          this.users = res.users;  
          this.dataSource = new MatTableDataSource(this.users);      
          this.length = res.totalCount;          
        }
      })
    }
  onSelectUser() {
    console.log('Hello World S');
  }
  editUser(user: User) {
    console.log('Hello World S To Edit==>', user);
    this.bEdit=true;
    this.newUserForm.patchValue({
      id: user.id,
      name: user.name,
      email: user.email,
    
  });
  console.log('Hello World S To Edit==>', this.newUserForm.value);
  
}
resetTable() {
  // Clear the data source
  this.dataSource.data = [];
  this.getUsers(4,0);
  // Refresh the table (necessary for MatTable)
  this.dataSource.data = this.dataSource.data;
}
cancel() {
  this.newUserForm.reset();
  this.bAddNew = false;
  this.bEdit = false;
}
saveUser() {  
  if (this.bAddNew && this.newUserForm.valid) {
    const newUser = this.newUserForm.value as User;
    this.userService.createUser(newUser).subscribe(user => {
      this.users.push(user);
      this.newUserForm.reset();  
      this.bAddNew = false;
      this.resetTable();
    });
  }
  else if(this.bEdit && this.newUserForm.valid){
    const newUser = this.newUserForm.value as User;
    this.userService.updateUser(newUser).subscribe(user => {
      const userIndex = this.users.findIndex(u => u.id === newUser.id);
      if (userIndex !== -1) {
        this.users[userIndex] = newUser;
        this.newUserForm.reset();
        this.bEdit = false;
        this.resetTable();
      }
    });
    
  }
}
openAddNew(){
  this.bAddNew=true;
}
deleteUser(id: number) {
  const dialogRef = this.dialog.open(ConfirmDialogComponent);
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.userService.deleteUser(id).subscribe(response => {
        const userIndex = this.users.findIndex(u => u.id === id);
        if (userIndex !== -1) {
          this.users.splice(userIndex, 1);
          this.selectedUser = null; // Clear selected user after deletion
          this.getUsers(this.pageSize,this.page);
        }
      }, error => {
        // Handle errors during deletion
      });
    }
  });
}

    
  }

