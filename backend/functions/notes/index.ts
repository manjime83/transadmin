import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
// import * as uuid from "uuid";
// import * as AWS from "aws-sdk";

// const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  switch (event.requestContext.routeKey) {
    case "POST /notes":
      if (event.body === null) {
        return {
          statusCode: 500,
          body: JSON.stringify({
            requestId: context.awsRequestId,
            messahe: "bad request",
            event,
            context,
          }),
        };
      }

      // const { description } = JSON.parse(event.body);

      return {
        statusCode: 200,
        body: JSON.stringify({
          requestId: context.awsRequestId,
          messahe: "estoy en listar",
          event,
          context,
        }),
      };

    case "GET /notes/{id}":
      return {
        statusCode: 200,
        body: JSON.stringify({
          requestId: context.awsRequestId,
          messahe: "estoy en listar",
        }),
      };

    default:
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Not Found",
        }),
      };
  }
};
