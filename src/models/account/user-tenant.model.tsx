import { BaseModel } from "../base-model";

export interface UserTenantModel extends BaseModel<string> {
    userId: string;
    tenantId: string;
}

const UserTenantModelInit: UserTenantModel = {
    userId: "",
    tenantId: "",
    id: "",
    created: "",
    updated: "",
    logId: "",
    isExpanded: false
}

export default UserTenantModelInit 
