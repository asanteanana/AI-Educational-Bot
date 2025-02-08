import React from "react";

const ResponseCard = ({ text, onPlayAudio }) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md mt-4">
      <p className="text-lg">{text}</p>
      <button
        onClick={onPlayAudio}
        className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        Play Audio
      </button>
    </div>
  );
};

export default ResponseCard;
