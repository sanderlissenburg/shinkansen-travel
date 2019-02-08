import {DomainEventListener} from "../application/event/domain-event-listener";
import {CardStore} from "../application/store/card-store";
import {DomainEvent} from "../application/event/domain-event";
import {TripStarted} from "./trip-started";
import {Card} from "./card";
import {TripEnded} from "./trip-ended";

export class CardEventListener implements DomainEventListener {
    constructor(private readonly cardStore: CardStore) {
    }

    handle(event: DomainEvent): void {
        this['handle' + event.constructor.name](event);
    };

    handleTripStarted(event: TripStarted) {
        let card = this.cardStore.findById(event.cardId);

        if (!card) {
            card = new Card(event.cardId);
        }

        card = card.whenTripStarted(event);

        this.cardStore.save(card);
    }

    handleTripEnded(event: TripEnded) {
        let card = this.cardStore.findById(event.cardId);

        if (!card) {
            card = new Card(event.cardId);
        }

        card = card.whenTripEnded(event);

        this.cardStore.save(card);
    }
}
