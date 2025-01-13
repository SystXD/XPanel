"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRabbit = connectRabbit;
exports.subscribeToQueue = subscribeToQueue;
const amqplib_1 = require("amqplib");
let connection;
let channel;
async function connectRabbit() {
    connection = await (0, amqplib_1.connect)("amqp://localhost");
    channel = await connection.createChannel();
    return {
        connection,
        channel,
    };
}
function subscribeToQueue(queueName, callback) {
    if (!channel)
        connectRabbit().then((keys) => {
            try {
                keys.channel.assertQueue(queueName);
                keys.channel.consume(queueName, (msg) => {
                    callback(null, msg);
                    channel?.ack(msg);
                });
            }
            catch (error) {
                callback(error, null);
            }
        });
}
