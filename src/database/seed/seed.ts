import dbConn from "../../connection/database-connection.ts";
import { sqlTables } from "../structure/tables.ts";
import { sqlTriggers } from "../structure/triggers.ts";

async function seed( ) {
    for( const i of sqlTables){

        try{
        const [rows ] = await dbConn.query(i as string)
        console.log(rows);
        }catch(e){
            console.log(e)
            continue;
        }
    }
    for( const i of sqlTriggers){
        try{

        const [rows ] = await dbConn.query(i)
        console.log(rows);
        }catch(e){
            console.log(e)
            continue;
        }
    }
    
}

await seed();