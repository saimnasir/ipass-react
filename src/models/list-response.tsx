export interface ListResponse<T> { 
    data: T[];
    page:number;
    pageSize:number;
    pageCount:number;
    totalCount:number;
}