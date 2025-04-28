import amqp from 'amqplib'


export const connectToRabbitMQ = async() => {
    try{
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'appointments'
        await channel.assertQueue(queue, {durable: true})
        return {connection, channel}
    } catch (error){
        throw error
    }
}