
import { removeData, storeData } from '../../helpers/localStorage'
import { http } from "../http";
import { anonymousHttp } from "../anonymousHttp";
import { FinalResponse } from '../../models/final-response';
import { LoginResult, ProfileModel, User } from '../../models/account/user.model';
import { AxiosResponse } from 'axios';
import { SingleResponse } from '../../models/single-response';
import { PinCodeModel } from '../../models/account/pin-code.model';

export const login = async (data: any): Promise<AxiosResponse<FinalResponse<LoginResult>>> => {
    removeData('user')
    return await anonymousHttp.post<any, AxiosResponse<FinalResponse<LoginResult>>>("/Account/login", data);
}

export const register = async (data: any): Promise<AxiosResponse<FinalResponse<LoginResult>>> => {
    removeData('user')
    return await anonymousHttp.post<any, AxiosResponse<FinalResponse<LoginResult>>>("/Account/register", data);
}

export const loginFacebook = () => {
    loginExternal('facebook')
}

export const loginGoogle = () => {
    loginExternal('google')
}

export const loginOkta = () => {
    loginExternal('okta')
}

const loginExternal = (provider: string) => {
    let url: string = '/external-auth'
    http.redirectExternal(url, provider)
}

export const authExternal = async (urlParams: string): Promise<AxiosResponse<FinalResponse<LoginResult>>> => {
    http.initHttp();
    return await http.get<any, AxiosResponse<FinalResponse<LoginResult>>>(`/account/ext-callback${urlParams}`);
}

export const getProfile = async (): Promise<AxiosResponse<FinalResponse<SingleResponse<ProfileModel>>>> => {
    http.initHttp();
    return await http.get<any, AxiosResponse<FinalResponse<SingleResponse<ProfileModel>>>>(`/account/profile`);
}

export const updateProfile = async (model: User): Promise<AxiosResponse<FinalResponse<boolean>>> => {
    return await http.put<any, AxiosResponse<FinalResponse<boolean>>>("/account/profile", model);
};

export const createPinCode = async (model: any): Promise<AxiosResponse<FinalResponse<boolean>>> => {
    return await http.post<any, AxiosResponse<FinalResponse<boolean>>>("/pincodes", model);
};

export const checkPinCode = async (model: any): Promise<AxiosResponse<FinalResponse<SingleResponse<PinCodeModel>>>> => {
    http.initHttp();
    return await http.post<any, AxiosResponse<FinalResponse<SingleResponse<PinCodeModel>>>>(`/pincodes/check`, model);
}

