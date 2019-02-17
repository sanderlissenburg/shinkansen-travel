import {DomainEvent} from "../application/event/domain-event";

export class TripCanceled implements DomainEvent {
    constructor(
        public readonly cardId: string,
        public readonly canceledAt: Date
    ) {

    }
}
