import { type ResultSetHeader } from "mysql2";
import dbConn from "../../connection/database-connection.ts";
import { sqlTables } from "../structure/tables.ts";

export async function seed( ) {
    for( const i of sqlTables){

        try{
        const [rows ] = await dbConn.query(i as string) ;
        const result = rows as ResultSetHeader;
          if( result.affectedRows > 0 ) console.log(result);
        }catch(e){
            console.log(e)
            continue;
        }
    }
  //  for( const i of sqlTriggers){
  //      try{
//
  //      const [rows ] = await dbConn.query(i)
  //      console.log(rows);
  //      }catch(e){
  //          console.log(e)
  //          continue;
  //      }
  //  }
    
}

await seed();