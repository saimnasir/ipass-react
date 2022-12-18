import { BaseModel } from "../../base-model";

export interface MemoryTypeModel extends BaseModel<string> {
    title: string;
    tenantId: string,
}

const MemoryTypeModelInit : MemoryTypeModel ={
    title: '',
    tenantId: "",
    id: "",
    createdAt: "",
    updatedAt: "",
    logId: "",
    isExpanded: false
}

export default MemoryTypeModelInit