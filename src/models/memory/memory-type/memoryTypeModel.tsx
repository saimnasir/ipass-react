import { BaseModel } from "../../base-model";

export interface MemoryTypeModel extends BaseModel<string> {
    title: string;
}

const MemoryTypeModelInit : MemoryTypeModel ={
    title: '',
    id: "",
    created: "",
    updated: "",
    logId: "",
    isExpanded: false
}

export default MemoryTypeModelInit