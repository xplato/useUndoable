import React from 'react';
import useUndoable from 'use-undoable';

const Button = ({ children, ...props }) => (
	<button {...props} className="j-button app gray mnw-2r mh-0-25r">
		{children}
	</button>
);

const App = () => {
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

	const getVisualItem = (items) => {
		if (items.length === 0) {
			return (
				<span className="text-dynamic-06"><i>empty</i></span>
			)
		}

		return items.map((e, i) => `${e}${i + 1 !== items.length ? ', ' : ''}`);
	};

	return (
		<section className="section">
			<div className="container flex-c text-c mw-30r">
				<p>Past: {getVisualItem(past)}</p>
				<p>Present: {count}</p>
				<p>Future: {getVisualItem(future)}</p>

				<div className="j-divider"></div>

				<div className="flex flex-row align-c mb-1r">
					<Button onClick={() => setCount(count + 1)}>+</Button>
					<Button onClick={() => setCount(count - 1)}>-</Button>
				</div>

				<div>
					<Button onClick={undo} disabled={!canUndo}>undo</Button>
					<Button onClick={redo} disabled={!canRedo}>redo</Button>
				</div>

				<div className="mt-1r">
					<Button onClick={() => reset()}>reset</Button>
				</div>
			</div>
		</section>
	);
};

export default App;
