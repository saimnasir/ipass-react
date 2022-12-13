
import { http } from "../http";
import { FinalResponse } from '../../models/final-response';
import { PaginationFilterModel } from '../../models/paginationModel';
import { AxiosResponse } from 'axios';
import { ListResponse } from '../../models/list-response';
import { OrganizationModel } from "../../models/organization/organization/organizationModel";
import { SingleResponse } from "../../models/single-response";

export const getOrganizations = async (pagination: PaginationFilterModel): Promise<AxiosResponse<FinalResponse<ListResponse<OrganizationModel>>>> => {
    return await http.get<any, AxiosResponse<FinalResponse<ListResponse<OrganizationModel>>>>("/organizations", { params: pagination });
};

export const createOrganization = async (model: OrganizationModel): Promise<AxiosResponse<FinalResponse<boolean>>> => {
    return await http.post<any, AxiosResponse<FinalResponse<boolean>>>("/organizations", model);
};


export const getOrganization = async (id: string): Promise<AxiosResponse<FinalResponse<SingleResponse<OrganizationModel>>>> => {
    return await http.get<any, AxiosResponse<FinalResponse<SingleResponse<OrganizationModel>>>>(`/organizations/${id}`);
};


export const updateOrganization = async (model: OrganizationModel): Promise<AxiosResponse<FinalResponse<boolean>>> => {
    return await http.put<any, AxiosResponse<FinalResponse<boolean>>>("/organizations", model);
};


