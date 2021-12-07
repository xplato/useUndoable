# useUndoable

React Hook for undo/redo functionality without the hassle.

## Installation

`yarn add use-undoable`

or 

`npm install use-undoable`

## Usage

```
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

### Docs

This section explains the values given by the `useUndoable` hook. Let's assume that we've called the hook and set **all** of the exported values:

```
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
] = useUndoable(0);
```

### `count`

This is the `present` state. Think of it like the left side of the `useState` hook: `const [count, setCount] = useState(0)`.

### `setCount`

This is the updater function. It's used to modify the current state. Think of it like the right side of the `useState` hook: `const [count, setCount] = useState(0)`

When you call this function to update the state, it pushes the current `present` value to the past and updates it with the provided value.

### Mutation behavior

Version 2.0.0 added the `mutationBehavior` argument to this function. It allows you to specify how you'd like the new state to be mutated when you call `setCount`.

For example:

```
setCount(c => c + 1, 'mergePast')
```

The default value is `mergePast`.

The following are the possible values:

#### `mergePast`

This will merge the `future` into the `past`, keeping all the changes in the state.

Let's say the state looks like this:

```
{
	past: [0, 1, 2, 3],
	present: 4,
	future: []
}
```

If you call `undo` twice, the state will look like:

```
{
	past: [0, 1],
	present: 2,
	future: [3, 4]
}
```

If you then call `setCount(c => c + 1)`, the state will finally look like:

```
{
	past: [0, 1, 3, 4, 2],
	present: 3,
	future: []
}
```

As you can see here, the `future` (`3, 4`) was merged into the `past` (`0, 1`), right before the previous `present` value (`2`)

#### `destroyFuture`

This is the standard behavior of many undo/redo packages you'll come across. When you undo a change _and then_ update it via `setCount`, the `future` is reset to an empty array.

Consider the following:

```
{
	past: [0, 1, 2, 3],
	present: 4,
	future: []
}
```

If you call `undo` twice, the state will look like:

```
{
	past: [0, 1],
	present: 2,
	future: [3, 4]
}
```

If you then call `setCount(c => c + 1)`, the state will finally look like:

```
{
	past: [0, 1, 2],
	present: 3,
	future: []
}
```

#### `keepFuture`

This is similar to the above, but instead of deleting the future, it'll keep it.

Assume we've started with the same default state, pressed undo twice like above, the final state will be:

```
{
	past: [0, 1, 2],
	present: 3,
	future: [3, 4]
}
```

### `past`, `future`

As seen above, both of these objects are just an array of the previous/future actions that you've set. You usually won't need to use either of these, but they're exported anyway.

### `undo`

This is a function accepting **zero** parameters that pulls from the `past` array and moves the most recent item to the `present`. While doing so, the `present` state is pushed to the `future` object.

### `redo`

This is a function that accepts **zero** parameters that pulls from the `future` array and moves the most recent item to the `present`. The current `present` is pushed to the `past`.

### `canUndo`, `canRedo`

A boolean that indicates whether or not you can undo the latest action.

### `reset`

This function empties both the `past` and `future` arrays and sets the `present` state with the value you provide. If you do not provide a value, it defaults to the `initialState` you originally called the `useUndoable` hook with.

```
reset(42);
```

## Changing function/variable names

Since the third value returned from the `useUndoable` hook is an object, you can change the names of the values like so:

```
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
3. In the root directory, run `yarn watch`
4. In the example directory, run `yarn start`

## License

This project is licensed under the terms of the MIT license. See the `LICENSE` file.