import {Command} from "../application/command/command";

export class StartTrip implements Command {
    constructor(
        public readonly cardId: string,
        public readonly stationId: string
    ) {
    }
}
