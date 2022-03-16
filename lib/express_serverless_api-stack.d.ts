import { Stack, StackProps, aws_lambda as lambda, aws_iam as iam } from 'aws-cdk-lib';
import { Construct } from 'constructs';
export declare class ExpressServerlessApiStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps);
    createLambda(self: any, id: string, asset: string, handler: string, role: any, layers: any): lambda.Function;
    createRole(self: any, id: string, policyName: any): iam.Role;
}
