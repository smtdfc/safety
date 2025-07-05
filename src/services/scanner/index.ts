import { AppContext } from '../../context';
import { PageInfo ,ScanResult} from '../../types';

const HOST_URL = "https://safety.smtdfc-master.workers.dev";

export class ScanService{
  static async scan(info:PageInfo){
    let res = await fetch(`${HOST_URL}/scan/fullscan`,{
      method:"post",
      headers:{
        "content-type":"application/json"
      },
      body:JSON.stringify(info)
    });
    
    let raw = (await res.json());
    AppContext.set(
      "scanResult",
      raw.result as ScanResult
    );
  }
}