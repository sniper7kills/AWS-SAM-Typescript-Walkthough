import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';

import { myCustomFunction } from 'layer'

export const handler = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback): void => {
    console.log(`Event: ${JSON.stringify(event, null, 2)}`);
    console.log(`Context: ${JSON.stringify(context, null, 2)}`);
    myCustomFunction()
    callback(null, {
        statusCode: 200,
        body: JSON.stringify({
            message: 'hello world',
        }),
    });
};