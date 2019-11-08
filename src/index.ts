import express = require("express");
import {param, validationResult} from "express-validator";
import {
    createAmqpConnection,
    createCardEventListener, createCardMessageProducer,
    createCommandBus,
    createDomainEventBus,
    createEndTripCommandHandler,
    createMongoClient,
    createStartTripCommandHandler
} from "./services";
import {StartTrip} from "./domain/start-trip";
import {TripStarted} from "./domain/trip-started";
import {EndTrip} from "./domain/end-trip";
import {TripEnded} from "./domain/trip-ended";
import {TripCanceled} from "./domain/trip-canceled";
import {TripEndedWithoutCheckout} from "./domain/trip-ended-without-checkout";
import {CommandBus} from "./application/command/command-bus";
import {DomainEventBus} from "./application/event/domain-event-bus";
import {Request, Response} from "express";

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

    const validation = [
        param('cardId', 'must be an uuid v5').isUUID(4),
        param('stationId', 'must be an uuid v5').isUUID(4),
    ];

    app.put('/start-trip/:cardId/:stationId/', validation, async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        try {
            await commandBus.handle(new StartTrip(req.params.cardId, req.params.stationId));
        } catch (e) {
            res.status(409).json({
                msg: e.message
            });
            return;
        }

        res.json({
            msg: `Trip started for ${req.params.cardId} at station ${req.params.stationId}`
        });
    });

    app.put('/end-trip/:cardId/:stationId/', validation, async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }
        try {
            await commandBus.handle(new EndTrip(req.params.cardId, req.params.stationId));
        } catch (e) {
            res.status(409).json({
                msg: e.message
            });
            return;
        }

        res.json( {
            msg: `Trip ended for ${req.params.cardId} at station ${req.params.stationId}`
        });
    });

    app.get('/foobar', (req: Request, res: Response) => {
       res.send('He foobar');
    });

    app.listen(port, () => {
        console.log(`Shinkansen travel is listening on ${port}`);
    });
};

main();

