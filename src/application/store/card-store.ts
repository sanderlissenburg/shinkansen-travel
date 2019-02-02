import {Card} from "../../domain/card";

export interface CardStore {
    findById(id: string): Card|null;
    save(card: Card): void;
}
