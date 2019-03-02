import {Card} from "../../domain/card";
import {CardStore} from "../../application/store/card-store";

export class InMemmoryCardStore implements CardStore {
    private cards: {[id: string]: Card } = {};

    async findById(id: string): Promise<Card|null> {
        if (id in this.cards) {
            return this.cards[id];
        }

        return null;
    }

    save(card: Card): void {
        this.cards[card.cardId] = card;
    }
}
