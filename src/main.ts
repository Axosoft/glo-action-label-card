import * as core from '@actions/core';
import GloSDK from '@axosoft/glo-sdk';

interface ICard {
  boardId: string;
  cardId: string;
}

async function run() {
  const authToken = core.getInput('authToken');
  const cardsJson = core.getInput('cards');
  const labelName = core.getInput('label');

  try {
    const cards = JSON.parse(cardsJson);
    if (!cards) {
      return;
    }

    for (let i = 0; i < cards.length; i++) {
      const cardData = cards[i] as ICard;
      const {boardId, cardId} = cardData;

      // find the board { id, labels }
      const board = await GloSDK(authToken).boards.get(boardId, {
        fields: ['labels']
      });
      if (!board) {
        core.setFailed(`Board ${boardId} not found`);
        continue;
      }

      // find the card { id, labels }
      const card = await GloSDK(authToken).boards.cards.get(boardId, cardId, {
        fields: ['labels']
      });
      if (!card) {
        core.setFailed(`Card ${cardId} not found`);
        continue;
      }

      // find label
      if (board.labels) {
        const label = board.labels.find(l => l.name === labelName);
        if (label) {
          if (!card.labels) {
            card.labels = [];
          }

          // add label to the card
          card.labels.push({
            id: label.id as string,
            name: label.name as string
          });

          // update card
          await GloSDK(authToken).boards.cards.edit(boardId, cardId, card);
        }
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
