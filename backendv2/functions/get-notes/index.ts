import * as lambda from "aws-lambda";

export const handler: lambda.APIGatewayProxyWithCognitoAuthorizerHandler = async (
  event: lambda.APIGatewayProxyWithCognitoAuthorizerEvent,
  context: lambda.Context
): Promise<lambda.APIGatewayProxyResult> => {
  console.log(JSON.stringify(event), JSON.stringify(context));

  return Promise.resolve<lambda.APIGatewayProxyResult>({
    statusCode: 200,
    body: JSON.stringify({
      message: Math.floor(Math.random() * 10)
    })
  });
};
