import { SortDirection } from "@mui/material";

export interface PaginationModel {
    sortBy: string,
    sortType: SortDirection,
    page: number,
    pageSize: number,
}

export interface PaginationFilterModel extends PaginationModel {
    searchText?: string,
}

export interface PaginationDecodeModel extends PaginationFilterModel {
    decode?: boolean,
    tenantKey: string  
}

const PaginationDecodeModelInit: PaginationDecodeModel = {
    tenantKey: '',
    page: 0,
    pageSize: 10,
    sortBy: '',
    sortType: 'asc',
    decode: false
}

const PaginationDecodeModelInitForHistory: PaginationDecodeModel = {
    tenantKey: '',
    page: 0,
    pageSize: 4,
    sortBy: '',
    sortType: 'asc',
    decode: true
}

const PaginationFilterModelInit: PaginationFilterModel = {
    page: 0,
    pageSize: 10,
    sortBy: '',
    sortType: 'asc'
}


const PaginationFilterModelAllInit: PaginationFilterModel = {
    page: 0,
    pageSize: 9999,
    sortBy: 'title',
    sortType: 'asc',
}

export { PaginationDecodeModelInit, PaginationDecodeModelInitForHistory, PaginationFilterModelInit, PaginationFilterModelAllInit }