# useUndoable

React Hook for undo/redo functionality without the hassle. This hook acts like the `useState` hook but provides easy-to-use helper functions for undoing/redoing state changes.

[**Live Demo**](https://codesandbox.io/s/use-undoable-zi0b4)

## Installation

`yarn add use-undoable`

or 

`npm install use-undoable`

## Usage

```js
import useUndoable from 'use-undoable';

const MyComponent = () => {
    const initialState = 0;

    const [
        count,
        setCount,
        {
            undo,
            redo
        }
    ] = useUndoable(initialState);

    return <p>{count}</p>
}
```

## Features

(and how `useuUndoable` improves on existing packages)

- Familiar API similar to `useState`
- You can choose how you'd like state changes to be reflected, with `mergePastReversed`, `mergePast`, `destroyFuture`, or `keepFuture`
- Ability to set default options so that each call to `setState` doesn't need to pass the same mutation behavior.
- Set a history limit to prevent huge memory consumption.
- Zero dependencies
- Tiny; less than 40 kB unpacked

### Docs

This section explains the values given by the `useUndoable` hook. **Make sure to read until the end of the README,** just in case there's an option or function that will suit your use-case.

Let's assume that we've called the hook and set **all** of the exported values:

```js
const [
    count,
    setCount,

    {
        past,
        future,

        undo,
        canUndo,
        redo,
        canRedo,
        reset
    }
] = useUndoable(initialState, options);
```

### `options`

Here's an object showing all the option values in TypeScript format:

```js
const options = {
    behavior: 'mergePastReversed' | 'mergePast' | 'destroyFuture' | 'keep future',
    historyLimit: number | 'infinium' | 'infinity'
}
```

Note: `options` is not required. It will default to the following if you don't specify it:

```js
{
    behavior: 'mergePastReversed',
    historyLimit: 100
}
```

#### `behavior`

Allowed values: 'mergePastReversed' | 'mergePast' | 'destroyFuture' | 'keep future'

Declaring the mutation behavior in the `options` sets that behavior for all state changes. This behavior can be overridden within individual state mutations.

```js
const options = {
    behavior: 'destroyFuture'
}
```

With `destroyFuture`, all calls to `setCount` will destroy the future array on new state changes.

Therefore:

```js
setCount(0);
```

will use the `destroyFuture` behavior and

```js
setCount(0, 'keepFuture');
```

will keep the future array.

#### `historyLimit`

Allowed values: number (> 0) | 'infinium' | 'infinity'

(Note: the `infinium` option is the same as `infinity`. It's just a nod to the name of our company.)

Defines the max size for the history. The default is `100.` The resulting `past` array will be +1 whatever number you give. That is, if you set the `historyLimit` to 5, there will actually be 6 total items within the array because the `present` is merged into it on every state change.

Therefore, if your project absolutely requires there to be only 1,000 **total** items, for example, set the limit to `999`.

**Note:** It is highly recommended that you set a limit specific to your project. If your state contains an array of objects, for instance, the history could quickly get out of hand. If you make a state change too often, your project could start consuming **a lot** of memory. That is why the default is `100`.

#### `ignoreIdenticalMutations` & `cloneState`

Most of the time, you'll probably want `useUndoable` to ignore multiple mutations with the same payload value. There are very rare—though existing—cases where you actually need multiple identical mutations. This option helps you handle those rare cases.

By default, this is set to `true`.

Consider:

```
const onChange = (count) => {
	const c = count + 1;

	setCount(c);
	setCount(c);
}
```

By default, this will only set the `count` once, and the other mutation is ignored. If you set it to `false`, however, this _would_ work and you'd see a state like this:

```
{
	past: [..., 3, 4, 5],
	present: 5,
	future: []
}
```

Notice the two `5`s.

If you make use of the `ignoreIdenticalMutations` option, you also have access to the `cloneState` option.

Note: If you don't need to change the `ignoreIdenticalMutations`, **`cloneState` won't make any difference for you.**

##### `cloneState`

This is a boolean indicating whether or not to clone the returned `state` object after an identical mutation. This can help with, for example, some deeper React render issues. It just depends on your project.

It defaults to `false`.

### `count` (`state`)

This is the `present` state. Think of it like the left side of the `useState` hook: `const [count, setCount] = useState(0)`.

### `setCount` (`setState`)

This is the updater function. It's used to modify the current state. Think of it like the right side of the `useState` hook: `const [count, setCount] = useState(0)`

It mimics the `useState` behavior in that you can either pass a direct value

```js
setCount(42);
```

or you can pass a callback function to which the `present` state is passed as a parameter:

```js
setCount(c => c + 1);

// Expanded
setCount((count) => {
    return count + 1;
})
```

In this way, you can use the `useUndoable` hook just like the `useState` hook, just with some extra functions.

When you call this function to update the state, it pushes the current `present` value to the past and updates it with value you provide.

### Mutation behavior

Version 2.0.0 added the `mutationBehavior` argument to this function. It allows you to specify how you'd like the new state to be mutated when you call `setCount`.

For example:

```js
setCount(c => c + 1, 'mergePast')
```

The default value is `mergePastReversed`.

The following are the possible values:

#### `mergePastReversed`

This will merge the `future` (reversed order) into the `past`, keeping all the changes in the state.

Let's say the state looks like this:

```js
{
    past: [0, 1, 2, 3],
    present: 4,
    future: []
}
```

If you call `undo` twice, the state will look like:

```js
{
    past: [0, 1],
    present: 2,
    future: [3, 4]
}
```

If you then call `setCount(c => c + 1)`, the state will finally look like:

```js
{
    past: [0, 1, 4, 3, 2],
    present: 3,
    future: []
}
```

As you can see here, the `future` (`3, 4`) was reversed and merged into the `past` (`0, 1`), right before the previous `present` value (`2`).

> **Why do it this way?**

Although the standard behavior of most undo/redo packages we've found default to the `destroyFuture` option, this has a few downsides. Primarily, if you make a state change _after_ undoing something, all of the future states will be lost. With our `mergePast...` options, no state change will ever be removed; everything can be undone.

#### `mergePast`

This is the same behavior as above, where the `future` is pushed into the `past`, but the order **is not reversed.**

As such, the final state would instead look like:

```js
{
    past: [0, 1, 3, 4, 2],
    present: 3,
    future: []
}
```

#### `destroyFuture`

This is the standard behavior of many undo/redo packages you'll come across. When you undo a change _and then_ update it via `setCount`, the `future` is reset to an empty array.

Consider the following:

```js
{
    past: [0, 1, 2, 3],
    present: 4,
    future: []
}
```

If you call `undo` twice, the state will look like:

```js
{
    past: [0, 1],
    present: 2,
    future: [3, 4]
}
```

If you then call `setCount(c => c + 1)`, the state will finally look like:

```js
{
    past: [0, 1, 2],
    present: 3,
    future: []
}
```

#### `keepFuture`

This is similar to the above, but instead of deleting the future, it'll keep it.

Assume we've started with the same default state, pressed undo twice like above, the final state will be:

```js
{
    past: [0, 1, 2],
    present: 3,
    future: [3, 4]
}
```

### `past`, `future`

As seen above, both of these objects are just an array of the previous/future actions that you've set. You usually won't need to use either of these directly, but they're exported anyway.

### `undo`

This is a function accepting **zero** parameters that pulls from the `past` array and moves the most recent item to the `present`. While doing so, the `present` state is pushed to the `future` object.

### `redo`

This is a function that accepts **zero** parameters that pulls from the `future` array and moves the most recent item to the `present`. The current `present` is pushed to the `past`.

### `canUndo`, `canRedo`

A boolean that indicates whether or not you can undo/redo the latest action.

### `reset`

This function empties both the `past` and `future` arrays and sets the `present` state with the value you provide. If you do not provide a value, it defaults to the `initialState` you originally called the `useUndoable` hook with.

```js
reset(42);
```

### `resetInitialState` (handling `async`)

If you're dynamically updating the state from an async function, your `initialState` may begin as an empty or `undefined` object. `resetInitialState` will allow you to prevent the `undo` function from going back to that `undefined` object.

Imagine you're pulling an array of todo items from your API. Initially, you set the `initialState` as an empty array (`[]`). If users can drag items around to change the order and then undo their change, they would, previously, be able to undo all the way back to that empty array.

`resetInitialState` allows you to replace the first item (index `0`) of the `past` array to anything you want, potentially preventing your users from undoing to nothingness. Consider the following code:

```js
const MyComponent = () => {
    const [
        todos,
        setTodos,
        {
            undo,
            redo
        }
    ] = useUndoable([]);

    useEffect(() => {
        // query your API and set the todos
        setTodos(api.queryForTodos());
    }, []);

    return (
        // ...
    );
};
```

With this setup, your users can undo back to that empty array defined here: `useUndoable([])`

Let's fix this so that the user can only undo back to the array sent from the API:

```js
const MyComponent = () => {
    const [
        todos,
        setTodos,
        {
            undo,
            redo,
            resetInitialState
        }
    ] = useUndoable([]);

    useEffect(() => {
        // query your API and set the todos
        const apiTodos = api.queryForTodos();

        setTodos(apiTodos);
        resetInitialState(apiTodos);
    }, []);

    return (
        // ...
    );
};
```

Note: it is important that this function is only called once. If you call it multiple times with an existing state, you run the risk of accidentally deleteing _legitimate_ state values and replacing it with some generic (or "starting") one.

## Performance considerations

Every time you make a state change, the previous state is saved in memory. It's duplicated, essentially. Because of this, **you** need to think carefully about how you want to store your state, how many changes in the past you want to keep, and so on.

In general, you want to ask yourself the following:

- How can I reduce the size of my state object while still keeping it useable?
- How many actions in the past is reasonable for my project to store?
- Should each "state" be a description of how to mutate some static object, or should it be the state object in itself?

On that last point: consider that your state is a large array of objects with many properties. Instead of storing the entire state, you could store descriptions of how the state was modified. For instance: `item at index 5 -> change 'name' property to value 'infinium'`. This way, your state changes are more efficient and use less memory than storing the entire array of objects.

In general, you probably won't have to worry too much about performance. If you're using very large data sets, however, we urge you to consider the above.

If you spot an area where performance can be improved within our source code, please create an issue to let us know (or a pull request!).

## Changing function/variable names

Since the third value returned from the `useUndoable` hook is an object, you can change the names of the values like so:

```js
const [
    count,
    setCount,
    {
        past: currentPast,
        future: currentFuture,

        undo: undoWithCustomName,
        canUndo: canUndoWithCustomName,
        redo: redoWithCustomName,
        canRedo: canRedoWithCustomName,
        reset: deleteEverythingYo
    }
] = useUndoable([{
    count: 1
}]);

deleteEverythingYo({
    state: 'My new state'
});
```

And, of course, you can set `count, setCount` to anything you want by default, since they are array items.

## Contributing

1. Clone repo and install dependencies for the main project with: `yarn install`
2. Navigate into the example and do the same.
3. In the root directory, run `yarn start`
4. In the example directory, run `yarn start`

## License

This project is licensed under the terms of the MIT license. See the `LICENSE` file.