import {Handler} from './http';

export const HelloWorldHandler: Handler<{hello: 'world!'}> = {
    verb: 'GET',
    route: '/hello-world',
    invoke: () => {
        return {
            status: 200,
            body: {
                hello: 'world!'
            }
        }
    }
};
