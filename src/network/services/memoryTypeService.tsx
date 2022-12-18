
import { http } from "../http";
import { FinalResponse } from '../../models/final-response';
import { PaginationFilterModel } from '../../models/paginationModel';
import { AxiosResponse } from 'axios';
import { ListResponse } from '../../models/list-response';
import { MemoryTypeModel } from '../../models/memory/memory-type/memoryTypeModel';
import { SingleResponse } from "../../models/single-response";

export const getMemoryTypes = async (pagination: PaginationFilterModel): Promise<AxiosResponse<FinalResponse<ListResponse<MemoryTypeModel>>>> => {
    return await http.get<any, AxiosResponse<FinalResponse<ListResponse<MemoryTypeModel>>>>("/memorytypes", { params: pagination });
};

export const createMemoryType = async (model: MemoryTypeModel, tenantId: string): Promise<AxiosResponse<FinalResponse<boolean>>> => {
    let params = { tenantId  }
    return await http.post<any, AxiosResponse<FinalResponse<boolean>>>("/memorytypes", model, {params: params});
};

export const getMemoryType = async (id: string): Promise<AxiosResponse<FinalResponse<SingleResponse<MemoryTypeModel>>>> => {
    return await http.get<any, AxiosResponse<FinalResponse<SingleResponse<MemoryTypeModel>>>>(`/memorytypes/${id}`);
};


export const updateMemoryType = async (model: MemoryTypeModel): Promise<AxiosResponse<FinalResponse<boolean>>> => {
    return await http.put<any, AxiosResponse<FinalResponse<boolean>>>("/memorytypes", model);
};

