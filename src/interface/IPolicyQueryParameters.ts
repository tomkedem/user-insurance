export interface IPolicyQueryParameters {
  userId: number;
  pageSize: number;
  pageNumber: number;
  isSortOrder: boolean;
  sortColumn: string;
  startDate: string;
}