import * as AWS from "aws-sdk";
import { CloudFormationCustomResourceHandler, CloudFormationCustomResourceEvent, Context } from "aws-lambda";
import * as response from "cfn-response";

const cognito = new AWS.CognitoIdentityServiceProvider();

export const handler: CloudFormationCustomResourceHandler = async (
  event: CloudFormationCustomResourceEvent,
  context: Context
): Promise<void> => {
  switch (event.RequestType) {
    case "Create":
    case "Update":
    case "Delete":
      try {
        const { DomainDescription } = await cognito
          .describeUserPoolDomain({ Domain: event.ResourceProperties.Domain })
          .promise();
        await response.send(event, context, response.SUCCESS, DomainDescription);
      } catch (error) {
        console.error("Response error:\n", error);
        await response.send(event, context, response.FAILED);
      }
      break;
  }
};
