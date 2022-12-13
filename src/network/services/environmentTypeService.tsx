
import { http } from "../http";
import { FinalResponse } from '../../models/final-response';
 import { PaginationDecodeModel } from '../../models/paginationModel';
import { AxiosResponse } from 'axios';
import { ListResponse } from '../../models/list-response'; 
import { EnvironmentTypeModel } from "../../models/environment-type/environmentTypeModel";
import { SingleResponse } from "../../models/single-response";

export const getEnvironmentTypes = async (pagination: PaginationDecodeModel): Promise<AxiosResponse<FinalResponse<ListResponse<EnvironmentTypeModel>>>> => {
    return await http.get<any, AxiosResponse<FinalResponse<ListResponse<EnvironmentTypeModel>>>>("/environmentTypes", { params: pagination });
};
 

export const createEnvironmentType = async (model: EnvironmentTypeModel): Promise<AxiosResponse<FinalResponse<boolean>>> => {
    return await http.post<any, AxiosResponse<FinalResponse<boolean>>>("/environmenttypes", model);
};

export const getEnvironmentType = async (id: string): Promise<AxiosResponse<FinalResponse<SingleResponse<EnvironmentTypeModel>>>> => {
    return await http.get<any, AxiosResponse<FinalResponse<SingleResponse<EnvironmentTypeModel>>>>(`/environmenttypes/${id}`);
};


export const updateEnvironmentType = async (model: EnvironmentTypeModel): Promise<AxiosResponse<FinalResponse<boolean>>> => {
    return await http.put<any, AxiosResponse<FinalResponse<boolean>>>("/environmenttypes", model);
};