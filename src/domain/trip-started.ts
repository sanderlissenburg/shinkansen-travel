import {DomainEvent} from "../application/event/domain-event";

export class TripStarted {
    constructor(
        public readonly cardId: string,
        public readonly stationId: string,
        public readonly startedAt: Date
    ) {

    }
}
