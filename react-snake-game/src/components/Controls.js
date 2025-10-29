import React from "react";

export default function Controls({ onDirection }) {
  return (
    <div className="touch-controls" aria-hidden="false">
      <div className="row">
        <button className="arrow" onTouchStart={() => onDirection("ArrowUp")} onMouseDown={() => onDirection("ArrowUp")}>↑</button>
        <button className="arrow" onTouchStart={() => onDirection("ArrowLeft")} onMouseDown={() => onDirection("ArrowLeft")}>←</button>
        <button className="arrow" onTouchStart={() => onDirection("ArrowDown")} onMouseDown={() => onDirection("ArrowDown")}>↓</button>
        <button className="arrow" onTouchStart={() => onDirection("ArrowRight")} onMouseDown={() => onDirection("ArrowRight")}>→</button>
      </div>
    </div>
  );
}
