import {CommandHandler} from "../application/command/command-handler";
import {EndTrip} from "./end-trip";
import {CardStore} from "../application/store/card-store";
import {DomainEventBus} from "../application/event/domain-event-bus";
import {Card} from "./card";

export class EndTripCommandHandler implements CommandHandler {

    constructor(
        private readonly store: CardStore,
        private readonly domainEventBus: DomainEventBus
    ) {
    }

    async handle(command: EndTrip) {

        let card = await this.store.findById(command.cardId);

        if (!card) {
            card = new Card(command.cardId);
        }

        for (let event of card.endTrip(command.stationId, new Date())) {
            this.domainEventBus.emit(event);
        }
    }
}