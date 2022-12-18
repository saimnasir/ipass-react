import { BaseModel } from "../../base-model";
export interface MemoryModel extends BaseModel<string> {
    title: string;
    organizationId: string; 
    memoryTypeId: string; 
    environmentTypeId?: string | undefined;
    userName: string;
    isUserNameSecure: boolean;
    email: string;
    isUEmailSecure: boolean;
    hostOrIpAddress: string| undefined;
    isHostOrIpAddressSecure: boolean;
    port: string;
    isPortSecure: boolean;
    password: string;
    description: string| undefined;
    active: boolean;
    confirmPassword: string;
    tenantId: string;
}

 const MemoryModelInit :MemoryModel = {
    title: "",
    organizationId: "",
    memoryTypeId: "",
    environmentTypeId: "",
    userName: "",
    isUserNameSecure: false,
    email: "",
    isUEmailSecure: false,
    hostOrIpAddress: "",
    isHostOrIpAddressSecure: false,
    port: "",
    isPortSecure: false,
    password: "",
    confirmPassword: "",
    description: "",
    active: false,
    id: "",
    created: "",
    updated: "",
    logId: "",
    tenantId: "",
    isExpanded: false
}

export default MemoryModelInit