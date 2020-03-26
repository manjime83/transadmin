import * as AWS from "aws-sdk";
import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import * as commons from "./lib/commons";
import * as uuid from "uuid";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  if (event.body == null) {
    return commons.buildResult(400, { error: { message: "Bad Request" } });
  }

  const { content, attachment } = JSON.parse(event.body);

  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: event.stageVariables!.NOTES_TABLE,
    Item: {
      userId: event.requestContext.apiId,
      noteId: uuid.v4(),
      content,
      attachment,
      createdAt: Date.now(),
    },
    ConditionExpression: "attribute_not_exists(userId)",
  };

  try {
    await dynamodb.put(params).promise();
    return commons.buildResult(201, params.Item);
  } catch (e) {
    console.error(e);
    const { code, message } = e;
    return commons.buildResult(500, { error: { code, message } });
  }
};
