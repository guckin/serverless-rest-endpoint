import {handler} from '../src/lambda';
import {APIGatewayProxyHandler} from 'aws-lambda';
import {APIGatewayProxyEvent} from 'aws-lambda/trigger/api-gateway-proxy';

describe('handler', () => {
    it('handles the GET `/hello-world`', async () => {
        const params = mockHandlerParams({
            path: '/hello-world',
            httpMethod: 'GET'
        });

        const result = await handler(...params);

        expect(result).toMatchObject({statusCode: 200});
    });
});

function mockHandlerParams(partial: Partial<APIGatewayProxyEvent> = {}): Parameters<APIGatewayProxyHandler> {
    return [
        {...partial},
        undefined,
        undefined
    ] as unknown as Parameters<APIGatewayProxyHandler>;
}


