import {APIGatewayProxyHandler} from 'aws-lambda';
import {isSuccess, Result} from '../utilities/result';

export type StatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 500;

export interface Request<T> {
    body: T;
    headers: {[name: string]: string | undefined};
    query: {[name: string]: string | undefined};
    params: {[name: string]: string | undefined}
}

export interface Response<T> {
    body: T;
    status: StatusCode;
}

export type ResponseBodySerializer<T> = (body: T) => string;

export type RequestBodyDeserializer<T> = (body: string | null) => DeserializeResult<T>;

export type DeserializeResult<T> = Result<T, DeserializeErrorResult>

export interface DeserializeErrorResult {
    errorMessage: string;
    errorValue: unknown;
}

export type DeserializeErrorHandler<T> = (error: DeserializeErrorResult) => Response<T>;

export interface HandlerType<Req, Res> {
    deserializer: RequestBodyDeserializer<Req>;
    serializer: ResponseBodySerializer<Res>;
    handleDeserializerError: DeserializeErrorHandler<Res>;
}

export interface Handler<Req, Res> {
    type: HandlerType<Req, Res>;
    invoke: (request: Request<Req>) => Promise<Response<Res>>;
}

export function initHandler<Req, Res>({type, invoke}: Handler<Req, Res>): APIGatewayProxyHandler {
    return async ({body: rawRequestBody, headers, queryStringParameters, pathParameters}) => {
        const deserializerResult = type.deserializer(rawRequestBody)
        const {body: responseBody, status} = isSuccess(deserializerResult) ?
            await invoke({
                body: deserializerResult.value,
                headers,
                query: queryStringParameters ?? {},
                params: pathParameters ?? {}
            }) :
            type.handleDeserializerError(deserializerResult.error)
        return {
            body: type.serializer(responseBody),
            statusCode: status
        };
    };
}
