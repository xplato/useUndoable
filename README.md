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
		set,
		reset
	}
] = useUndoable(0);
```

#### `count`

This is the `present` state. Think of it like the left side of the `useState` hook: `const [count, setCount] = useState(0)`.

#### `setCount`

This is the updater function. It's used to modify the state **without deleting the `future` value.** Think of it like the right side of the `useState` hook: `const [count, setCount] = useState(0)`

When you call this function to update the state, it pushes the current `present` value to the past and updates it with the provided value.

For instance, let's assume the `present` count is set to `42` and the `past` and `future` states are empty. If we call `setCount(43)`, the whole state will now look like:

```
{
	past: [42],
	present: 43,
	future: []
}
```

#### `past`, `future`

As seen above, both of these objects are just an array of the previous/future actions that you've set. You usually won't need to use either of these, but they're exported anyway.

#### `undo`

This is a function accepting **zero** parameters that pulls from the `past` array and moves the most recent item to the `present`. While doing so, the `present` state is pushed to the `future` object.

#### `redo`

This is a function that accepts **zero** parameters that pulls from the `future` array and moves the most recent item to the `present`. The current `present` is pushed to the `past`.

#### `canUndo`, `canRedo`

A boolean that indicates whether or not you can undo the latest action.

#### `set`

This function sets the `present` value with the parameter you pass in. This differs from `setCount` (internally referred to as `update`) in that **this operation destroys the `future` array.** Many undo/redo packages on NPM default to this behavior, but it has one downside: if you modify the state after undoing a few actions, you'll lose the previous actions. If you're accoustomed to this behavior, you can use this function.

```
set(42);
```

#### `reset`

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
		set: updateTheValueAndRemoveTheExistingFuture,
		reset: deleteEverythingYo
	}
] = useUndoable([{
	count: 1
}]);

updateTheValueAndRemoveTheExistingFuture({
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