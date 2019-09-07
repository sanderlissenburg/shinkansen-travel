import {CardStore} from "./application/store/card-store";
import {InMemmoryCardStore} from "./infrastructure/store/inmemory-card-store";
import {StartTripCommandHander} from "./domain/start-trip-command-handler";
import {CommandBus} from "./application/command/command-bus";
import {DomainEventBus} from "./application/event/domain-event-bus";
import {CardEventListener} from "./domain/card-event-listener";
import {EndTripCommandHandler} from "./domain/end-trip-command-handler";
import {MongoClient} from "mongodb";
import {MongodbCardStore} from "./infrastructure/store/mongodb-card-store";
import {Channel, connect, Connection} from "amqplib";
import {CardMessageProducer} from "./infrastructure/amqp/card-message-producer";
import {backoff} from "./infrastructure/async/backoff";

const params = {
    mongodb_username: process.env.MONGODB_USER,
    mongodb_password: process.env.MONGODB_PASSWORD,
    mongodb_host: process.env.MONGODB_HOST,
    mongodb_port: process.env.MONGODB_PORT,
    amqp:{
        host: 'rabbitmq',
        queue: {
            card: 'shinkansen_travel_card'
        }
    }
};

let inMemmoryCardStore: InMemmoryCardStore;
export function createInMemmoryCardStore(): InMemmoryCardStore
{
    if (inMemmoryCardStore) {
        return inMemmoryCardStore;
    }

    return inMemmoryCardStore = new InMemmoryCardStore();
}

let mongodbCardStore: MongodbCardStore;
export async function createMongodbCardStore(): Promise<MongodbCardStore>
{
    if (mongodbCardStore) {
        return mongodbCardStore;
    }

    const mongoClient = await createMongoClient();

    return mongodbCardStore = new MongodbCardStore(mongoClient, 'shinkansen-travel', 'card');
}

export function createCardStore(): Promise<CardStore>
{
    return createMongodbCardStore();
}

let startTripCommandHandler: StartTripCommandHander;
export async function createStartTripCommandHandler(): Promise<StartTripCommandHander>
{
    if (startTripCommandHandler) {
        return startTripCommandHandler;
    }

    return startTripCommandHandler = new StartTripCommandHander(
        await createCardStore(),
        createDomainEventBus()
    );
}

let endTripCommandHandler: EndTripCommandHandler;
export async function createEndTripCommandHandler(): Promise<EndTripCommandHandler>
{
    if (endTripCommandHandler) {
        return endTripCommandHandler;
    }

    return endTripCommandHandler = new EndTripCommandHandler(
        await createCardStore(),
        createDomainEventBus()
    );
}

let commandBus: CommandBus;
export function createCommandBus(): CommandBus
{
    if (commandBus) {
        return commandBus;
    }

    return commandBus = new CommandBus();
}

let domainEventBus: DomainEventBus;
export function createDomainEventBus(): DomainEventBus
{
    if (domainEventBus) {
        return domainEventBus;
    }

    return domainEventBus = new DomainEventBus();
}

let cardEventListener: CardEventListener;
export async function createCardEventListener(): Promise<CardEventListener>
{
    if (cardEventListener) {
        return cardEventListener;
    }

    return cardEventListener = new CardEventListener(await createCardStore());
}

let cardMessageProducer: CardMessageProducer;
export async function createCardMessageProducer(): Promise<CardMessageProducer>
{
    if (cardMessageProducer) {
        return cardMessageProducer;
    }

    cardMessageProducer = new CardMessageProducer(params.amqp.queue.card, await createAmqpChannel());

    return cardMessageProducer;
}

let mongoClient: MongoClient;
export async function createMongoClient(): Promise<MongoClient> {
    if (mongoClient) {
        return mongoClient;
    }

    const tryToConnect = () => {
        console.log('Trying to connect to mongodb');

        const url = `mongodb://${params.mongodb_username}:${params.mongodb_password}@${params.mongodb_host}:${params.mongodb_port}`;
        const client = new MongoClient(url,{ useNewUrlParser: true } );

        return new Promise((resolve, reject) => {
            client.connect((error, client) => {
                if (error) {
                    console.log('Could not connect to mongodb');
                    reject(error);
                    return;
                }
                console.log('Connected to mongodb');

                resolve(client);
            });
        });
    };

    mongoClient = await backoff(5, tryToConnect, 1000);

    return mongoClient;
}

let amqpConnection: Connection;
export async function createAmqpConnection(): Promise<Connection> {
    if (amqpConnection) {
        return amqpConnection;
    }

    const tryToConnect = () => {
        console.log('Trying to connect to amqp');
        return connect(`amqp://${params.amqp.host}`);
    };

    amqpConnection = await backoff(5, tryToConnect, 1000);

    console.log('Connected to amqp');

    amqpConnection.on('close', () => {
        console.log('Amqp connection closed');
    });

    return amqpConnection;
}

let amqpChannel: Channel;
export async function createAmqpChannel (): Promise<Channel>
{
    const connection: Connection = await createAmqpConnection();
    amqpChannel = await connection.createChannel();

    return amqpChannel
}


