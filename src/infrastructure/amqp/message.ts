import {DomainEvent} from "../../application/event/domain-event";

export class Message {
    constructor(
        private readonly type: string,
        private readonly payload: DomainEvent
    ) {

    }
}