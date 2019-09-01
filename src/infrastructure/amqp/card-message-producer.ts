import {DomainEventListener} from "../../application/event/domain-event-listener";
import {DomainEvent} from "../../application/event/domain-event";
import {Channel, Options} from "amqplib";
import {Message} from "./message";

export class CardMessageProducer implements DomainEventListener {

    constructor(
        private readonly queue: string,
        private readonly amqpChannel: Channel
    ) {

    }

    handle(event: DomainEvent) : void
    {
        this.amqpChannel.assertQueue(this.queue, {
            durable: false
        }).then(() => {
            const content: Buffer =  Buffer.from(
                JSON.stringify(new Message(
                    event.constructor.name, event
                ))
            );
            this.amqpChannel.sendToQueue(this.queue, content)
        });
    }
}