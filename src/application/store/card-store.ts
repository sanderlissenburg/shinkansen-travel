import {Card} from "../../domain/card";

export interface CardStore {
    findById(id: string): Promise<Card|null>;
    save(card: Card);
}
