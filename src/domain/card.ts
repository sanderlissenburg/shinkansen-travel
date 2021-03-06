import {TripStarted} from "./trip-started";
import {DomainEvent} from "../application/event/domain-event";
import {autoserializeAs} from 'cerialize';
import {CurrentTrip} from "./vo/current-trip";
import {TripEnded} from "./trip-ended";
import {TripEndedWithoutCheckout} from "./trip-ended-without-checkout";
import {DateTime} from "luxon";
import {TripCanceled} from "./trip-canceled";

export class Card {

    @autoserializeAs('card_id')
    public readonly cardId: string;

    @autoserializeAs(CurrentTrip, 'current_trip')
    private readonly currentTrip: CurrentTrip|null;
    
    constructor(
        cardId: string,
        currentTrip: CurrentTrip|null = null
    ) {
        this.cardId = cardId;
        this.currentTrip = currentTrip;
    }

    public * startTrip (stationId: string, startedAt: Date): IterableIterator<DomainEvent>
    {
        // // If a trip is in progress and the station is the same as current trip start station, card already checked in.
        if (this.currentTrip && this.currentTrip.startStationId == stationId) {
            throw new Error('Trip already started from this station');
        }

        // If a trip is in progress and the station is not the same as the current trip's start station end the previous trip first
        if (this.currentTrip) {
            yield new TripEndedWithoutCheckout(this.cardId, startedAt, `new trip started at other station with station id: ${stationId}`);
        }


        yield new TripStarted(this.cardId, stationId, startedAt);
    }

    public * endTrip(stationId: string, endedAt: Date): IterableIterator<DomainEvent>
    {
        if (!this.currentTrip) {
            throw new Error('No trip in progress');
        }

        let toCheck = DateTime.fromJSDate(endedAt).minus({minutes: 10}).toJSDate();

        if (stationId == this.currentTrip.startStationId && toCheck < this.currentTrip.startedAt) {
            yield new TripCanceled(this.cardId, endedAt);
            return;
        }

        yield new TripEnded(this.cardId, stationId, endedAt)
    }

    public whenTripStarted(event: TripStarted): Card
    {
        return new Card(
            this.cardId,
            new CurrentTrip(
                event.stationId,
                event.startedAt
            )
        );
    }

    public whenTripEnded(event: TripEnded): Card
    {
        return new Card(
            this.cardId,
            null
        )
    }

    public whenTripCanceled(event: TripCanceled): Card
    {
        return new Card(
            this.cardId,
            null
        )
    }

    public whenTripEndedWithoutCheckout(event: TripEndedWithoutCheckout): Card
    {
        return new Card(
            this.cardId,
            null
        )
    }
}
