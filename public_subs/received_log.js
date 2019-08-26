const { config } = require('../config');
const amqp = require('amqplib');
const util = require('util');
const sleep = util.promisify(setTimeout);

( async function (){
    try {
        const connect = await amqp.connect(config.amqpUrl);
        const channel = await connect.createChannel()
        let exchange = 'logs';
        await channel.assertExchange(exchange, 'fanout', { durable: false });
        const q = await channel.assertQueue('', { exclusive: true }, { noAck: true })
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue)
        await channel.bindQueue(q.queue, exchange, '')
        const msg = await channel.consume(q.queue);
        if(msg.content) {
            console.log(" [x] ", msg.content.toString());
        }
    } catch (error) {
        throw error;
    }    
})();