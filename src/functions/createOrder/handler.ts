import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import {PrismaClient} from "@prisma/client"

import schema from './schema';

const prisma = new PrismaClient()

const createOrder: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    try{
        const id = event.body.userId
        const total = event.body.total
        if(!id || !total){
            throw 'MISSING_VALUES'
        }
        const user = await prisma.user.findUnique({
            where : {
                id: id
            }
        })
        if(user.balance >= total){
            var order = await prisma.order.create({
                data:{
                    userId: user.id,
                    total: total
                }
            })
            var upatedUser = await prisma.user.update({
                where:{
                    id: id
                },
                data: {
                    balance : {decrement: total}
                }
            })
        }
        return formatJSONResponse({
            user : upatedUser,
            order : order
        });

    }catch(e){
        if(e == 'MISSING_VALUES'){
            return formatJSONResponse({
                statusCode : 400,
                message: "Missing values"
            });
        }
        return formatJSONResponse({
            statusCode : 500,
            message: "Internal error"
        });
    }
  }

export const main = middyfy(createOrder);