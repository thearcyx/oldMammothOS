/**
 * Wallet.jsx
 *
 * This component represents the MammothOS Wallet UI.
 * It fetches the user's wallet data and displays owned game badges.
 * Users can claim their wallet (Coming Soon).
 */

import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const Wallet = ({ closeWallet }) => {
  const [isDragging, setIsDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const [wallet, setWallet] = useState(null);
  const [claimWallet, setClaimWallet] = useState(false);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      const SCREEN_WIDTH = window.innerWidth;
      const SCREEN_HEIGHT = window.innerHeight;
  
      const MAX_WIDTH = 250;
      const MAX_HEIGHT = 280;
  
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

  /**
   * Handles window dragging.
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

  /**
   * Fetches wallet data on component mount.
   */
  useEffect(() => {
    const getWallet = async () => {
    };
    getWallet();
  }, []);

  if (!position || !windowSize.width) return null;

  return (
    <div
      className="fixed flex flex-col items-center px-[4px] py-[3px] bg-[#c0c0c0] border98 z-30"
      style={{ left: position.x, top: position.y, width: `${windowSize.width}px`, height: `${windowSize.height}px` }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Window Header (Draggable) */}
      <div
        onMouseDown={handlePointerDown}
        className="bg-[#0000a8] w-full h-[25px] text-white pl-2 pr-1 text-[15px] flex items-center justify-between cursor-move"
      >
        <p className="tracking-wider flex items-center gap-1">
          <img src="https://win98icons.alexmeub.com/icons/png/briefcase-2.png" className="w-[18px] h-[18px]" alt="Wallet Icon" />
          My Wallet
        </p>
        <div
          onClick={closeWallet}
          className="cursor-pointer flex items-center bg-[#c0c0c0] border98 h-[20px] w-[24px] justify-center font-bold text-[14px]"
        >
          <img className="-ml-[1px] w-[11px] h-[11px]" src="assets/close.svg" alt="Close" />
        </div>
      </div>

      {/* Wallet Content */}
      <div
        className="bg-[#e0e0e0] w-[230px] h-[230px] my-auto flex flex-col items-center justify-center gap-0.5"
        style={{
          boxShadow:
            "inset 1px 1px #0a0a0a, inset -1px -1px #fff, inset 2px 2px grey, inset -2px -2px #dfdfdf",
        }}
      >
        {/* Claim Wallet Button */}
        <div
          onMouseEnter={() => setClaimWallet(true)}
          onMouseLeave={() => setClaimWallet(false)}
          className="cursor-pointer flex items-center bg-[#c0c0c0] border98 h-[35px] w-[130px] justify-center text-[14px] group"
        >
          <p className={`transition-opacity ${claimWallet ? "opacity-100" : "opacity-50"}`}>
            {claimWallet ? "Coming Soon!" : "Claim your wallet"}
          </p>
        </div>

        {/* Wallet Info */}
        <div className="flex flex-col items-center">
          <p className="w-[160px] text-center mt-[15px]">Play games to unlock badges!</p>

          {/* Wallet Status */}
          {!wallet ? (
            <p>Loading wallet...</p>
          ) : (
            <div className="flex mt-[10px] gap-2">
              {[
                { id: 1, src: "assets/icons/tetris.png" },
                { id: 2, src: "assets/icons/mammoths.png" },
                { id: 3, src: "assets/icons/mockey.png" },
              ].map(({ id, src }) => (
                <div key={id} className="w-[52px] h-[52px]">
                  <img className={`w-[48px] h-[48px] ${wallet.ownedMammothOSBadges.includes(id) ? "" : "grayscale"}`} src={src} alt={`Badge ${id}`} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Wallet.propTypes = {
  closeWallet: PropTypes.func.isRequired,
};

export default Wallet;