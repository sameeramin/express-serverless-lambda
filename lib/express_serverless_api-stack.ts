import {
  Stack,
  StackProps,
  Duration,
  aws_lambda as lambda,
  aws_iam as iam,
  aws_apigateway as apigateway,
} from 'aws-cdk-lib';

import { Construct } from 'constructs';
import * as path from 'path';
import * as cdk from 'aws-cdk-lib';

var CLOUDWATCH_POLICY = "CloudWatchFullAccess";

export class ExpressServerlessApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create a lambda layer
    const layer = new lambda.LayerVersion(this, 'WebHealthlayer', {
      code: lambda.Code.fromAsset(path.join("./", "layers")),
      compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // Express API Lambda initialization
    const EALambda = this.createLambda(
      this,
      "ExpressAPILambda",
      "resources",
      "ApiLambda.handler",
      this.createRole(
        this,
        "ExpressAPILambdaRole",
        CLOUDWATCH_POLICY
      ),
      [layer]
    );
    // Apply removal policy to lambda function to Destroy it when stack is deleted
    EALambda.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    // Create an API Gateway for Express API Lambda
    const api = new apigateway.LambdaRestApi(this, "ExpressAPISameer", {
      handler: EALambda
    });
    // Apply removal policy to API Gateway to Destroy it when stack is deleted.
    api.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

  }

  // A function to create lambda function.
  createLambda(self: any, id: string, asset: string, handler: string, role: any, layers: any) {
    const lambdaFunction = new lambda.Function(self, id, {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(asset),
      handler: handler,
      role: role,
      layers: layers,
      timeout: Duration.seconds(60)
    }
    );
    return lambdaFunction;
  }

  // A function to create IAM role.
  createRole(self: any, id: string, policyName: any) {
    const role = new iam.Role(self, id, {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com")
    });
    role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"));
    role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName(policyName));
    return role;
  }

}
