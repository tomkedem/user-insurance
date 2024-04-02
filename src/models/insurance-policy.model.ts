export interface InsurancePolicy {
    id: number;
    policyNumber: string;
    insuranceAmount: number;
    startDate: string;
    endDate: string;
    userId: number; // Foreign key referencing User.id
  }