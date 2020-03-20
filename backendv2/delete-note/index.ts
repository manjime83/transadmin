import * as lambda from 'aws-lambda';
import * as AWS from 'aws-sdk';
import * as uuid from 'uuid';

const db = new AWS.DynamoDB.DocumentClient();

export const handler: lambda.APIGatewayProxyWithCognitoAuthorizerHandler = async (_event: lambda.APIGatewayProxyWithCognitoAuthorizerEvent, _context: lambda.Context): Promise<lambda.APIGatewayProxyResult> => {
    await db.put({
        TableName: process.env.TABLE_NAME!,
        Item: {
            userId: uuid.v4(),
            noteId: uuid.v4()
        }
    }).promise();

    return Promise.resolve<lambda.APIGatewayProxyResult>({
        statusCode: 200,
        body: JSON.stringify({
            message: Math.floor(Math.random() * 10)
        })
    });
};