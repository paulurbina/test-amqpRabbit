const { config } = require('../config');
const amqp = require('amqplib');
const util = require('util');
const sleep = util.promisify(setTimeout);

(async function() {
    try {
        const connect = await amqp.connect(config.amqpUrl);
        const channel = await connect.createChannel();
        let exchange = 'logs'
        let msg = process.argv.slice(2).join(' ') || 'hello world'
        
        await channel.assertExchange(exchange, 'fanout', { durable: false });
        await channel.publish(exchange, '', Buffer.from(msg));
        console.log(" [x] Send ", msg);
        
        await sleep(connect.close(), process.exit(), 500);

    } catch (error) {
        throw error;
    }
})();
