import { APIGatewayProxyWithCognitoAuthorizerHandler, APIGatewayProxyWithCognitoAuthorizerEvent, Context, APIGatewayProxyResult } from 'aws-lambda';

import * as AWS from 'aws-sdk';
import * as uuid from 'uuid';

const db = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyWithCognitoAuthorizerHandler = async (_event: APIGatewayProxyWithCognitoAuthorizerEvent, _context: Context): Promise<APIGatewayProxyResult> => {
    await db.put({
        TableName: process.env.TABLE_NAME!,
        Item: {
            userId: uuid.v4(),
            noteId: uuid.v4()
        }
    }).promise();

    return Promise.resolve<APIGatewayProxyResult>({
        statusCode: 200,
        body: JSON.stringify({
            message: Math.floor(Math.random() * 10)
        })
    });
};