import {CardStore} from "./application/store/card-store";
import {InMemmoryCardStore} from "./infrastructure/store/inmemory-card-store";
import {StartTripCommandHander} from "./domain/start-trip-command-handler";
import {CommandBus} from "./application/command/command-bus";
import {DomainEventBus} from "./application/event/domain-event-bus";
import {CardEventListener} from "./domain/card-event-listener";
import {EndTripCommandHandler} from "./domain/end-trip-command-handler";
import {MongoClient} from "mongodb";
import {MongodbCardStore} from "./infrastructure/store/mongodb-card-store";

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

let mongoClient: MongoClient;
export async function createMongoClient(): Promise<MongoClient> {

    if (mongoClient) {
        return mongoClient;
    }

    mongoClient = new MongoClient('mongodb://root:example@mongo:27017',{ useNewUrlParser: true } );

    await new Promise((resolve, reject) => {
        mongoClient.connect((error, client) => {
            if (error) {
                console.log(error);
                reject();
                return;
            }

            console.log('connected');
            resolve();
        });
    });

    return mongoClient;
}

