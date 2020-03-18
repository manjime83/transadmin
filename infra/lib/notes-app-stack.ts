import { Stack, Construct, StackProps, RemovalPolicy } from '@aws-cdk/core';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';
import { Bucket, HttpMethods, BlockPublicAccess } from '@aws-cdk/aws-s3';
import { UserPool, UserPoolClient, AuthFlow, CfnUserPoolDomain } from '@aws-cdk/aws-cognito';
import { LambdaRestApi, RestApi } from '@aws-cdk/aws-apigateway';
import { Runtime } from '@aws-cdk/aws-lambda';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';

export class NotesAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new Table(this, 'Table', {
      partitionKey: { name: 'userId', type: AttributeType.STRING },
      sortKey: { name: 'noteId', type: AttributeType.STRING },
      // billingMode: BillingMode.PAY_PER_REQUEST,
      tableName: 'notes',
      removalPolicy: RemovalPolicy.DESTROY
    });

    const bucket = new Bucket(this, 'Bucket', {
      bucketName: 'notes-app-mfjimene',
      cors: [{
        allowedHeaders: ['*'],
        allowedMethods: [HttpMethods.GET, HttpMethods.PUT, HttpMethods.POST, HttpMethods.HEAD, HttpMethods.DELETE],
        allowedOrigins: ['*'],
        maxAge: 3000
      },
      ],
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY
    });

    const userPool = new UserPool(this, 'UserPool', {
      userPoolName: 'notes-app-user-pool',
      signInAliases: {
        email: true,
      }
    });

    const userPoolClient = new UserPoolClient(this, 'UserPoolClient', {
      userPool,
      userPoolClientName: 'notes-app',
      generateSecret: false,
      enabledAuthFlows: [AuthFlow.ADMIN_NO_SRP]
    });

    const userPoolDomain = new CfnUserPoolDomain(this, 'UserPoolDomain', {
      userPoolId: userPool.userPoolId,
      domain: 'notes-app'
    });


  }
}
