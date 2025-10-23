/// <reference types="react" />
import React, { useState } from 'react';
import Modal from './Modal';
import SettingsDetailView from './SettingsDetailView';
import type { System, Game } from '../types';
import SettingsSelector from './SettingsSelector';

type ScrapeSource = 'ScreenScraper' | 'TheGamesDB';

interface SettingsModalProps {
  onClose: () => void;
  systems: System[];
  games: Game[];
  onDeleteSystem: (systemId: string) => void;
  onDeleteGame: (gameId: number) => void;
  onUpdateLibrary: () => Promise<void>;
  isUpdatingLibrary: boolean;
  onScrape: (source: ScrapeSource) => void;
  isScraping: boolean;
  scrapingStatus: string;
  onUpdateGameBoxArt: (gameId: number, newUrl: string) => void;
  onScanForBoxArt: (files: FileList) => void;
  isScanningArt: boolean;
  scanStatus: string;
}

const SettingsModal: React.FC<SettingsModalProps> = (props) => {
  const { onClose } = props;
  const [activeSetting, setActiveSetting] = useState('gamesSettings');

  return (
    <Modal title="Settings" onClose={onClose}>
      <div className="flex gap-6 min-h-[60vh]">
        <SettingsSelector
          activeSetting={activeSetting}
          onSelectSetting={setActiveSetting}
          onBack={onClose}
        />
        <div className="flex-grow">
          <SettingsDetailView activeSetting={activeSetting} {...props} />
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
