export class TripEndedWithoutCheckout {
    constructor(
        public readonly cardId: string,
        public readonly endedAt: Date,
        public readonly reason: string
    ) {

    }
}