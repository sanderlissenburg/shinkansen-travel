import {Card} from "../../domain/card";
import {CardStore} from "../../application/store/card-store";

export class InMemmoryCardStore implements CardStore {
    private cards: {[id: string]: Card } = {};

    public findById(id: string): Card|null {
        if (id in this.cards) {
            return this.cards[id];
        }

        return null;
    }

    save(card: Card): void {
        this.cards[card.cardId] = card;
        console.log('saved');
        console.log(this.cards);
    }
}
