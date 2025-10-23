import React from 'react';
import { playHighlightSound, playSelectSound } from '../services/audioService';
import { ArrowLeftIcon } from './icons';

interface SettingsSelectorProps {
  activeSetting: string;
  onSelectSetting: (settingId: string) => void;
  onBack: () => void;
}

const SETTINGS_ITEMS = [
  { id: 'retroAchievements', title: 'RetroAchievements' },
  { id: 'gamesSettings', title: 'Games Settings' },
  { id: 'controllerSettings', title: 'Controller Settings' },
  { id: 'uiSettings', title: 'UI Settings' },
  { id: 'soundSettings', title: 'Sound Settings' },
  { id: 'networkSettings', title: 'Network Settings' },
  { id: 'scrape', title: 'Scrape' },
  { id: 'updatesDownloads', title: 'Updates & Downloads' },
  { id: 'retroArchSettings', title: 'RetroArch Settings' },
  { id: 'systemSettings', title: 'System Settings' },
  { id: 'back', title: 'Quit' },
];

const SettingsSelector: React.FC<SettingsSelectorProps> = ({ activeSetting, onSelectSetting, onBack }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = React.useState(() => {
    const initialIndex = SETTINGS_ITEMS.findIndex(item => item.id === activeSetting);
    return initialIndex === -1 ? 0 : initialIndex;
  });

  React.useEffect(() => {
    containerRef.current?.focus();
  }, []);

  React.useEffect(() => {
    const newIndex = SETTINGS_ITEMS.findIndex(item => item.id === activeSetting);
    if (newIndex !== -1 && newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  }, [activeSetting, activeIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') {
      onBack();
      return;
    }

    if (e.key === 'Enter') {
      const currentItem = SETTINGS_ITEMS[activeIndex];
      if (currentItem.id === 'back') {
        onBack();
      } else {
        playSelectSound();
      }
      return;
    }

    let nextIndex = activeIndex;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (activeIndex + 1) % SETTINGS_ITEMS.length;
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (activeIndex - 1 + SETTINGS_ITEMS.length) % SETTINGS_ITEMS.length;
    }

    if (nextIndex !== activeIndex) {
      setActiveIndex(nextIndex);
      const nextItem = SETTINGS_ITEMS[nextIndex];
      if (nextItem.id !== 'back') {
        onSelectSetting(nextItem.id);
      } else {
        playHighlightSound();
      }
    }
  };

  const VISIBLE_ITEMS_RADIUS = 6;
  const totalVisibleItems = VISIBLE_ITEMS_RADIUS * 2 + 1;

  return (
    <aside
      ref={containerRef}
      className="w-80 h-full p-4 flex-shrink-0 flex flex-col justify-center items-center overflow-hidden focus:outline-none"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      aria-label="Settings Menu Carousel"
      role="region"
    >
      <div style={{ perspective: '1000px' }} className="w-full h-full flex items-center justify-center">
        <div style={{ transformStyle: 'preserve-3d' }} className="relative w-full h-full">
          {Array.from({ length: totalVisibleItems }).map((_, i) => {
            const delta = i - VISIBLE_ITEMS_RADIUS;
            const itemIndex = (activeIndex + delta + SETTINGS_ITEMS.length) % SETTINGS_ITEMS.length;
            const item = SETTINGS_ITEMS[itemIndex];
            
            if (!item) return null;

            const isSelected = delta === 0;

            const ANGLE_PER_ITEM = 18;
            const RADIUS_Y = 280;
            const RADIUS_X = 80;
            
            const angleDeg = delta * ANGLE_PER_ITEM;
            const angleRad = angleDeg * (Math.PI / 180);

            const y = RADIUS_Y * Math.sin(angleRad);
            const x = RADIUS_X * (Math.cos(angleRad) - 1);
            const scale = Math.max(0, 1 - Math.abs(delta) * 0.15);
            const opacity = Math.pow(0.7, Math.abs(delta));
            const zIndex = SETTINGS_ITEMS.length - Math.abs(delta);

            const itemStyle: React.CSSProperties = {
                transform: `translateY(${y}px) translateX(${x}px) scale(${scale})`,
                position: 'absolute',
                top: 'calc(50% - 45px)',
                left: 'calc(50% - 120px)',
                width: '240px',
                height: '90px',
                opacity: isSelected ? 1 : opacity,
                zIndex: zIndex,
                transition: 'transform 0.5s ease-out, opacity 0.5s ease-out',
            };

            return (
              <div key={`${item.id}-${delta}`} style={itemStyle}>
                <button
                  onClick={() => {
                    if (isSelected) {
                      if (item.id === 'back') onBack();
                    } else {
                      setActiveIndex(itemIndex);
                      if (item.id !== 'back') {
                         onSelectSetting(item.id);
                      } else {
                        playHighlightSound();
                      }
                    }
                  }}
                  tabIndex={-1}
                  className={`w-full h-full flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none 
                  ${item.id === 'back'
                    ? `rounded-2xl p-2 ${isSelected ? 'bg-brand-primary/50 scale-110 shadow-neon-purple' : 'bg-brand-bg/50'}`
                    : `font-display uppercase text-center p-3 ${isSelected ? 'opacity-100 text-brand-accent drop-shadow-[0_0_8px_rgba(192,132,252,0.8)] scale-100 text-3xl' : 'opacity-100 text-brand-text-muted text-2xl'}`
                  }`}
                  aria-label={item.title}
                  aria-current={isSelected}
                >
                  {item.id === 'back' ? <ArrowLeftIcon /> : item.title}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default SettingsSelector;