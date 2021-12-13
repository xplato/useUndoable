import useUndoable from 'use-undoable';
import ReactFlow, { addEdge, removeElements } from 'react-flow-renderer';

import { initialElements } from './els';
import { useEffect } from 'react';

const Button = ({ children, ...props }) => (
	<button {...props} className='j-button app gray mh-0-5r'>{children}</button>
);

const Buttons = ({ undo, redo, reset }) => (
	<div className='fixed top-16 right-16 flex flex-row'>
		<Button onClick={() => undo()}>Undo</Button>
		<Button onClick={() => redo()}>Redo</Button>
		<Button onClick={() => reset()}>Reset</Button>
	</div>
);

const App = () => {
	const [
		elements,
		setElements,
		{
			undo,
			// canUndo,

			redo,
			// canRedo,

			reset,
			// resetInitialState
		}
	] = useUndoable(initialElements);

	useEffect(() => {
		console.log(elements)
	}, [elements]);

	const mergeUpdate = (node) => {
		setElements(els => els.map(e => {
			if (e.id === node.id) {
				return {
					...e,
					...node
				}
			}

			return e;
		}));
	}

	const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));
	const onConnect = (params) => setElements((els) => addEdge(params, els));

	return (
		<div className="w-screen h-screen">
			<Buttons undo={undo} redo={redo} reset={reset} />

			<ReactFlow
				elements={elements}
				onNodeDragStop={(ev, node) => mergeUpdate(node)}
				onConnect={onConnect}
				onElementsRemove={onElementsRemove}

				deleteKeyCode={8}
				zoomOnScroll={false}
				panOnScroll
			/>
		</div>
	);
};

export default App;