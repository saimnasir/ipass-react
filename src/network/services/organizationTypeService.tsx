
import { http } from "../http";
import { FinalResponse } from '../../models/final-response';
 import { PaginationFilterModel } from '../../models/paginationModel';
import { AxiosResponse } from 'axios';
import { ListResponse } from '../../models/list-response'; 
import { OrganizationTypeModel } from "../../models/organization/organization-type/organizationTypeModel";
import { SingleResponse } from "../../models/single-response";

export const getOrganizationTypes = async (pagination: PaginationFilterModel): Promise<AxiosResponse<FinalResponse<ListResponse<OrganizationTypeModel>>>> => {
    return await http.get<any, AxiosResponse<FinalResponse<ListResponse<OrganizationTypeModel>>>>("/organizationtypes", { params: pagination });
};
 

export const createOrganizationType = async (model: OrganizationTypeModel): Promise<AxiosResponse<FinalResponse<boolean>>> => {
    return await http.post<any, AxiosResponse<FinalResponse<boolean>>>("/organizationtypes", model);
};

export const getOrganizationType = async (id: string): Promise<AxiosResponse<FinalResponse<SingleResponse<OrganizationTypeModel>>>> => {
    return await http.get<any, AxiosResponse<FinalResponse<SingleResponse<OrganizationTypeModel>>>>(`/organizationtypes/${id}`);
};


export const updateOrganizationType = async (model: OrganizationTypeModel): Promise<AxiosResponse<FinalResponse<boolean>>> => {
    return await http.put<any, AxiosResponse<FinalResponse<boolean>>>("/organizationtypes", model);
};


