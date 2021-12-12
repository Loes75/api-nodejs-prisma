import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import {PrismaClient} from "@prisma/client"

import schema from './schema'

const prisma = new PrismaClient()

const transferMoney: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    try{
      const receiverId = event.body.receiverId
      const senderId = event.body.senderId
      const amount = event.body.amount
      if(!receiverId || !senderId || !amount){
        throw 'MISSING_VALUES'
      }
      var sender = await prisma.user.findUnique({
          where : {
              id: senderId
          }
      })
      if(sender.balance >= amount){
          var receiver = await prisma.user.update({
              where:{
                id: receiverId
              },
              data:{
                  balance : {increment: amount}
              }
            })
          sender = await prisma.user.update({
              where:{
                id: senderId
              },
              data:{
                  balance : {decrement: amount}
              }
            })
  
          return formatJSONResponse({
              transfer: "successful",
              receiverId: receiverId,
              senderId: senderId
          });
      } 
      else{
          return formatJSONResponse({
              transfer: "unsuccessful",
              reason : "non-sufficient funds"
          }); 
      }
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

export const main = middyfy(transferMoney);