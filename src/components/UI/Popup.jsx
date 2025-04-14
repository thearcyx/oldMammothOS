/**
 * Popup.jsx
 *
 * Represents a draggable popup window for MammothOS notifications.
 * Displays a message, allows interaction, and optionally mints an NFT onchain.
 */

import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const Popup = ({ title, message, closePopup, gameName }) => {
  const [isDragging, setIsDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const [completion, setCompletion] = useState("");
  const [updatedOnchain, setUpdatedOnchain] = useState(false);

  const [position, setPosition] = useState(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      const SCREEN_WIDTH = window.innerWidth;
      const SCREEN_HEIGHT = window.innerHeight;
  
      const MAX_WIDTH = 400;
      const MAX_HEIGHT = 200;
  
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
  }, []);

  /** Handles mouse press for dragging */
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

  /** Plays a warning sound when the popup appears */
  const playNotificationSound = () => {
    const audio = new Audio("assets/audio/warning.mp3");
    audio.play().catch((error) => console.error("Audio playback failed:", error));
  };

  useEffect(() => {
    playNotificationSound();
  }, []);

  /** Closes the popup unless an operation is in progress */
  const handleClose = () => {
    if (!loading) closePopup();
  };

  /** Handles minting an NFT onchain */
  const updateOnchain = async () => {
    if (loading || !gameName) return;

    setCompletion("Minting is closed !");
    setLoading(false);
  };

  if (!position || !windowSize.width) return null;

  return (
    <div
      className="fixed flex flex-col items-center px-[4px] py-[3px] bg-[#c0c0c0] border98 z-50"
      style={{ left: position.x, top: position.y, width: `${windowSize.width}px`, height: `${windowSize.height}px` }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Header Bar (Draggable) */}
      <div
        onMouseDown={handlePointerDown}
        className="bg-[#0000a8] w-full h-[25px] text-white pl-2 pr-1 text-[15px] flex items-center justify-between cursor-move"
      >
        <p>MammothOS Message System</p>
        <div
          onClick={handleClose}
          className="cursor-pointer flex items-center bg-[#c0c0c0] border98 h-[20px] w-[24px] justify-center font-bold text-[14px]"
        >
          <img className="-ml-[1px] w-[11px] h-[11px]" src="assets/close.svg" alt="Close" />
        </div>
      </div>

      {/* Popup Content */}
      <div className="flex flex-col gap-2 w-full px-[20px] h-[150px] my-auto">
        <div className="flex gap-2 items-center">
          <img
            className="w-[32px] h-[32px]"
            src="https://win98icons.alexmeub.com/icons/png/media_player_stream_no.png"
            alt="Alert"
          />
          <p className="font-bold text-[19px]">{title}</p>
        </div>
        {completion || message}

        {/* Buttons */}
        <div className="flex gap-2 ml-auto mr-5 mt-auto mb-1">
          <div
            onClick={handleClose}
            className="cursor-pointer flex items-center bg-[#c0c0c0] border98 h-[25px] w-[100px] justify-center text-[14px]"
          >
            <p>Replay</p>
          </div>
          {!loading && !updatedOnchain && (
            <div
              onClick={updateOnchain}
              className="cursor-pointer flex items-center bg-[#c0c0c0] border98 h-[25px] w-[100px] justify-center text-[14px]"
            >
              <p>Save Onchain</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Popup.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.node.isRequired,
  closePopup: PropTypes.func.isRequired,
  gameName: PropTypes.string.isRequired,
};

export default Popup;