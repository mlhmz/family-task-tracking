import React from 'react';
import { ReactSVG } from 'react-svg';

function Logo() {
  return (
    <ReactSVG
      src="icons/wheelchair.svg"
      className="p-1 w-10 stroke-lime-600 hover:stroke-lime-300"
    />
  );
}

export default Logo;
