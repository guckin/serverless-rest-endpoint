import {initHandler} from './http/http';
import {NoContentHandler} from './handlers/no-content-handler';

export const handler = initHandler({
    type: NoContentHandler,
    invoke: async ({query}) => ({
        body: {id: query.id},
        status: 200
    })
});
