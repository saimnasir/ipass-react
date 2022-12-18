
import { http } from "../http";
import { FinalResponse } from '../../models/final-response';
import { MemoryModel } from '../../models/memory/memory/memoryModel';
import { PaginationDecodeModel } from '../../models/paginationModel';
import { AxiosResponse } from 'axios';
import { ListResponse } from '../../models/list-response';
import { SingleResponse } from "../../models/single-response";

export const getMemories = async (pagination: PaginationDecodeModel): Promise<AxiosResponse<FinalResponse<ListResponse<MemoryModel>>>> => {
    console.log('pagination', pagination)
    return await http.get<any, AxiosResponse<FinalResponse<ListResponse<MemoryModel>>>>(`/memories`, { params: pagination });
};

export const getMemoryHistory = async (pagination: PaginationDecodeModel, id: string): Promise<AxiosResponse<FinalResponse<ListResponse<MemoryModel>>>> => {
    return await http.get<any, AxiosResponse<FinalResponse<ListResponse<MemoryModel>>>>(`/memories/history/${id}`, { params: pagination });
};

export const getMemory = async (id: string, decode: boolean = false): Promise<AxiosResponse<FinalResponse<SingleResponse<MemoryModel>>>> => {
    let params = { decode: decode.toString() }
    return await http.get<any, AxiosResponse<FinalResponse<SingleResponse<MemoryModel>>>>(`/memories/${id}`, { params: params });
};


export const createMemory = async (model: MemoryModel): Promise<AxiosResponse<FinalResponse<boolean>>> => {
    return await http.post<any, AxiosResponse<FinalResponse<boolean>>>("/memories", model);
};


export const updateMemory = async (model: MemoryModel): Promise<AxiosResponse<FinalResponse<boolean>>> => {
    return await http.put<any, AxiosResponse<FinalResponse<boolean>>>("/memories", model);
};

