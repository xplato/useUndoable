## Version 2.1.2:

- Removed GIF demo

## Version 2.1.1:

- Added GIF demo

## Version 2.1.0:

- Added `options` object to be able to set default mutation behavior for all state calls. More options may be added in the future.
- Updated example; setup live sandbox.

## Version 2.0.0:

- Added functional updater functionality to the `setState` (AKA the `setCount` in the example) function. This behaves the same way as the functional updater form of `setCount` directly from `useState`. AKA: `setCount(count => count + 1)`
- Renamed `newPresent` to `payload`
- Added `mutationBehavior` argument to the `update` function which defines behavior to merging the past, present, and future values. See the README.
- Remove the `set` function in favor of the `mutationBehavior` arg to the `update` function.
- Removed unnecessary code/files from `example/`