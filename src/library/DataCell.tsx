export interface DataCell<T> {
    disablePadding: boolean;
    //id: keyof MemoryModel;
    id: keyof T;
    label: string;
    numeric: boolean;
    align?: 'right' | 'center' | 'left'
    format?: (value: number) => string;
    minWidth?: number;
    getNameFrom?: (items: any[], id: string |boolean | undefined, property:string)=> string;
    onDetail?:boolean
}