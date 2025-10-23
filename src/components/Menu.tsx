import React from 'react';

interface MenuProps {
  onNavigate: (section: string) => void;
}

const Menu: React.FC<MenuProps> = ({ onNavigate }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 100
    }}>
      <div style={{ color: 'white', fontSize: '24px', textAlign: 'center' }}>
        <h1>SPACE MENU</h1>
        <button onClick={() => onNavigate('games')}>Games</button>
        <button onClick={() => onNavigate('settings')}>Settings</button>
      </div>
    </div>
  );
};

export default Menu;