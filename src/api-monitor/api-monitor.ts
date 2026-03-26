import { health } from "./health.ts";
import {   readFile, writeFile } from 'node:fs/promises';


 setInterval(async () => {
    console.log("testando...")
   const resultHealth = await health()
        await writeFile('./api_status.json',JSON.stringify(resultHealth, null, 2 ) );

}, 30000);