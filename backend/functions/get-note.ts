import * as AWS from "aws-sdk";
import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import * as commons from "./lib/commons";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
    TableName: event.stageVariables!.NOTES_TABLE,
    Key: {
      userId: event.requestContext.apiId,
      noteId: event.pathParameters!.id,
    },
  };

  try {
    const output = await dynamodb.get(params).promise();
    if (output.Item) {
      return commons.buildProxyResult(200, output.Item);
    } else {
      return commons.buildProxyResult(404, { error: { message: "Not Found" } });
    }
  } catch (e) {
    console.error(e);
    const { code, message } = e;
    return commons.buildProxyResult(500, { error: { code, message } });
  }
};
