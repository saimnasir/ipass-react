export interface BaseModel<T> { 
    id: T;
    createdAt: string;
    updatedAt: string; 
    logId: string;
    isExpanded:boolean
}