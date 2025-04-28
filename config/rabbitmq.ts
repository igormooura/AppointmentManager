import amqp from 'amqplib'


export const connectToRabbitMQ = async() => {
    try{
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const notificationQueue = 'notifications'
        await channel.assertQueue(notificationQueue, {durable: true})
        return {connection, channel}
    } catch (error){
        throw error
    }
}