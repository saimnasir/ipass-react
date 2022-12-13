import { BaseModel } from "../base-model";

export interface EnvironmentTypeModel extends BaseModel<string> {
    title: string;
}

const EnvironmentTypeModelInit : EnvironmentTypeModel = {
    title: "",
    id: "",
    created: "",
    updated: "",
    logId: "",
    isExpanded: false
}

export default EnvironmentTypeModelInit