import {autoserializeAs} from "cerialize";

export class CurrentTrip {
    @autoserializeAs('start_station_id')
    public readonly startStationId: string;

    @autoserializeAs(Date, 'started_at')
    public readonly startedAt: Date;

    constructor(startStationId: string, startedAt: Date) {
        this.startStationId = startStationId;
        this.startedAt = startedAt;
    }
}
