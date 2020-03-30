import * as AWS from "aws-sdk";
import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import * as commons from "./lib/commons";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
    TableName: event.stageVariables!.NOTES_TABLE,
    Key: {
      userId: event.requestContext.apiId,
      noteId: event.pathParameters!.id,
    },
    ConditionExpression: "attribute_exists(userId)",
    ReturnValues: "ALL_OLD",
  };

  try {
    const output = await dynamodb.delete(params).promise();
    return commons.buildProxyResult(200, output.Attributes);
  } catch (e) {
    console.error(e);
    const { code, message } = e;
    return commons.buildProxyResult(500, { error: { code, message } });
  }
};
