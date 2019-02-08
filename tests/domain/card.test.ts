import {Card} from "../../src/domain/card";
import {TripStarted} from "../../src/domain/trip-started";
import {expectedDomainEvents} from "../expected-domain-events";
import {CurrentTrip} from "../../src/domain/vo/current-trip";
import {TripEnded} from "../../src/domain/trip-ended";

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

    describe('End Trip', () => {
        it('should return a TripEnded event when a trip has been started', expectedDomainEvents(
            new Card('a-card-id', new CurrentTrip(
                'a-station-id',
                date
            )).endTrip(
                    'a-station-id',
                    date
                ),
            [
                new TripEnded(
                    'a-card-id',
                    'a-station-id',
                    date
                )
            ]
        ));
    })
});
