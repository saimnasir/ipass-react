
import { http } from "../http";
import { FinalResponse } from '../../models/final-response';
import { PaginationFilterModel } from '../../models/paginationModel';
import { AxiosResponse } from 'axios';
import { ListResponse } from '../../models/list-response';
import { TenantModel } from "../../models/account/tenant";
import { SingleResponse } from "../../models/single-response";
import { SetUserTenantInputModel } from "../../models/account/SetUserTenantInputModel";

export const getTenants = async (pagination: PaginationFilterModel): Promise<AxiosResponse<FinalResponse<ListResponse<TenantModel>>>> => {
    return await http.get<any, AxiosResponse<FinalResponse<ListResponse<TenantModel>>>>("/tenants", { params: pagination });
};

export const getMyTenants = async (): Promise<AxiosResponse<FinalResponse<ListResponse<TenantModel>>>> => {
    return await http.get<any, AxiosResponse<FinalResponse<ListResponse<TenantModel>>>>("/tenants/my-tenants");
};

export const createTenant = async (model: TenantModel): Promise<AxiosResponse<FinalResponse<boolean>>> => {
    return await http.post<any, AxiosResponse<FinalResponse<boolean>>>("/tenants", model);
};

export const getTenant = async (id: string): Promise<AxiosResponse<FinalResponse<SingleResponse<TenantModel>>>> => {
    return await http.get<any, AxiosResponse<FinalResponse<SingleResponse<TenantModel>>>>(`/tenants/${id}`);
};

export const updateTenant = async (model: TenantModel): Promise<AxiosResponse<FinalResponse<boolean>>> => {
    return await http.put<any, AxiosResponse<FinalResponse<boolean>>>("/tenants", model);
};
 

export const getUserTenants = async (userId: string): Promise<AxiosResponse<FinalResponse<ListResponse<TenantModel>>>> => {
    return await http.get<any, AxiosResponse<FinalResponse<ListResponse<TenantModel>>>>(`/tenants/user-tenants/${userId}`);
};


export const setUserTenants = async (model: SetUserTenantInputModel): Promise<AxiosResponse<FinalResponse<boolean>>> => {
    return await http.post<any, AxiosResponse<FinalResponse<boolean>>>("/tenants/set-user-tenants", model);
};


