import {initHandler} from './http';
import {HelloWorldHandler} from './hello-world-handler';
import {APIGatewayProxyHandler} from 'aws-lambda';

export const handler: APIGatewayProxyHandler = initHandler(HelloWorldHandler);
