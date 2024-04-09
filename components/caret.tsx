import React from "react";

interface CaretProps {
  offset: number;
}

const Caret: React.FC<CaretProps> = ({ offset }) => {
  const style = {
    left: `calc(${offset * 0.9}rem)`,
  };

  return (
    <span className="animate-blink h-full absolute ml-[-0.45rem]" style={style}>
      |
    </span>
  );
};

export default Caret;
