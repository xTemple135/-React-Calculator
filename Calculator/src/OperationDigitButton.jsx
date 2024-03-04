import { ACTIONS } from './App';
function OperationDigitButton({ dispatch, operation }) {
	return (
		<button
			onClick={() =>
				dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })
			}
		>
			{operation}
		</button>
	);
}

export default OperationDigitButton;
