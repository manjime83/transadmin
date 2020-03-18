#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { NotesAppStack } from '../lib/notes-app-stack';

const app = new cdk.App();
new NotesAppStack(app, 'NotesAppStack', {
    env: {
        account: '948003242781',
        region: 'us-east-1'
    }
});
