import { Routes } from '@angular/router';
import { UserDetailsComponent } from './modules/user-details/user-details.component';
import { UserListComponent } from './modules/user-list/user-list.component';
import { InsurancePolicyFormComponent } from './modules/insurance-policy-form/insurance-policy-form.component';

export const routes: Routes = [
    {'path': '', component: UserListComponent},
    {'path': 'userlist', component: UserListComponent},
    {'path': 'userdetails/:id', component: UserDetailsComponent},
    {'path': 'insuranceform/:id', component: InsurancePolicyFormComponent},
];
