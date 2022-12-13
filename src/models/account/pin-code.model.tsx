import { BaseModel } from "../base-model";

export interface PinCodeModel extends BaseModel<string> {
     code: string;
     active: boolean;
}

 const PinCodeModelInit :PinCodeModel = {
      code: "",
      active: false,
      id: "",
      created: "",
      updated: "",
      logId: "",
      isExpanded: false
 }

 export default PinCodeModelInit