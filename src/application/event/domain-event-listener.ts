import {DomainEvent} from "./domain-event";

export interface DomainEventListener {
    handle: (event: DomainEvent) => void;
}
