var amqp = require('amqplib');
const { config } = require('../config');

async function init() {
    try {
        const connection = await amqp.connect(config.amqpUrl);
        
        const channel = await connection.createChannel();
        let queue = 'test';
        let msg = 'hello world';

        await channel.assertQueue(queue, {
            durable: false
        });

        await channel.sendToQueue(queue, Buffer.from(msg))
        console.log(" [x] Send ", msg);

        setTimeout(function() {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (error) {
        throw error
    }

}

init();
