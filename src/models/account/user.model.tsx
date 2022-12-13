import { PinCodeModel } from "./pin-code.model";

export interface User {
    id: string;
    phoneNumber: string;
    email: string;
    password: string;
    userName: string;
    firstName: string;
    lastName: string;
    token: string;
    birthDate: Date | null
}

export interface RegisterModel {
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
    active: true;
}

export interface LoginResult {
    accessToken: string;
    refreshToken?: string;
    tokenType?: string;
    expiresIn?: number;
    isActivationCodeValidated?: boolean;
    isProfileCompleted?: boolean;
    isActivationCodeSent?: boolean;
    isContractsAccepted?: boolean;
    userName?:string
}

export interface ProfileModel {
    user: User;
    pinCode: PinCodeModel;
}