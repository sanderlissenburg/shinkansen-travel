import {CommandHandler} from "../application/command/command-handler";
import {CardStore} from "../application/store/card-store";
import {StartTrip} from "./start-trip";
import {Card} from "./card";
import {DomainEventBus} from "../application/event/domain-event-bus";

export class StartTripCommandHander implements CommandHandler {

    constructor(
        private readonly store: CardStore,
        private readonly domainEventBus: DomainEventBus
    ) {
    }

    async handle(command: StartTrip) {

        let card = await this.store.findById(command.cardId);

        if (!card) {
            card = new Card(command.cardId);
        }

        for (let event of card.startTrip(command.stationId, new Date())) {
            this.domainEventBus.emit(event);
        }
    }
}
