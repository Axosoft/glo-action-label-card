# GitHub action to add a label to a Glo card

Use this action to add a label to a card on a [GitKraken Glo](https://www.gitkraken.com/glo) board.
The action requires the board ID, card ID, and label name as inputs.

## Requirements
The action requires an auth token in the form of a PAT that you can create in your GitKraken account.
See the [Personal Access Tokens](https://support.gitkraken.com/developers/pats/) page on our support site.

This token should be stored in your GitHub repo secrets (in repo Settings -> Secrets).

## Example
Add a step in your workflow file to perform this action:
```yaml
    steps:
    - uses: Axosoft/glo-action-label-card@v1
      with:
        authToken: ${{ secrets.GLO-PAT }}
        boardID: '12345'
        cardID: '12345'
        label: 'Released'
      id: glo-label
```
