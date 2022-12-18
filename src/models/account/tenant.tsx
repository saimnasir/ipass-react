import { BaseModel } from "../base-model";

export interface TenantModel extends BaseModel<string> {
     title: string; 
}

 const TenantModelInit :TenantModel = {
      title: "", 
      id: "",
      created: "",
      updated: "",
      logId: "",
      isExpanded: false
 }

 export default TenantModelInit 
