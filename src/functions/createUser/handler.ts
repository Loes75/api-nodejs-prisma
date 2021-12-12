import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import {PrismaClient} from "@prisma/client"

import schema from './schema';

const prisma = new PrismaClient()

const createUser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    try{
      const name = event.body.name
      const email = event.body.email
      const balance = event.body.balance
      if(!name || !email || !balance){
        throw 'MISSING_VALUES'
      }
      const user = await prisma.user.create({
          data: {
              email: email,
              name: name,
              balance: balance
          }
      })
      return formatJSONResponse({
        user : user
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

export const main = middyfy(createUser);