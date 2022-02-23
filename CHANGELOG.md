### PATCH : Version 3.3.4:

- Fixed some typos in the README
- Added "Why?" section explaining why this package exists.

### PATCH : Version 3.3.3:

- Fixed an issue where using an invalid key for `behavior` would cause an undefined error internally. Now, we check if the behavior key is valid and, if not, throw an error.
- Fixed some typos in the README.

### PATCH : Version 3.3.2:

- Fixed indentation and other issues in README.

### MINOR : Version 3.3.1:

- Added `ignoreIdenticalMutations` option. This allows you to prevent identical `setState` calls from being pushed into the `past`. See the README for more information.
- Added companion `cloneState` option.

### PATCH : Version 3.2.1:

- Fixed an issue where repeated state mutations weren't properly informing components of updates. This was caused by the comparison check on lines 40-47 in `mutate.ts`.

### MINOR : Version 3.2.0:

- Improved error handling.
- Added `resetInitialState` function. See README.
- Improvements to README; syntax highlighting.

### MINOR : Version 3.1.0:

- Introduced `historyLimit` option to help prevent huge memory consumption. The default limit is 100.
- Corrected README; updated indentation to spaces for consistency.

### MAJOR : Version 3.0.0:

- Added `mergePastReversed` mutation behavior option. This is now the default behavior.
- Corrected typo in README
- Added a better explanation of the `setState` function.
- Added SemVer labels to CHANGELOG

### PATCH : Version 2.1.2:

- Removed GIF demo

### PATCH : Version 2.1.1:

- Added GIF demo

### MINOR : Version 2.1.0:

- Added `options` object to be able to set default mutation behavior for all state calls. More options may be added in the future.
- Updated example; setup live sandbox.

### MAJOR : Version 2.0.0:

- Added functional updater functionality to the `setState` (AKA the `setCount` in the example) function. This behaves the same way as the functional updater form of `setCount` directly from `useState`. AKA: `setCount(count => count + 1)`
- Renamed `newPresent` to `payload`
- Added `mutationBehavior` argument to the `update` function which defines behavior to merging the past, present, and future values. See the README.
- Remove the `set` function in favor of the `mutationBehavior` arg to the `update` function.
- Removed unnecessary code/files from `example/`