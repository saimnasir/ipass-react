import { BaseModel } from "../../base-model";

export interface OrganizationTypeModel extends BaseModel <string>  {
    title: string;  
}

const OrganizationTypeModelInit: OrganizationTypeModel={
    title: "",
    id: "",
    createdAt: "",
    updatedAt: "",
    logId: "",
    isExpanded: false
}

export default  OrganizationTypeModelInit 