/**
 * Window.jsx
 *
 * This component represents a draggable window UI in MammothOS.
 * It dynamically adjusts size based on the "squared" prop and allows dragging.
 */

import { useState, useRef, cloneElement, useEffect } from "react";
import PropTypes from "prop-types";

const Window = ({ title, app, closeWindow, openPopup, squared, isGame = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const [position, setPosition] = useState(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      const SCREEN_WIDTH = window.innerWidth;
      const SCREEN_HEIGHT = window.innerHeight;
    
      let maxSize;
      if (isGame) {
        // Kare oyunlar için: ekranın %90'ı kadar, ama kare
        maxSize = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.9;

        setPosition({
          x: SCREEN_WIDTH / 2 - Math.min(maxSize, 650) / 2,
          y: SCREEN_HEIGHT / 2 - Math.min(maxSize, 550)  / 2,
        });

        console.log(Math.min(maxSize, 650))
        console.log(Math.min(maxSize, 550))
    
        setWindowSize({ width: Math.min(maxSize, 650), height: Math.min(maxSize, 550) });
        return;
      }
    
      const MAX_WIDTH = squared ? 420 : 650;
      const MAX_HEIGHT = squared ? 450 : 550;
    
      const newWidth = Math.min(MAX_WIDTH, SCREEN_WIDTH * 0.9);
      const newHeight = Math.min(MAX_HEIGHT, SCREEN_HEIGHT * 0.9);
    
      setPosition({
        x: SCREEN_WIDTH / 2 - newWidth / 2,
        y: SCREEN_HEIGHT / 2 - newHeight / 2,
      });
    
      setWindowSize({ width: newWidth, height: newHeight });
    };
  
    handleResize(); // initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [squared, isGame]);

  /**
   * Handles window dragging logic.
   */
  const handlePointerDown = (e) => {
    setIsDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
  
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
  
    let newX = Math.max(0, Math.min(screenWidth - windowSize.width, e.clientX - offset.current.x));
    let newY = Math.max(0, Math.min(screenHeight - windowSize.height, e.clientY - offset.current.y));
  
    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = () => setIsDragging(false);

  
  if (!position || !windowSize.width) return null;

  return (
    <div
      className={`fixed flex flex-col items-center px-[4px] py-[3px] bg-[#c0c0c0] border98 z-50`}
      style={{ left: position.x, top: position.y, width: `${windowSize.width}px`, height: `${windowSize.height}px` }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Window Header (Draggable) */}
      <div
        onPointerDown={handlePointerDown}
        className="bg-[#0000a8] w-full h-[25px] text-white pl-2 pr-1 text-[15px] flex items-center justify-between cursor-move"
      >
        {title}
        <div
          onClick={closeWindow}
          className="cursor-pointer flex items-center bg-[#c0c0c0] border98 h-[20px] w-[24px] justify-center font-bold text-[14px]"
        >
          <img className="-ml-[1px] w-[11px] h-[11px]" src="assets/close.svg" alt="Close" />
        </div>
      </div>

      {/* Window Content */}
      <div className={`bg-black my-auto`}
      style={{
        width: `${windowSize.width - 20}px`,  // padding veya margin'e göre
        height: `${windowSize.height - 50}px`, // başlık yüksekliği çıkar
      }}
      >
        {cloneElement(app, { openPopup, closeWindow })}
      </div>
    </div>
  );
};

Window.propTypes = {
  title: PropTypes.node.isRequired,
  app: PropTypes.node.isRequired,
  closeWindow: PropTypes.func.isRequired,
  openPopup: PropTypes.func.isRequired,
  squared: PropTypes.bool.isRequired,
  isGame: PropTypes.bool
};

export default Window;