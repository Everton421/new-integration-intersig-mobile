import dbConn, { MOBILE } from "../connection/database-connection.ts";
import { type event } from "../contracts/event.ts";
import { type table_enviados } from "../contracts/table-enviados.ts";
import { orderMapper } from "../mapper/order-mapper.ts";
import { DateService } from "../utils/date.ts";
import { api } from "./api.ts";


export async function serviceSendOrder(event: event) {
        const origin = process.env.API_ORIGIN_NAME || 'erp_integration';

        const [arrVerifyOrder] = await dbConn.query(`SELECT * FROM ${MOBILE}.pedidos WHERE codigo_sistema = ${event.id_registro};`)
        const verifyOrder = arrVerifyOrder as table_enviados[];

        const obj = await orderMapper(event.id_registro);

        if (verifyOrder.length > 0) {
                if (obj !== undefined) {
                        try {

                                const result = await api.post("/pedidos", [obj], {
                                        headers: {
                                                source: origin
                                        }
                                }
                                )

                                if (result.status === 200) {
                                        const resultId = result.data.results[0].codigo;
                                }
                        } catch (e) {
                                console.log(e)
                        }
                }

        } else {

                if (obj !== undefined) {
                        try {

                                const result = await api.post("/pedidos", [obj],
                                        {
                                                headers: {
                                                        source: origin
                                                }
                                        }
                                )

                                if (result.status === 200) {
                                        const resultId = result.data.results[0].codigo;

                                        const SQL = `INSERT INTO ${MOBILE}.pedidos SET id_mobile = ? , codigo_sistema = ? ;`;
                                        const values = [resultId, event.id_registro]
                                        await dbConn.query(SQL, values)
                                } else {
                                }
                        } catch (e) {
                                console.log(e)
                        }
                }

                // enviar como novo 
        }


}