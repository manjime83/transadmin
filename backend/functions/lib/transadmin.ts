import { APIGatewayProxyResult } from "aws-lambda";

export function buildResult(statusCode: number, body: any): APIGatewayProxyResult {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}
