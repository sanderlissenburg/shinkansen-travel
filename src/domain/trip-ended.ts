import {DomainEvent} from "../application/event/domain-event";

export class TripEnded implements DomainEvent {
    constructor(
        public readonly cardId: string,
        public readonly stationId: string,
        public readonly endedAt: Date
    ) {

    }
}
