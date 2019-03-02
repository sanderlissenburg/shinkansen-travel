import {CardStore} from "../../application/store/card-store";
import {Card} from "../../domain/card";
import {MongoClient} from "mongodb";
import {Deserialize, Serialize} from "cerialize";

export class MongodbCardStore implements CardStore {

    constructor(
        private readonly client: MongoClient,
        private readonly db: string,
        private readonly collection: string
    ) {

    }

    async findById(id: string): Promise<Card | null> {
        //@TODO use yield and cursor
        let result = await this.client
            .db(this.db)
            .collection(this.collection)
            .find({card_id: id})
            .limit(1)
            .toArray();

        if (!result[0]) {
            return null;
        }

        return Deserialize(result[0], Card);
    }

    async save(card: Card) {
        await this.client
            .db(this.db)
            .collection(this.collection)
            .updateOne({card_id: card.cardId}, { $set: Serialize(card) }, {upsert: true});
    }s
}