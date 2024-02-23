import { Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

type StackConstructor<T extends cdk.Stack> = new (construct: Construct, id: string) => T

export const createTemplate = <T extends cdk.Stack>(stackConstructor: StackConstructor<T>) => {
  const app = new cdk.App()
  const stack = new stackConstructor(app, "StackUnderTest")
  return Template.fromStack(stack)
}
