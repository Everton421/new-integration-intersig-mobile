import { seed } from "./database/seed/seed.ts";
import { consumer_sistema } from "./jobs/consumer-sistema.ts";
import { cleanEvents } from "./services/service-clean-events.ts";
 

await consumer_sistema();
     await cleanEvents();
     await seed( )