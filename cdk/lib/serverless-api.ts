import * as cdk from "@aws-cdk/core";
import * as apigatewayv2 from "@aws-cdk/aws-apigatewayv2";
import * as lambda from "@aws-cdk/aws-lambda";
import * as logs from "@aws-cdk/aws-logs";
import { paramCase, pascalCase } from "change-case";
import * as path from "path";
import * as assets from "@aws-cdk/aws-s3-assets";
import * as iam from "@aws-cdk/aws-iam";

interface ServerlessApiProps extends cdk.StackProps {
  projectName: string;
  envType: string;
}

export class ServerlessApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ServerlessApiProps) {
    super(scope, id, props);

    const { projectName, envType } = props;
    const domainName = "api.".concat(envType === "prod" ? "" : `${envType}.`).concat(`${projectName}.co`);

    const api = new apigatewayv2.CfnApi(this, "Api", {
      name: `${projectName}-${envType}`,
      protocolType: "HTTP",
      corsConfiguration: {
        allowOrigins: [`https://app.${domainName}`],
      },
    });

    const asset = new assets.Asset(this, "Asset", {
      path: path.join(__dirname, `../../backend/.aws/layers/${projectName}.zip`),
    });

    const lambdaLayer = new lambda.CfnLayerVersion(this, "LayerVersion", {
      layerName: `${projectName}-${envType}`,
      content: { s3Bucket: asset.s3BucketName, s3Key: asset.s3ObjectKey },
      compatibleRuntimes: ["nodejs12.x"],
    });

    {
      const basename = "create-note";
      const paramName = paramCase(basename);
      const pascalName = pascalCase(basename);

      const role = new iam.CfnRole(this, `${pascalName}Role`, {
        roleName: `${projectName}-${envType}-${paramName}`,
        assumeRolePolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Principal: {
                Service: ["lambda.amazonaws.com"],
              },
              Effect: "Allow",
              Action: ["sts:AssumeRole"],
            },
          ],
        },
        managedPolicyArns: ["arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"],
      });

      const asset = new assets.Asset(this, `${pascalName}Asset`, {
        path: path.join(__dirname, `../../backend/.aws/functions/${paramName}.zip`),
      });

      const lambdaFunction = new lambda.CfnFunction(this, `${pascalName}Function`, {
        functionName: `${projectName}-${envType}-${paramName}`,
        runtime: "nodejs12.x",
        code: {
          s3Bucket: asset.s3BucketName,
          s3Key: asset.s3ObjectKey,
        },
        handler: "index.handler",
        timeout: 10,
        layers: [lambdaLayer.ref],
        role: role.ref,
      });

      const log = new logs.LogGroup(this, `${pascalName}LogGroup`, {
        logGroupName: `/aws/lambda/${lambdaFunction.functionName}`,
        retention: logs.RetentionDays.ONE_WEEK,
      });

      lambdaFunction.node.addDependency(log);

      const integration = new apigatewayv2.CfnIntegration(this, `${pascalName}Integration`, {
        apiId: api.ref,
        integrationType: "AWS_PROXY",
        integrationUri: `arn:aws:apigateway:${props.env!.region}:lambda:path/2015-03-31/functions/${
          lambdaFunction.attrArn
        }/invocations`,
        payloadFormatVersion: "2.0",
      });

      const route = new apigatewayv2.CfnRoute(this, `${pascalName}Route`, {
        apiId: api.ref,
        routeKey: "PUT /notes",
        target: `integrations/${integration.ref}`,
      });
    }
  }
}
