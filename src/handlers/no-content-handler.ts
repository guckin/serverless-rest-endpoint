import {DeserializeErrorResult, DeserializeResult, HandlerType, Response} from '../http/http';
import {ParsedJson} from '../utilities/json';
import {successFrom} from '../utilities/result';

export const NoContentHandler: HandlerType<void, ParsedJson> = {
    deserializer,
    serializer,
    handleDeserializerError
};

function deserializer(_: string | null): DeserializeResult<void> {
    return successFrom(undefined);
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
