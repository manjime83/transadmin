import { APIGatewayProxyWithCognitoAuthorizerHandler, APIGatewayProxyWithCognitoAuthorizerEvent, Context, APIGatewayProxyResult } from 'aws-lambda';

export const hello: APIGatewayProxyWithCognitoAuthorizerHandler = async (_event: APIGatewayProxyWithCognitoAuthorizerEvent, _context: Context): Promise<APIGatewayProxyResult> => {
    return Promise.resolve<APIGatewayProxyResult>({
        statusCode: 200,
        body: JSON.stringify({
            message: Math.floor(Math.random() * 10)
        })
    });
};