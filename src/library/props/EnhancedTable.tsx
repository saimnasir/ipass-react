
import { SortDirection } from '@mui/material'
import { EnvironmentTypeModel } from '../../models/environment-type/environmentTypeModel';
import { MemoryTypeModel } from '../../models/memory/memory-type/memoryTypeModel';
import { MemoryModel } from '../../models/memory/memory/memoryModel';
import { OrganizationTypeModel } from '../../models/organization/organization-type/organizationTypeModel';
import { OrganizationModel } from '../../models/organization/organization/organizationModel';

export interface MemoryModelEnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof MemoryModel) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    toggleExpandedAll: (event: React.MouseEvent<HTMLButtonElement>) => void;
    //onOpenEditor: (event: React.MouseEvent<HTMLButtonElement>) => void;
    order: SortDirection;
    orderBy: string;
    rowCount: number;
    expandAll: boolean
}

export interface MemoryTypeModelEnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof MemoryTypeModel) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onOpenEditor: (event: React.MouseEvent<HTMLButtonElement>) => void;
    order: SortDirection;
    orderBy: string;
    rowCount: number;
}

export interface OrganizationModelEnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof OrganizationModel) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onOpenEditor: (event: React.MouseEvent<HTMLButtonElement>) => void;
    order: SortDirection;
    orderBy: string;
    rowCount: number;
}

export interface OrganizationTypeModelEnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof OrganizationTypeModel) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onOpenEditor: (event: React.MouseEvent<HTMLButtonElement>) => void;
    order: SortDirection;
    orderBy: string;
    rowCount: number;
}

export interface EnvironmentTypeModelEnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof EnvironmentTypeModel) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onOpenEditor: (event: React.MouseEvent<HTMLButtonElement>) => void;
    order: SortDirection;
    orderBy: string;
    rowCount: number;
}