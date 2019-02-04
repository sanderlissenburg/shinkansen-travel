import {Card} from "../../src/domain/card";
import {TripStarted} from "../../src/domain/trip-started";
import {expectedDomainEvents} from "../expected-domain-events";

const date = new Date();

describe('Card', () => {
    describe('Start Trip', () => {
        it('should return a TripStarted event when no trip has been started yet', expectedDomainEvents(
            new Card('a-card-id').startTrip(
                'a-station-id',
                date
            ),
            [
                new TripStarted('a-card-id', 'a-station-id', date)
            ]
        ));
    });
});
