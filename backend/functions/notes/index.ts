import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import * as uuid from "uuid";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  switch (context.clientContext) {
    default:
      return {
        statusCode: 200,
        body: JSON.stringify({
          uuid: uuid.v4(),
          event,
          context,
        }),
      };
  }
};
