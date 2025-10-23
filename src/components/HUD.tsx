import React from 'react';

const HUD: React.FC = () => {
  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      color: 'white',
      zIndex: 100
    }}>
      <p>FPS: 60</p>
    </div>
  );
};

export default HUD;