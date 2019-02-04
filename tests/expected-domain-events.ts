import {DomainEvent} from "../src/application/event/domain-event";
import * as assert from "assert";

export function expectedDomainEvents(actual: IterableIterator<DomainEvent>, expected: Array<DomainEvent>) {
    return () => {
        return assert.deepStrictEqual(Array.from(actual), expected);
    }
}
