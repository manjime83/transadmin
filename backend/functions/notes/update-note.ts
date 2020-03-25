import * as AWS from "aws-sdk";
import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { buildResult } from "./lib/build-result";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  if (event.body == null) {
    return buildResult(400, { error: { message: "Bad Request" } });
  }

  const { content, attachment } = JSON.parse(event.body);

  const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: event.stageVariables!.NOTES_TABLE,
    Key: {
      userId: event.requestContext.apiId,
      noteId: event.pathParameters!.id,
    },
    UpdateExpression: "SET content = :content, attachment = :attachment",
    ConditionExpression: "attribute_exists(userId)",
    ExpressionAttributeValues: {
      ":content": content,
      ":attachment": attachment,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const output = await dynamodb.update(params).promise();
    return buildResult(200, output.Attributes);
  } catch (e) {
    console.error(e);
    const { code, message } = e;
    return buildResult(500, { error: { code, message } });
  }
};