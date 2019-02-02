import {CardStore} from "./application/store/card-store";
import {InMemmoryCardStore} from "./infrastructure/store/inmemory-card-store";
import {StartTripCommandHander} from "./domain/start-trip-command-handler";
import {CommandBus} from "./application/command/command-bus";
import {DomainEventBus} from "./application/event/domain-event-bus";
import {CardEventListener} from "./domain/card-event-listener";

let cardStore: CardStore;
export function createCardStore(): CardStore
{
    if (cardStore) {
        return cardStore;
    }

    return cardStore = new InMemmoryCardStore();
}

let startTripCommandHandler: StartTripCommandHander;
export function createStartTripCommandHandler(): StartTripCommandHander
{
    if (startTripCommandHandler) {
        return startTripCommandHandler;
    }

    return startTripCommandHandler = new StartTripCommandHander(
        createCardStore(),
        createDomainEventBus()
    );
};

let commandBus;
export function createCommandBus(): CommandBus
{
    if (commandBus) {
        return commandBus;
    }

    return commandBus = new CommandBus();
}

let domainEventBus;
export function createDomainEventBus(): DomainEventBus
{
    if (domainEventBus) {
        return domainEventBus;
    }

    return domainEventBus = new DomainEventBus();
}

let cardEventListener;
export function createCardEventListener(): CardEventListener
{
    if (cardEventListener) {
        return cardEventListener;
    }

    return cardEventListener = new CardEventListener(createCardStore());
}

