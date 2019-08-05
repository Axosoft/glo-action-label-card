"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const glo_sdk_1 = __importDefault(require("@axosoft/glo-sdk"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const authToken = core.getInput('authToken');
        const boardID = core.getInput('boardID');
        const cardID = core.getInput('cardID');
        const labelName = core.getInput('label');
        try {
            // find the board { id, labels }
            const board = yield glo_sdk_1.default(authToken).boards.get(boardID, {
                fields: ['labels']
            });
            if (!board) {
                core.setFailed(`Board ${boardID} not found`);
                return;
            }
            // find the card { id, labels }
            const card = yield glo_sdk_1.default(authToken).boards.cards.get(boardID, cardID, {
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
                        id: label.id,
                        name: label.name
                    });
                    // update card
                    yield glo_sdk_1.default(authToken).boards.cards.edit(boardID, cardID, card);
                }
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
