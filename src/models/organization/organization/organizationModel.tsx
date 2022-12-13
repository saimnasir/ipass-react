import { BaseModel } from "../../base-model";
 
export interface OrganizationModel extends BaseModel<string> {
    title: string;
    active: boolean;

    organizationTypeId: string;
    //organizationType: OrganizationTypeModel;

    parentOrganizationId: string;
    //parentOrganization: OrganizationModel;
}


const OrganizationModelInit :OrganizationModel = {
    title: "",
    active: false,
    organizationTypeId: "",
    parentOrganizationId: "",
    id: "",
    created: "",
    updated: "",
    logId: "",
    isExpanded: false
}

export default OrganizationModelInit