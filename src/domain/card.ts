import {TripStarted} from "./trip-started";
import {DomainEvent} from "../application/event/domain-event";
import {autoserializeAs} from 'cerialize';
import {CurrentTrip} from "./vo/current-trip";
import {TripEnded} from "./trip-ended";
import {TripEndedWithoutCheckout} from "./trip-ended-without-checkout";

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

    public * endTrip(stationId: string, endedAt: Date)
    {
        // if (stationId == this.currentTrip.startStationId && 'now - 10 min' <= 'start date current trip') {
        //     yield new TripCanceled(this.cardId, endedAt);
        // }

        yield new TripEnded(this.cardId, stationId, endedAt)
    }

    public whenTripStarted(event: TripStarted) {
        return new Card(
            this.cardId,
            new CurrentTrip(
                event.stationId,
                event.startedAt
            )
        );
    }

    public whenTripEnded(event: TripEnded) {
        return new Card(
            this.cardId,
            null
        )
    }
}
