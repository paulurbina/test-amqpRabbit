require('dotenv').config()

const config = {
    amqpUrl : process.env.AMQP_URL,
    amqpKey : process.env.CLOUDAMQP_KEY,
    hostLoad : process.env.HOST_LOAD,
    host : process.env.HOST,
    userVhost : process.env.USER_VHOST,
    amqpPort : process.env.PORT,
    amqpPwd : process.env.AMQP_PASSWORD
}

module.exports = { config }