import {DomainEventListener} from "../application/event/domain-event-listener";
import {CardStore} from "../application/store/card-store";
import {DomainEvent} from "../application/event/domain-event";
import {TripStarted} from "./trip-started";
import {Card} from "./card";
import {TripEnded} from "./trip-ended";
import {TripCanceled} from "./trip-canceled";
import {TripEndedWithoutCheckout} from "./trip-ended-without-checkout";

export class CardEventListener implements DomainEventListener {
    constructor(private readonly cardStore: CardStore) {
    }

    handle(event: DomainEvent): void {
        this['handle' + event.constructor.name](event);
    };

    async handleTripStarted(event: TripStarted) {
        let card:Card = await this.getCardById(event.cardId);

        card = card.whenTripStarted(event);

        this.cardStore.save(card);
    }

    async handleTripEnded(event: TripEnded) {
        let card:Card = await this.getCardById(event.cardId);

        card = card.whenTripEnded(event);

        this.cardStore.save(card);
    }

    async handleTripCanceled(event: TripCanceled) {
        let card:Card = await this.getCardById(event.cardId);

        card = card.whenTripCanceled(event);

        this.cardStore.save(card);
    }

    async handleTripEndedWithoutCheckout(event: TripEndedWithoutCheckout) {
        let card:Card = await this.getCardById(event.cardId);

        card = card.whenTripEndedWithoutCheckout(event);

        this.cardStore.save(card);
    }

    private async getCardById(id: string): Promise<Card>
    {
        let card = await this.cardStore.findById(id);

        if (!card) {
            card = new Card(id);
        }

        return card;
    }
}
