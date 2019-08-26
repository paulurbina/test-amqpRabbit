var amqp = require('amqplib');
let { config } = require('../config')

async function received () {
    try {
        const connection = await amqp.connect(config.amqpUrl);
        const channel = await connection.createChannel();
        let queue = 'test';
        await channel.assertQueue(queue,{
            durable:false
        })
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, function (msg) {
            console.log(" [x] Received %s", msg.content.toString());
        }, { noAck: true});
        
    } catch (error) {
        throw error;
    }
    
}

received();