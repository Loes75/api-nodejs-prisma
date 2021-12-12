import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import {PrismaClient} from "@prisma/client"

import schema from './schema';

const prisma = new PrismaClient()

const getUser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    try{
      const id = event.pathParameters.id
      if(!id){
        throw 'MISSING_VALUES'
      }
      const user = await prisma.user.findUnique({
        where:{
          id: id
        }
      })
      if(!user){
        return formatJSONResponse({
          message: "user not found",
          user: user
        });
      }
      return formatJSONResponse({
        message: "success",
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

export const main = middyfy(getUser);