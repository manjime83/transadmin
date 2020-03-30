import * as AWS from "aws-sdk";
import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import * as commons from "./lib/commons";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  const params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: event.stageVariables!.NOTES_TABLE,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.requestContext.apiId,
    },
  };

  try {
    const output = await dynamodb.query(params).promise(); // query
    return commons.buildProxyResult(200, output.Items);
  } catch (e) {
    console.error(e);
    const { code, message } = e;
    return commons.buildProxyResult(500, { error: { code, message } });
  }
};
