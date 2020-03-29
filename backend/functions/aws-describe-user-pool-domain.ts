import * as AWS from "aws-sdk";
import {
  CloudFormationCustomResourceHandler,
  CloudFormationCustomResourceEvent,
  Context,
  CloudFormationCustomResourceSuccessResponse,
  CloudFormationCustomResourceFailedResponse,
} from "aws-lambda";
import * as axios from "axios";

const cognito = new AWS.CognitoIdentityServiceProvider();

export const handler: CloudFormationCustomResourceHandler = async (
  event: CloudFormationCustomResourceEvent,
  _context: Context
): Promise<void> => {
  console.log(event);

  switch (event.RequestType) {
    case "Create":
    case "Update":
    case "Delete":
      try {
        const { DomainDescription } = await cognito
          .describeUserPoolDomain({ Domain: event.ResourceProperties.Domain })
          .promise();

        console.log(DomainDescription);

        const response = await axios.default.put(event.ResponseURL, {
          Status: "SUCCESS",
          PhysicalResourceId: event.ResourceProperties.Domain,
          StackId: event.StackId,
          RequestId: event.RequestId,
          LogicalResourceId: event.LogicalResourceId,
          Data: DomainDescription,
        } as CloudFormationCustomResourceSuccessResponse);

        console.log(response.status, response.statusText, response.data);
      } catch (error) {
        console.error(error);

        const response = await axios.default.put(event.ResponseURL, {
          Status: "FAILED",
          Reason: (error as Error).message,
          PhysicalResourceId: event.ResourceProperties.Domain,
          StackId: event.StackId,
          RequestId: event.RequestId,
          LogicalResourceId: event.LogicalResourceId,
        } as CloudFormationCustomResourceFailedResponse);

        console.log(response.status, response.statusText, response.data);
      }
      break;
  }
};
