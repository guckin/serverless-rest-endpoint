import {DeserializeErrorResult, DeserializeResult, HandlerType} from '../http/http';
import {ParsedJson, parseJson} from '../utilities/json';
import {Response} from '../http/http';
import {Failure, failureFrom, isSuccess, successFrom} from '../utilities/result';

export const JsonHandler: HandlerType<ParsedJson, ParsedJson> = {
    deserializer,
    serializer,
    handleDeserializerError
};

function deserializer(body: string | null): DeserializeResult<ParsedJson> {
    if(!body) {
        return requestErrorNoBody();
    }
    const jsonParseResult = parseJson(body);
    if (!isSuccess(jsonParseResult)) {
        return requestErrorInvalidJson(body);
    }
    return successFrom(jsonParseResult.value);
}

function serializer(body: ParsedJson): string {
    return JSON.stringify(body);
}

function handleDeserializerError({errorMessage, errorValue}: DeserializeErrorResult): Response<object> {
    return {
        body: {
            errorValue,
            errorMessage
        },
        status: 400
    }
}

function requestErrorNoBody(): Failure<DeserializeErrorResult> {
    return failureFrom({
        errorValue: 'NULL',
        errorMessage: 'Bad Request'
    });
}

function requestErrorInvalidJson(errorValue: unknown): Failure<DeserializeErrorResult> {
    return failureFrom({
        errorValue,
        errorMessage: 'The request body is not valid JSON.'
    });
}
