import React from 'react';

interface DividerProps {
  // Define your props here
}

const Divider: React.FC<DividerProps> = ({  }) => {
  return (
	<div className='h-[3px] w-full bg-gray-100 block ' />
  );
};

export default Divider;