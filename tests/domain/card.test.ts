import {Card} from "../../src/domain/card";
import {TripStarted} from "../../src/domain/trip-started";
import {expectedDomainEvents} from "../expected-domain-events";
import {CurrentTrip} from "../../src/domain/vo/current-trip";
import {TripEnded} from "../../src/domain/trip-ended";
import {expect} from "chai";
import {TripEndedWithoutCheckout} from "../../src/domain/trip-ended-without-checkout";

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

        it('should throw an Exception when the card is already checked in at the given station', () => {
            expect(expectedDomainEvents(
                new Card(
                    'a-card-id',
                    new CurrentTrip('a-station-id', date)
                ).startTrip(
                    'a-station-id',
                    date
                ),
                []
            )).to.throw(Error, 'Trip already started from this station')
        });

        it('should return both a TripStarted and a TripEndedWithoutCheckout event when a current trip is in progress', expectedDomainEvents(
            new Card(
                'a-card-id',
                new CurrentTrip('a-station-id', date)
            ).startTrip(
                'an-other-station-id',
                date
            ),
            [
                new TripEndedWithoutCheckout('a-card-id', date, 'new trip started at other station with station id: an-other-station-id'),
                new TripStarted('a-card-id', 'an-other-station-id', date)
            ]
        ))
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
