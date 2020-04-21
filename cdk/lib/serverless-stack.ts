import * as cdk from "@aws-cdk/core";
import * as route53 from "@aws-cdk/aws-route53";
import * as certmgr from "@aws-cdk/aws-certificatemanager";
import * as cognito from "@aws-cdk/aws-cognito";
import * as cr from "@aws-cdk/custom-resources";

interface ServerlessProps extends cdk.StackProps {
  projectName: string;
  envType: string;
}

export class ServerlessStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ServerlessProps) {
    super(scope, id, props);

    const { projectName, envType } = props;

    const domainName = (envType === "prod" ? "" : `${envType}.`).concat(`${projectName}.co`);

    let hostedZone: route53.IHostedZone;

    if (envType === "prod") {
      hostedZone = route53.HostedZone.fromLookup(this, "HostedZone", {
        domainName,
        privateZone: false,
      });
    } else {
      hostedZone = new route53.PublicHostedZone(this, "HostedZone", {
        zoneName: domainName,
      });

      const rootHostedZone = route53.HostedZone.fromLookup(this, "RootHostedZone", {
        domainName: `${projectName}.co`,
        privateZone: false,
      });

      new route53.ZoneDelegationRecord(this, "RecordSet", {
        zone: rootHostedZone,
        recordName: domainName,
        nameServers: hostedZone.hostedZoneNameServers!,
      });
    }

    const authCertificate = new certmgr.DnsValidatedCertificate(this, "Auth", {
      domainName: `auth.${hostedZone.zoneName}`,
      hostedZone,
    });

    new certmgr.DnsValidatedCertificate(this, "Api", {
      domainName: `api.${hostedZone.zoneName}`,
      hostedZone,
    });

    const userPool = new cognito.UserPool(this, "UserPool", {
      userPoolName: `${projectName}-${envType}-users`,
      selfSignUpEnabled: true,
      signInAliases: { username: false, email: true },
      autoVerify: { email: true, phone: false },
      passwordPolicy: {
        minLength: 8,
        tempPasswordValidity: cdk.Duration.days(7),
      },
    });

    const userPoolDomain = new cognito.CfnUserPoolDomain(this, "UserPoolDomain", {
      domain: `auth.${hostedZone.zoneName}`,
      userPoolId: userPool.userPoolId,
      customDomainConfig: { certificateArn: authCertificate.certificateArn },
    });

    const describeCognitoUserPoolDomain = new cr.AwsCustomResource(this, "DescribeCognitoUserPoolDomain", {
      resourceType: "Custom::DescribeCognitoUserPoolDomain",
      onCreate: {
        service: "CognitoIdentityServiceProvider",
        action: "describeUserPoolDomain",
        parameters: {
          Domain: userPoolDomain.domain,
        },
        physicalResourceId: cr.PhysicalResourceId.of(userPoolDomain.domain),
      },
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
        resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

    new cognito.UserPoolClient(this, "UserPoolClient", {
      userPool,
      userPoolClientName: `${projectName}-client`,
      generateSecret: false,
      enabledAuthFlows: [cognito.AuthFlow.USER_PASSWORD],
    });
  }
}
