import { BaseModel } from "../base-model";

export interface EnvironmentTypeModel extends BaseModel<string> {
    title: string;
}

const EnvironmentTypeModelInit : EnvironmentTypeModel = {
    title: "",
    id: "",
    createdAt: "",
    updatedAt: "",
    logId: "",
    isExpanded: false
}

export default EnvironmentTypeModelInit