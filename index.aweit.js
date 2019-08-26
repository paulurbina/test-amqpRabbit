const amqp = require('amqplib')
const { config } = require('./config')

var amqpConn = null;

async function start() {
    try {
        const connect = await amqp.connect(config.amqpPwd + '?heartbeat=60');
        console.log("[AMQP] connected");
        amqpConn= connect;
        WhenConnected();

    } catch (error) {
        conn.on("error", function(err) {
            if (err.message !== "Connection closing") {
              console.error("[AMQP] conn error", err.message);
            }
          });
        conn.on("close", function() {
            console.error("[AMQP] reconnecting");
            return setTimeout(start, 1000);
        });
        return setTimeout(start, 1000);
    }
}

async function WhenConnected() {
    await startPublisher();
    await startWorker();
}


var pubChannel = null;
var offlinePubQueue = [];
async function startPublisher() {
    try {
        const ch= await amqpConn.createConfirmChannel();
        pubChannel = ch;
        while(true) {
            var m = offlinePubQueue.shift();
            if (!m) break;
            await publish(m[0], m[1], m[2]);
        }
    } catch (error) {
        if (closeOnErr(err)) return;
          ch.on("error", function(err) {
            console.error("[AMQP] channel error", err.message);
            });
            ch.on("close", function() {
                console.log("[AMQP] channel closed");
              });
    }    
}


async function publish(exchange, routingKey, content) {
    try {
        pubChannel.publish(exchange, routingKey, content, { persistent: true },
                          function(err, ok) {
                            if (err) {
                              console.error("[AMQP] publish", err);
                              offlinePubQueue.push([exchange, routingKey, content]);
                              pubChannel.connection.close();
                            }
                          });
      } catch (e) {
        console.error("[AMQP] publish", e.message);
        offlinePubQueue.push([exchange, routingKey, content]);
      }
}

// A worker that acks messages only if processed succesfully
async function startWorker() {
    try {
        const channel = await amqpConn.createChannel();
        await channel.prefetch(20);
        await channel.assertQueue("test", { durable: true })
        channel.consume("test", processMsg, { noAck: false })
        console.log("Worker is started");
        async function processMsg(msg) {
           const work = await work(msg);
           if(){
               
           }
            await channel.ack(msg);
            await channel.rejec
        }

    } catch (error) {
        if (closeOnErr(err)) return;
        ch.on("error", function(err) {
        console.error("[AMQP] channel error", err.message);
        });

        ch.on("close", function() {
        console.log("[AMQP] channel closed");
        });   
    }
}
