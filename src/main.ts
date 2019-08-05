import * as core from '@actions/core';
import GloSDK from '@axosoft/glo-sdk';

async function run() {
  const authToken = core.getInput('authToken');
  const boardID = core.getInput('boardID');
  const cardID = core.getInput('cardID');
  const labelName = core.getInput('label');

  try {
    // find the board { id, labels }
    const board = await GloSDK(authToken).boards.get(boardID, {
      fields: ['labels']
    });
    if (!board) {
      core.setFailed(`Board ${boardID} not found`);
      return;
    }

    // find the card { id, labels }
    const card = await GloSDK(authToken).boards.cards.get(boardID, cardID, {
      fields: ['labels']
    });
    if (!card) {
      core.setFailed(`Card ${cardID} not found`);
      return;
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
        await GloSDK(authToken).boards.cards.edit(boardID, cardID, card);
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
