import useUndoable from 'use-undoable';
import { useEffect, useCallback } from 'react';
import ReactFlow, { addEdge, applyNodeChanges } from 'react-flow-renderer';

import { initialElements } from './els';


const Button = ({ children, ...props }) => (
	<button {...props} className='j-button app gray mh-0-5r'>
		{children}
	</button>
);

const Buttons = ({ undo, redo, reset }) => (
	<div className='fixed top-16 right-16 flex flex-row'>
		<Button onClick={() => undo()}>Undo</Button>
		<Button onClick={() => redo()}>Redo</Button>
		<Button onClick={() => reset()}>Reset</Button>
	</div>
);

const App = () => {
	const [elements, setElements, { undo, redo, reset }] = useUndoable({
		nodes: initialElements,
		edges: [],
	});

	useEffect(() => {
		console.log(elements);
	}, [elements]);

	const triggerUpdate = useCallback(
		(t, v) => {
			// To prevent a mismatch of state updates,
			// we'll use the value passed into this
			// function instead of the state directly.
			setElements(e => ({
				nodes: t === 'nodes' ? v : e.nodes,
				edges: t === 'edges' ? v : e.edges,
			}));
		},
		[setElements]
	);


	// We declare these callbacks as React Flow suggests,
	// but we don't set the state directly. Instead, we pass
	// it to the triggerUpdate function so that it alone can
	// handle the state updates.

	const onNodesChange = useCallback(
		(changes) => {
			triggerUpdate('nodes', applyNodeChanges(changes, elements.nodes));
		},
		[triggerUpdate, elements.nodes]
	);

	const onEdgesChange = useCallback(
		(connection) => {
			triggerUpdate('edges', addEdge(connection, elements.edges));
		},
		[triggerUpdate, elements.edges]
	);

	return (
		<div className='w-screen h-screen'>
			<Buttons undo={undo} redo={redo} reset={reset} />

			<ReactFlow
				nodes={elements?.nodes}
				edges={elements?.edges}

				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onEdgesChange}

				deleteKeyCode={8}
				zoomOnScroll={false}
				panOnScroll
			/>
		</div>
	);
};

export default App;
