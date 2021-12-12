import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import {PrismaClient} from "@prisma/client"


const prisma = new PrismaClient()

const getUsers: ValidatedEventAPIGatewayProxyEvent<string> = async () => {
 try{
    const users = await prisma.user.findMany()
    return formatJSONResponse({
      users : users
    });
 }catch{
    return formatJSONResponse({
      statusCode : 500,
      message: "Internal error"
    });
 }
}

export const main = middyfy(getUsers);