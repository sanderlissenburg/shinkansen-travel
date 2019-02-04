import {TripStarted} from "./trip-started";
import {DomainEvent} from "../application/event/domain-event";
import {autoserializeAs} from 'cerialize';
import {CurrentTrip} from "./vo/current-trip";

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

    public * startTrip (stationId: string): IterableIterator<DomainEvent>
    {
        // // If a trip is in progress and the station is the same as current trip start station, card already checked in.
        // if (this.currentTrip && this.currentTrip.startStationId == stationId) {
        //     throw new Error('Trip already started');
        // }
        //
        // // If a trip is in progress and the station is not the same as the current trip's start station end the previous trip first
        // if (this.currentTrip) {
        //     yield new TripEndedWithOutCheckoutEvent(this.cardId, new Date());
        // }
        //

        yield new TripStarted(this.cardId, stationId, new Date());
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
}
