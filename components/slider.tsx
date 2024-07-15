import React from 'react';

interface SliderProps {
	sliderRef: React.RefObject<HTMLInputElement>;
	min: number;
	max: number;
	value: number;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Slider: React.FC<SliderProps> = ({ sliderRef, min, max, value, onChange }) => {
	return (
		<input
			type="range"
			ref={sliderRef}
			min={min}
			max={max}
			value={value}
			onChange={onChange}
		/>
	);
};

export default Slider;