import { api } from '../services/api.ts';


export async function health (){
         let status = { ok: true }
    try {
        await api.get('/health');
                  status.ok = true;
    } catch {
                  status.ok = false;

        }finally{
            return status
        }

}
