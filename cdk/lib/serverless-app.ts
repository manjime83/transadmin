import * as cdk from "@aws-cdk/core";
import { ServerlessStack } from "./serverless-stack";
import { ServerlessApiStack } from "./serverless-api";

interface ServerlessAppProps extends cdk.AppProps {
  projectName: string;
  envType: string;
}

export class ServerlessApp extends cdk.App {
  constructor(props: ServerlessAppProps) {
    super(props);

    const { projectName, envType } = props;
    const env: cdk.Environment = { region: "us-east-1", account: "948003242781" };

    new ServerlessStack(this, "Serverless", {
      stackName: `${projectName}`,
      description: `${projectName} serverless ${envType} stack`,
      env,
      tags: { envType: envType },
      projectName,
      envType,
    });

    new ServerlessApiStack(this, "ServerlessApi", {
      stackName: `${projectName}-api`,
      description: `${projectName} serverless api ${envType} stack`,
      env,
      tags: { envType: envType },
      projectName,
      envType,
    });
  }
}
