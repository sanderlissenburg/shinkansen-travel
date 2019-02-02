import {DomainEventListener} from "./domain-event-listener";
import {DomainEvent} from "./domain-event";

export class DomainEventBus {

    private listeners: {[event: string]: DomainEventListener[]} = {};

    emit(event: DomainEvent): void
    {
        if (event.constructor.name in this.listeners) {
            for (let listener of this.listeners[event.constructor.name]) {
                listener.handle(event);
            }
        }
    }

    register(event: string, listener: DomainEventListener): void
    {
        if (!(event in this.listeners)) {
            this.listeners[event] = [];
        }

        this.listeners[event].push(listener);
    }
}
