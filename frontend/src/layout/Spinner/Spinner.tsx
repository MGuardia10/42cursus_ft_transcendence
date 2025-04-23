import React from 'react';

const Spinner: React.FC = () => {
  return (
	<div className="flex items-center justify-center h-full w-full">
	  <div className="w-8 h-8 border-4 border-t-transparent border-gray-500 rounded-full animate-spin" />
	</div>
  );
};

export default Spinner;