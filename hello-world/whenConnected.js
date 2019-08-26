function whenConnected(amqpConn) {

    amqpConn.createChannel(function(err, channel) {
        if(err) throw err;

        var queue = 'test';
        var msg = 'hello world in to test';

        channel.assertQueue(queue, {
            durable: false
        });

        channel.sendToQueue(queue, Buffer.from(msg));
        console.log(" [x] Sent %s", msg);
        
    });

    setTimeout(function() {
        amqpConn.close();
        process.exit(0);
    }, 500);

}

module.exports = whenConnected;