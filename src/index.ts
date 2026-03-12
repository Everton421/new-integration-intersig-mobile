import { mainTask } from "./jobs/main.ts";
import { cleanEvents } from "./services/service-clean-events.ts";
 

await mainTask ()

     await cleanEvents();