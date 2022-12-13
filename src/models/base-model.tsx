export interface BaseModel<T> { 
    id: T;
    created: string;
    updated: string; 
    logId: string;
    isExpanded:boolean
}