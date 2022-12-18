import { BaseModel } from "../base-model";

export interface TenantModel extends BaseModel<string> {
     title: string; 
}

 const TenantModelInit :TenantModel = {
      title: "", 
      id: "",
      createdAt: "",
      updatedAt: "",
      logId: "",
      isExpanded: false
 }

 export default TenantModelInit 
