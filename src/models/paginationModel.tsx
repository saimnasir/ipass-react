import { SortDirection } from "@mui/material";

export interface PaginationModel {
    sortBy: string,
    sortType: SortDirection,
    page: number,
    pageSize: number,
}

export interface SearchText{
    searchText?: string, 
}

export interface MultiTenant{
    tenantId: string
}
export interface Decode{
    decode?: boolean  
}
export interface PaginationFilterModel extends PaginationModel, SearchText { 
}

export interface PaginationTenantFilterModel extends PaginationModel, SearchText, MultiTenant {
    searchText?: string,
}

export interface PaginationDecodeModel extends PaginationModel, SearchText, Decode, MultiTenant {
    decode?: boolean  
}

const PaginationDecodeModelInit: PaginationDecodeModel = {
    tenantId: '',
    page: 0,
    pageSize: 10,
    sortBy: '',
    sortType: 'asc',
    decode: false
}

const PaginationDecodeModelInitForHistory: PaginationDecodeModel = {
    tenantId: '',
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

const PaginationTenantFilterModelInit: PaginationTenantFilterModel = { 
    tenantId: '',
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

export { PaginationTenantFilterModelInit, PaginationDecodeModelInit, PaginationDecodeModelInitForHistory, PaginationFilterModelInit, PaginationFilterModelAllInit }