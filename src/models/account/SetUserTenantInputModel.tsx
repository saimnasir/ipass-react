import { BaseModel } from "../base-model";

export interface SetUserTenantInputModel extends BaseModel<string> {
    userId: string;
    TenantIds: string[];
}

const SetUserTenantInputModelInit: SetUserTenantInputModel = {
    userId: "",
    TenantIds: [],
    id: "",
    created: "",
    updated: "",
    logId: "",
    isExpanded: false
}

export default SetUserTenantInputModelInit 