import * as AWS from "aws-sdk";
import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import * as uuid from "uuid";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  switch (event.requestContext.routeKey) {
    case "POST /notes": {
      if (event.body == null) {
        return buildResult(400, { error: { code: "ValidationException", message: "Bad Request" } });
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
      };

      try {
        await dynamodb.put(params).promise();
        return buildResult(201, params.Item);
      } catch (e) {
        console.error(e);
        const { code, message } = e;
        return buildResult(500, { error: { code, message } });
      }
    }

    case "GET /notes": {
      const params: AWS.DynamoDB.DocumentClient.ScanInput = {
        TableName: event.stageVariables!.NOTES_TABLE,
        FilterExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": event.requestContext.apiId,
        },
      };

      try {
        const output = await dynamodb.scan(params).promise(); // query
        return buildResult(200, output.Items);
      } catch (e) {
        console.error(e);
        const { code, message } = e;
        return buildResult(500, { error: { code, message } });
      }
    }

    case "GET /notes/{id}": {
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
          return buildResult(200, output.Item);
        } else {
          return buildResult(404, { error: { code: "Exception", message: "Not Found" } });
        }
      } catch (e) {
        console.error(e);
        const { code, message } = e;
        return buildResult(500, { error: { code, message } });
      }
    }

    case "PUT /notes/{id}": {
      if (event.body == null) {
        return buildResult(400, { error: { code: "ValidationException", message: "Bad Request" } });
      }

      const { content, attachment } = JSON.parse(event.body);

      const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
        TableName: event.stageVariables!.NOTES_TABLE,
        Key: {
          userId: event.requestContext.apiId,
          noteId: event.pathParameters!.id,
        },
        UpdateExpression: "SET content = :content, attachment = :attachment",
        ExpressionAttributeValues: {
          ":content": content || null,
          ":attachment": attachment || null,
        },
        ReturnValues: "ALL_NEW",
      };

      try {
        const output = await dynamodb.update(params).promise();
        return buildResult(201, output.Attributes);
      } catch (e) {
        console.error(e);
        const { code, message } = e;
        return buildResult(500, { error: { code, message } });
      }
    }

    case "DELETE /notes/{id}": {
      const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
        TableName: event.stageVariables!.NOTES_TABLE,
        Key: {
          userId: event.requestContext.apiId,
          noteId: event.pathParameters!.id,
        },
        ReturnValues: "ALL_OLD",
      };

      try {
        const output = await dynamodb.delete(params).promise();
        return buildResult(201, output.Attributes);
      } catch (e) {
        console.error(e);
        const { code, message } = e;
        return buildResult(500, { error: { code, message } });
      }
    }

    default:
      return buildResult(404, { error: { code: "Exception", message: "Not Found" } });
  }
};

function buildResult(statusCode: number, body: any): APIGatewayProxyResult {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}
