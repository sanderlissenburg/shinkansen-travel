import {StartTrip} from "./domain/start-trip";
import {
    createCardEventListener,
    createCommandBus,
    createDomainEventBus, createEndTripCommandHandler, createMongoClient,
    createStartTripCommandHandler
} from "./services";
import {TripStarted} from "./domain/trip-started";
import {EndTrip} from "./domain/end-trip";
import {TripEnded} from "./domain/trip-ended";
import express = require("express");
import {TripCanceled} from "./domain/trip-canceled";
import {TripEndedWithoutCheckout} from "./domain/trip-ended-without-checkout";

const main = async () => {
    const port: number = 3000;
    const app = express();

    const commandBus = createCommandBus();
    const domainEventBus = createDomainEventBus();

    domainEventBus.register(TripStarted.name, await createCardEventListener());
    domainEventBus.register(TripEnded.name, await createCardEventListener());
    domainEventBus.register(TripCanceled.name, await createCardEventListener());
    domainEventBus.register(TripEndedWithoutCheckout.name, await createCardEventListener());

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
       res.send('foobar to you and me!');
    });

    app.listen(port, () => {
        console.log(`Shinkansen travel is listening on ${port}`);
    });
};

main();

