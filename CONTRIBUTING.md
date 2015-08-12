In lieu of a formal style guide adhere to the existing style as much as possible.

## Development
- Create an issue outlining what you plan to do.
- Create a branch that is named `xx-something-descriptive`, where xx is the issue number from previous step
- When you're done create PR to merge back to master

## Testing
Tests are written using [tape](https://github.com/substack/tape) and can be run by `npm test`.

You may also use `npm run testling` to run tests in a browser, see [testling#usage](https://github.com/substack/testling#usage) for more details.

If you want to run tests automatically while in development you can do so by installing [watch](https://github.com/mikeal/watch), and then e.g. `watch 'npm test'` (will re-run tests on all file changes in current dir).
