import {StartTrip} from "./domain/start-trip";
import {
    createAmqpConnection,
    createCardEventListener, createCardMessageProducer,
    createCommandBus,
    createDomainEventBus,
    createEndTripCommandHandler,
    createMongoClient,
    createStartTripCommandHandler
} from "./services";
import {TripStarted} from "./domain/trip-started";
import {EndTrip} from "./domain/end-trip";
import {TripEnded} from "./domain/trip-ended";
import express = require("express");
import {TripCanceled} from "./domain/trip-canceled";
import {TripEndedWithoutCheckout} from "./domain/trip-ended-without-checkout";
import {CommandBus} from "./application/command/command-bus";
import {DomainEventBus} from "./application/event/domain-event-bus";
import {CardMessageProducer} from "./infrastructure/amqp/card-message-producer";

const main = async () => {
    const port: number = 3000;
    const app = express();

    await createMongoClient().catch((reason) => {
        console.log('Even after retries no connection with mongodb was possible');
        console.log(reason);
        process.exit(1);
    });

    await createAmqpConnection().catch((reason) => {
        console.log('Even after retries no connection with rabbitmq was possible');
        console.log(reason)
        process.exit(1);
    });

    const commandBus: CommandBus = createCommandBus();
    const domainEventBus: DomainEventBus = createDomainEventBus();

    domainEventBus.register(TripStarted.name, await createCardEventListener());
    domainEventBus.register(TripStarted.name, await createCardMessageProducer());

    domainEventBus.register(TripEnded.name, await createCardEventListener());
    domainEventBus.register(TripEnded.name, await createCardMessageProducer());

    domainEventBus.register(TripCanceled.name, await createCardEventListener());
    domainEventBus.register(TripCanceled.name, await createCardMessageProducer());

    domainEventBus.register(TripEndedWithoutCheckout.name, await createCardEventListener());
    domainEventBus.register(TripEndedWithoutCheckout.name, await createCardMessageProducer());

    commandBus.register(StartTrip.name, await createStartTripCommandHandler());
    commandBus.register(EndTrip.name, await createEndTripCommandHandler());

    app.get('/start-trip/:cardId/:stationId/', async (req, res) => {

        try {
            await commandBus.handle(new StartTrip(req.params.cardId, req.params.stationId));
        } catch (e) {
            res.status(409).send(e.message);
            return;
        }

        res.send(`Trip started for ${req.params.cardId} at station ${req.params.stationId}`);
    });

    app.get('/end-trip/:cardId/:stationId/', async (req, res) => {

        try {
            await commandBus.handle(new EndTrip(req.params.cardId, req.params.stationId));
        } catch (e) {
            res.status(409).send(e.message);
            return;
        }

        res.send(`Trip ended for ${req.params.cardId} at station ${req.params.stationId}`);
    });

    app.get('/foobar', (req, res) => {
       res.send('foobar to you');
    });

    app.listen(port, () => {
        console.log(`Shinkansen travel is listening on ${port}`);
    });
};

main();

