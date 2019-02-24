import {StartTrip} from "./domain/start-trip";
import {
    createCardEventListener,
    createCommandBus,
    createDomainEventBus, createEndTripCommandHandler,
    createStartTripCommandHandler
} from "./services";
import {TripStarted} from "./domain/trip-started";
import {EndTrip} from "./domain/end-trip";
import {TripEnded} from "./domain/trip-ended";
import express = require("express");
import {TripCanceled} from "./domain/trip-canceled";
import {TripEndedWithoutCheckout} from "./domain/trip-ended-without-checkout";

const port: number = 3000;
const app = express();

const commandBus = createCommandBus();
const domainEventBus = createDomainEventBus();

domainEventBus.register(TripStarted.name, createCardEventListener());
domainEventBus.register(TripEnded.name, createCardEventListener());
domainEventBus.register(TripCanceled.name, createCardEventListener());
domainEventBus.register(TripEndedWithoutCheckout.name, createCardEventListener());

commandBus.register(StartTrip.name, createStartTripCommandHandler());
commandBus.register(EndTrip.name, createEndTripCommandHandler());

app.get('/start-trip/:cardId/:stationId/', (req, res) => {

    try {
        commandBus.handle(new StartTrip(req.params.cardId, req.params.stationId));
    } catch (e) {
        res.status(409).send(e.message);
        return;
    }


    res.send(`Trip started for ${req.params.cardId} at station ${req.params.stationId}`);
});

app.get('/end-trip/:cardId/:stationId/', (req, res) => {

    try {
        commandBus.handle(new EndTrip(req.params.cardId, req.params.stationId));
    } catch (e) {
        res.status(409).send(e.message);
        return;
    }

    res.send(`Trip ended for ${req.params.cardId} at station ${req.params.stationId}`);
});


app.listen(port, () => {
    console.log(`Shinkansen travel is listening on ${port}`);
});