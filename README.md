# useUndoable

React Hook adding undo/redo functionality to `useState` with a hassle-free API and customizable behavior.

[**See the Live Demo**](https://codesandbox.io/s/use-undoable-zi0b4)

Note: Information about integration with React Flow v10 is near the bottom of this document.

## Installation

```bash
yarn add use-undoable
```

or

```bash
npm install use-undoable
```

## Basic Usage

```js
import useUndoable from 'use-undoable';

const MyComponent = () => {
    const initialState = 0;

    const [count, setCount, { undo, redo }] = useUndoable(initialState);

    return (
        <>
            <p>{count}</p>
            <button onClick={undo}>undo</button>
        </>
    );
};
```

## Features

(and how `useUndoable` improves on existing packages)

-   Familiar API similar to `useState`
-   You can choose how you'd like state changes to be reflected, with `mergePastReversed`, `mergePast`, `destroyFuture`, or `keepFuture`
-   Ability to set default options so that each call to `setState` doesn't need to pass the same mutation behavior.
-   Set a history limit to prevent huge memory consumption.
-   Zero dependencies
-   Tiny; less than 40 kB unpacked

## Why?

There are existing packages that provide undo/redo functionality for React. So why, then, does this project exist? **To fill the gaps they don't.**

As explained in this README, most undo/redo packages default to the `destroyFuture` behavior. I don't think this is a good approach. There's a problem: after undoing some change and then making another change on that branch, the previous state changes are destroyed.

The problem with many existing projects that I've found is that they implicitly force a certain behavior. If you don't like the `future` being destroyed, you either have to implement your own solution or deal with it.

Or, as evidenced by the fact that you're reading this, you use useUndoable. This project excels in subjectivity. That is, the behavior of the state can be adjusted at your discretion, and on-the-fly. **No longer do we have this lock-in behavior that dictates how users use your application.**

If you like what you're reading, continue on below to learn how to use it.

## Documentation

useUndoable is one of those projects that doesn't have a massive layer of abstraction. In comparison to a project like, say, React, _how_ you use the program greatly differs from how it is built.

This project is slightly different. Instead of just going through the API in a superficial way, I will actually teach you, more or less, how useUndoable works under-the-hood. You see, this project is, in a general sense, quite simple. It is imperative, however, that you have a deeper understanding of how it works. Having this understanding will allow you to make better decisions about the options and behaviors this package offers.

This README is the entire documentation. It is written such that you are meant to read it from top to bottom, without skipping around.

The best way to visualize how the useUndoable state system works is to use the [live demo](https://codesandbox.io/s/use-undoable-zi0b4) as a companion to this README. Simply open it up and make the state there match the examples offered below.

Let's start by going into the API of the hook. Afterwards, we'll move into the options and behavior.

### The API

The API is rather straightforward. You start by initializing the state, giving it a name and naming the updater function. Then, you simply initialize the `undo` and `redo` functions in an object.

### State

```js
const [yourState, setYourState, { undo, redo }] = useUndoable(initialState);
```

Notice how the left-two variables look similar to the `useState` API:

```js
const [yourState, setYourState] = useState(initialState);
```

This is an intentional choice. You see, useUndoable is designed to mimick this behavior—both in looks and functionality.

One primary thing to note is that the updater function (`setYourState`) accepts both a direct value **and** a so-called "functional updater," just like `useState`. The functional updater is given the current state as a parameter.

That is, both of these are valid:

```js
setYourState(yourState + 1);
```

```js
setYourState((currentState) => currentState + 1);
```

Heads up: Are you pulling data from an API? Stick around to read how to handle that properly with useUndoable.

### Undoing and Redoing changes

Let's take a moment and look at what the internal state of useUndoable looks like:

```js
{
    past: [0, 1, 2],
    present: 3,
    future: []
}
```

When you make a state update with `setYourState`, the `present` value is passed into the `past` array.

Let's take the above object and call `undo()` on it. The resulting state would look like:

```js
{
    past: [0, 1],
    present: 2,
    future: [3]
}
```

and, by extension, the `redo()` function will do the opposite of this, making the object go back to the initial example.

Simply call `undo` and `redo` whenever you'd like, and those changes will be reflected in the state and your component will re-render with the new data.

---

That covers most of the API you'll be working with. There are, however, some lesser-used API values that are explained after the Options & Behavior section below.

### Options & Behavior

#### Options

The `useUndoable` hook accepts two parameters: `initialState` and `options`. The latter is not required, and the default options will be specified later.

The `options` object looks like this:

```ts
interface Options {
    behavior?: 'mergePastReversed' | 'mergePast' | 'destroyFuture' | 'keepFuture';
    historyLimit?: number | 'infinium' | 'infinity';
    ignoreIdenticalMutations?: boolean;
    cloneState?: boolean;
};
```

The `historyLimit` is a number that limits the amount of items in the `past` array. This is particularly useful when your state is relatively large.

The default is `100` items.

`ignoreIdenticalMutations` and `cloneState` are related. If you don't change `ignoreIdenticalMutations`, you don't need to worry about the other.

Essentially, there are some specific cases where you actually _do_ need useUndoable to allow identical mutations (where you update the state with a value it already has). These cases are rare, but enough exist to warrant this specific option.

In short, if you find useUndoable acting weird, try changing this option and see if it helps.

If you do end up using this option, you have access to the `cloneState` option (default `false`) which just determines whether or not to return the existing state or a cloned version (this can help with triggering re-renders).

#### Behavior

You can customize the behavior of undo/redo actions by specifying one of the following: `mergePastReversed`, `mergePast`, `destroyFuture`,  or `keepFuture`

To describe these, let's go through an example.

Assume we start with the following state object:

```js
{
    past: [],
    present: 0,
    future: []
}
```

Let's call `setYourState(s => s + 1)` twice. This leaves us with:

```js
{
    past: [0, 1],
    present: 2,
    future: []
}
```

Let us now call `undo()` twice. We are left with:

```js
{
    past: [],
    present: 0,
    future: [1, 2]
}
```

Great. This is the starting point for the behavior. 

Calling `undo()` essentially creates a new branch of state changes. The `behavior` specifies how to recover from _after_ a state change that followed an `undo()`.

The `destroyFuture` option, like I explained briefly above, is the most common behavior that I have seen. It essentially just discards the `future` if you make a state change after an undo.

Let's go back to this state:

```js
{
    past: [],
    present: 0,
    future: [1, 2]
}
```

If we call `setYourState(s => s + 1)` now, it would erase the future. The resulting state would look like:

```js
{
    past: [0],
    present: 1,
    future: []
}
```

This, as I explained, is potentially unexpected behavior. The state values `1` and `2` have been erased! The user can't go back.

This option is provided just in case it fits your use case, but there are three more to discuss.

The `mergePastReversed` and `mergePast` options are the most common, and ones that users probably expect.

What they do is simply merge the `future` into the `past`, meaning that every single state change can be navigated back to. The only difference between these two, as indicated by the name, is how the future looks after being merged.

`mergePastReversed`, understandably, reverses the `future` before merging it into the `past`.

The other option is the `keepFuture` option, which simply does not touch the `future` array.


Therefore, contrary to the `destroyFuture` option, the resulting object would look like:

```js
{
    past: [0],
    present: 1,
    future: [1, 2]
}
```

### Other values

The hook exports a few other values that are useful in certain scenarios. Let's call the hook and set all of the values it provides:

```js
const [
    state,
    setState,

    {
        past,
        future,

        undo,
        canUndo,
        redo,
        canRedo,
        reset,
        static_setState,
    },
] = useUndoable(initialState, options);
```

`canUndo` and `canRedo` are just booleans indicating whether or not you can technically undo or redo any state changes.

`reset` is a function allowing you to erase the entire state and start the `present` off with a value. If you don't pass a value, it will default to `initialState`.

### `resetInitialState` (handling `async`)

If you're dynamically updating the state from an async function or accepting data via an HTTP request, your `initialState` may begin as an empty or `undefined` object. `resetInitialState` will allow you to prevent the `undo` function from going back to that `undefined` object.

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

One more note: This function **does not** reset the _actual_ state you passed into the hook itself (`useUndoable([])`); it only changes the item at index `0` in the `past` array.

### `static_setState`

In some rare cases, you may run into the issue that the default `setState` function changes with every state change. This is, more or less, by design.

One key behavior of the default `setState` is that you can pass either a value or a function. The function receives the present state as a parameter. As such, the function itself needs to change whenever the present state changes.

If you have an issue with this, you can use the `static_setState` function. This **does not** accept a function, only a new value. This means it only needs to be created once.

## Performance considerations

Every time you make a state change, the previous state is saved in memory (and the previous one, and the previous one, ...). Because of this, **you** need to think carefully about how you want to store your state, how many changes in the past you want to keep, and so on.

In general, you want to ask yourself the following:

-   How can I reduce the size of my state object while still keeping it usable?
-   How many actions in the past is reasonable for my project to store? (See `historyLimit`)
-   Should each "state" be a description of how to mutate some static object, or should it be the state object in itself?

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
        reset: deleteItAll,
    },
] = useUndoable([
    {
        count: 1,
    },
]);

deleteItAll({
    state: 'My new state',
});
```

And, of course, you can set `count, setCount` to anything you want by default, since they are array items.

## Integration with React Flow v10

React Flow v10 added new (and much better) ways to manage the internal state of the `ReactFlow` component. Most notably, the state of nodes and edges have been separated. When you try to integrate useUndoable with v10 as their documentation suggestions, you'll run into some weird issues with re-renders and state updates.

The primary cause for most of these issues is that **you are trying to manage multiple state instances at once.** In effect, useUndoable may try to overwrite React Flow's state and vice/versa.

The solution to this problem is very simple: make useUndoable the **exclusive** state manager for nodes and edges.

This way, nothing will be arbitrarily overwritten, and it will work as expected.

See the updated `react-flow-example/src/App.jsx` file for ways to work with React Flow v10.

The `react-flow-example` does do something "unexpected:" moving a node counts as a **series** of state updates. This means that useUndoable **will count each drag event as individual pieces of history.**

For instance:

- You have Node A with position 0, 0
- You move Node A to position 100, 100

This is not one state update in React Flow v10. Instead, a `drag` event is fired for, more or less, every unit you move: 0 -> 1 -> 2 -> 3 -> and so on.

This is not a flaw with useUndoable itself, because those state changes are legitimate. Therefore, it is up to you and your project to determine the best way to track React Flow's state changes.

## Contributing

1. Clone repo and install dependencies for the main project with: `yarn install`
2. Navigate into the example and do the same.
3. In the root directory, run `yarn start`
4. In the example directory, run `yarn start`

## License

This project is licensed under the terms of the MIT license. See the `LICENSE` file.
