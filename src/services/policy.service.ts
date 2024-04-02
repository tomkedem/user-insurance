import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InsurancePolicy } from '../models/insurance-policy.model';
import { environment } from '../environments/environment';
import { IPolicyQueryParameters } from '../interface/IPolicyQueryParameters';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private apiUrl = environment.apiUrl + 'insurance-policies'; // Replace with your API base URL

  constructor(private http: HttpClient) { }

  getPolicies(params: IPolicyQueryParameters): Observable<any> {
    // Convert the parameters object to HttpParams
    let httpParams = new HttpParams({ fromObject: <any>params });
    return this.http.get<any>(this.apiUrl, { params: httpParams });
  }

  getPolicyById(id: number): Observable<InsurancePolicy> {
    return this.http.get<InsurancePolicy>(this.apiUrl + '/' + id);
  }

  createPolicy(policy: InsurancePolicy): Observable<InsurancePolicy> {
    return this.http.post<InsurancePolicy>(this.apiUrl, policy);
  }

  updatePolicy(policy: InsurancePolicy): Observable<InsurancePolicy> {
    return this.http.put<InsurancePolicy>(this.apiUrl + '/' + policy.id, policy);
  }

  deletePolicy(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + '/' + id);
  }
}