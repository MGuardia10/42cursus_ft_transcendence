import {
	useRef,
	useState,
	useEffect,
	KeyboardEvent,
	ClipboardEvent,
} from 'react';
import Spinner from '@/layout/Spinner/Spinner';
import { TwoFactorInputProps} from '@/types/twoFactorAuth';

  const TwoFactorInput: React.FC<TwoFactorInputProps> = ({ length = 6, onComplete, resetKey = 0 }) => {

	/* useState hook for numbers */
	const [values, setValues] = useState<string[]>(Array(length).fill(''));
	const [loading, setLoading] = useState<boolean>(false);

	/* Refs for inputs */
	const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

	/* Move focus to next input */
	const focusInput = (index: number) => {
		const next = inputsRef.current[index];
		next?.focus();
		next?.select();
	};

	/* Manage key down events */
	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, idx: number) => {
		if (e.key === 'Backspace') {
			e.preventDefault();
			if (values[idx]) {
				// borrar valor actual
				updateValue('', idx);
			} else if (idx > 0) {
				// moverse al anterior
				focusInput(idx - 1);
				updateValue('', idx - 1);
			}
		} else if (e.key.match(/^[0-9]$/)) {
			e.preventDefault();
			updateValue(e.key, idx);
			if (idx < length - 1) {
				focusInput(idx + 1);
			}
		} else if (e.key === 'ArrowLeft' && idx > 0) {
			e.preventDefault();
			focusInput(idx - 1);
		} else if (e.key === 'ArrowRight' && idx < length - 1) {
			e.preventDefault();
			focusInput(idx + 1);
		}
	};

	/* Manage paste code */
	const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		const paste = e.clipboardData.getData('Text').trim().slice(0, length);
		if (!/^\d+$/.test(paste)) return;
		const next = paste.split('');
		const newVals = [...values];
		for (let i = 0; i < length; i++) {
		newVals[i] = next[i] || '';
		}
		setValues(newVals);
		// focus al último pegado o final
		const lastFilled = Math.min(next.length - 1, length - 1);
		focusInput(lastFilled);
	};

	/* Update number if already filled */
	const updateValue = (val: string, idx: number) => {
		const newVals = [...values];
		newVals[idx] = val;
		setValues(newVals);
	};

	/* Reset if resetKey change */
	useEffect(() => {
		setValues(Array(length).fill(''));
		focusInput(0);
	}, [resetKey, length]);

	/* Check all numbers filled and call function to handle 2FA */
	useEffect(() => {
		if (values.every((v) => v !== '')) {
		  (async () => {
			setLoading(true);
			try {
			  await onComplete(values.join(''));
			} finally {
			  setLoading(false);
			}
		  })();
		}
	  }, [values, onComplete]);

	return (
		<div className='flex flex-col items-center gap-10'>
			<div className='flex flex-col items-center gap-2'>
				<h1 className='text-2xl font-bold'>Two Factor Authentication</h1>
				<p className='text-center text-gray-600'>Please, insert the submitted code.</p>
			</div>
			<div className="flex gap-2">
				{values.map((val, idx) => (
					<input
					disabled={loading}
					key={idx}
					type="text"
					inputMode="numeric"
					maxLength={1}
					value={val}
					ref={(el) => { inputsRef.current[idx] = el }}
					onKeyDown={(e) => handleKeyDown(e, idx)}
					onPaste={handlePaste}
					onChange={() => {}}
					className="w-12 h-12 text-center text-lg border border-gray-300 rounded focus:border-blue-500 outline-none"
					/>
				))}
			</div>
			<div className={`flex justify-center items-center ${loading ? 'opacity-100' : 'opacity-0'}`}>
				<Spinner />
			</div>
		</div>
	);
};

export default TwoFactorInput;