import { useReducer } from 'react';
import OperationDigitButton from './OperationDigitButton';
import DigitButton from './DigitButton';
import '../src/style.css';

export const ACTIONS = {
	ADD_DIGIT: 'add-digit',
	CHOOSE_OPERATION: 'choose-operation',
	CLEAR: 'clear',
	DELETE_DIGIT: 'delete-digit',
	EVALUATE: 'evaluate'
};

function reducer(state, { type, payload }) {
	switch (type) {
		case ACTIONS.ADD_DIGIT:
			if (state.overWrite) {
				return {
					...state,
					currentOperand: payload.digit,
					overWrite: false
				};
			}
			if (payload.digit === '0' && state.currentOperand === '0') return state;
			if (payload.digit === '.' && state.currentOperand.includes('.'))
				return state;
			return {
				...state,
				currentOperand: `${state.currentOperand || ''}${payload.digit}`
			};
		case ACTIONS.CLEAR:
			return { state };
		case ACTIONS.CHOOSE_OPERATION:
			if (state.currentOperand == null && state.previousOperand == null) {
				return state;
			}
			if (state.currentOperand === null) {
				return {
					...state,
					operation: payload.operation
				};
			}
			if (state.previousOperand == null) {
				return {
					...state,
					operation: payload.operation,
					previousOperand: state.currentOperand,
					currentOperand: null
				};
			}
			return {
				...state,
				previousOperand: evaluate(state),
				operation: payload.operation,
				currentOperand: null
			};
		case ACTIONS.EVALUATE:
			if (
				state.operation == null ||
				state.previousOperand == null ||
				state.currentOperand == null
			) {
				return state;
			}
			return {
				...state,
				overWrite: true,
				previousOperand: null,
				operation: null,
				currentOperand: evaluate(state)
			};
		case ACTIONS.DELETE_DIGIT:
			if (state.overWrite) {
				return {
					...state,
					overWrite: false,
					currentOperand: null
				};
			}
			if (state.currentOperand == null) {
				return state;
			}
			if (state.currentOperand.length === 1) {
				return {
					...state,
					currentOperand: null
				};
			}
			return {
				...state,
				currentOperand: state.currentOperand.slice(0, -1)
			};
	}
}

function evaluate({ currentOperand, previousOperand, operation }) {
	const prev = parseFloat(previousOperand);
	const current = parseFloat(currentOperand);
	if (isNaN(prev) || isNaN(current)) return '';
	let computation = '';
	switch (operation) {
		case '+':
			computation = prev + current;
			break;
		case '-':
			computation = prev - current;
			break;
		case '*':
			computation = prev * current;
			break;
		case '÷':
			computation = prev / current;
			break;
	}
	return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
	maximumFractionDigits: 0
});

function formatOperand(operand) {
	if (operand == null) {
		return;
	}

	const [integer, decimal] = operand.split('.');

	if (decimal == null) {
		return INTEGER_FORMATTER.format(integer);
	}
}
function App() {
	const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
		reducer,
		{}
	);
	return (
		<div className="calculator-grid">
			<div className="output">
				<div className="previous-operand">
					{formatOperand(previousOperand)} {operation}
				</div>
				<div className="current-operand">{formatOperand(currentOperand)}</div>
			</div>
			<button
				onClick={() => dispatch({ type: ACTIONS.CLEAR })}
				className="span-two"
			>
				AC
			</button>
			<button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
				DEL
			</button>
			<OperationDigitButton operation="÷" dispatch={dispatch} />
			<DigitButton digit="1" dispatch={dispatch} />
			<DigitButton digit="2" dispatch={dispatch} />
			<DigitButton digit="3" dispatch={dispatch} />
			<OperationDigitButton operation="*" dispatch={dispatch} />
			<DigitButton digit="4" dispatch={dispatch} />
			<DigitButton digit="5" dispatch={dispatch} />
			<DigitButton digit="6" dispatch={dispatch} />
			<OperationDigitButton operation="+" dispatch={dispatch} />
			<DigitButton digit="7" dispatch={dispatch} />
			<DigitButton digit="8" dispatch={dispatch} />
			<DigitButton digit="9" dispatch={dispatch} />
			<OperationDigitButton operation="-" dispatch={dispatch} />
			<DigitButton digit="." dispatch={dispatch} />
			<DigitButton digit="0" dispatch={dispatch} />
			<button
				onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
				className="span-two"
			>
				=
			</button>
		</div>
	);
}

export default App;
