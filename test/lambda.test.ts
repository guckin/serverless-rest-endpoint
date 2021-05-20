import {handler} from '../src/lambda';
import {APIGatewayProxyHandler} from 'aws-lambda';
import {APIGatewayProxyEvent} from 'aws-lambda/trigger/api-gateway-proxy';
import {v4} from 'uuid';

describe('handler', () => {
    it('returns the query params and path parameters`', async () => {
        const uuid = v4();
        const params = mockHandlerParams({queryStringParameters: {'id': uuid}});

        const result = await handler(...params);

        expect(result).toEqual({statusCode: 200, body: `{"id":"${uuid}"}`});
    });
});

function mockHandlerParams(partial: Partial<APIGatewayProxyEvent> = {}): Parameters<APIGatewayProxyHandler> {
    return [
        {...partial},
        undefined,
        undefined
    ] as unknown as Parameters<APIGatewayProxyHandler>;
}


