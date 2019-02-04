import {StartTrip} from "./domain/start-trip";
import {
    createCardEventListener,
    createCardStore,
    createCommandBus,
    createDomainEventBus,
    createStartTripCommandHandler
} from "./services";
import {TripStarted} from "./domain/trip-started";
import {Card} from "./domain/card";
import {Deserialize, Serialize} from "cerialize";


const commandBus = createCommandBus();
const domainEventBus = createDomainEventBus();

domainEventBus.register(TripStarted.name, createCardEventListener());
commandBus.register(StartTrip.name, createStartTripCommandHandler());

commandBus.handle(new StartTrip('abc123', 'xyz'));
commandBus.handle(new StartTrip('abc123', 'abc'));
commandBus.handle(new StartTrip('xyz123', 'abc'));
commandBus.handle(new StartTrip('xyz123', 'klm'));

const cardStore = createCardStore();

console.log(cardStore.findById('abc123'));
console.log(cardStore.findById('xyz123'));

console.log(
    Deserialize(Serialize(cardStore.findById('abc123')), Card)
);
