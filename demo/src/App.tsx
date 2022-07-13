import { useState } from 'react';
import useUndoable from 'use-undoable';

type MutationBehavior =
	'mergePastReversed' |
	'mergePast' |
	'destroyFuture' |
	'keepFuture';

const Button = ({ children, ...props }: any) => (
	<button {...props} className='j-button app gray mnw-2r mh-0-25r'>
		{children}
	</button>
);

const App = () => {
	const [behavior, setBehavior] = useState<MutationBehavior>('mergePastReversed');

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
			reset,
			resetInitialState,
		},
	] = useUndoable(0, {
		behavior,
		ignoreIdenticalMutations: true,
		cloneState: false,
	});

	const getVisualItem = (items: number[]) => {
		if (items.length === 0) {
			return (
				<span className='text-dynamic-06'>
					<i>empty</i>
				</span>
			);
		}

		return items.map((e, i) => `${e}${i + 1 !== items.length ? ', ' : ''}`);
	};

	return (
		<section className='section'>
			<div className='container flex-c text-c mw-30r'>
				<p>Past: {getVisualItem(past)}</p>
				<p>Present: {count}</p>
				<p>Future: {getVisualItem(future)}</p>

				<div className='j-divider'></div>

				<div className='flex flex-row align-c mb-1r'>
					<Button
						onClick={() => {
							let c = count + 1;
							setCount(c);
							setCount(c);
						}}
					>
						+
					</Button>
					<Button onClick={() => setCount((c) => c - 1)}>-</Button>
				</div>

				<div>
					<Button onClick={undo} disabled={!canUndo}>
						undo
					</Button>
					<Button onClick={redo} disabled={!canRedo}>
						redo
					</Button>
				</div>

				<div className='mt-1r'>
					<Button onClick={() => reset()}>reset</Button>
				</div>

				<div className='j-divider'></div>

				{/* @ts-ignore */}
				<select onChange={(ev) => setBehavior(ev.target.value)}>
					<option value='mergePastReversed'>mergePastReversed</option>
					<option value='mergePast'>mergePast</option>
					<option value='destroyFuture'>destroyFuture</option>
					<option value='keepFuture'>keepFuture</option>
				</select>

				<p className='mt-1r'>historyLimit: 100</p>

				<Button onClick={() => resetInitialState(42)}>
					resetInitialState to 42
				</Button>
			</div>
		</section>
	);
};

export default App;
