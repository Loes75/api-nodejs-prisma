import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import {PrismaClient} from "@prisma/client"

import schema from './schema'

const prisma = new PrismaClient()

const updateBalance: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
   try{
      const amount = event.body.amount
      const id = event.pathParameters.id
      if(!amount || !id){
        throw 'MISSING_VALUES'
      }
      const user = await prisma.user.update({
        where:{
          id: id
        },
        data:{
            balance : {increment : amount}
        }
      })
      return formatJSONResponse({
        user : user
      });
   }catch(e){
     console.log(e)
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

export const main = middyfy(updateBalance);