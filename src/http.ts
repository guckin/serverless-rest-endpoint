import {APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda';

export const Verb = {
    POST: 'POST',
    GET: 'GET'
} as const;
export type Verb = typeof Verb[keyof typeof Verb];

export type Route = `/${string}`;

export interface Response<Body> {
    body: Body;
    status: 200 | 201 | 400 | 500 | 403;
}

export type MaybePromise<T> = Promise<T> | T;

export interface Handler<ResponseBody> {
    verb: Verb;
    route: Route;
    invoke(): MaybePromise<Response<ResponseBody>>;
}

function serializeResponse<ResponseBody>({body, status}: Response<ResponseBody>): APIGatewayProxyResult {
    return {
        body: JSON.stringify(body),
        statusCode: status
    };
}

export function initHandler(...handlers: Handler<unknown>[]): APIGatewayProxyHandler {
    return async event => {
        const handler = handlers.find(handler => handler.route === event.path && handler.verb === event.httpMethod);
        return handler ? serializeResponse(await handler.invoke()) : {statusCode: 404, body: 'Not Found'}
    }
}
