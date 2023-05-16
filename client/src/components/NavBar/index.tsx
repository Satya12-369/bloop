import React, { useContext } from 'react';
import {
  Bug,
  CloseSign,
  Cog,
  DoorRight,
  Home,
  Magazine,
  Person,
} from '../../icons';
import { MenuListItemType } from '../ContextMenu';
import { deleteAuthCookie } from '../../utils';
import DropdownWithIcon from '../Dropdown/WithIcon';
import { UIContext } from '../../context/uiContext';
import { DeviceContext } from '../../context/deviceContext';
import { TabsContext } from '../../context/tabsContext';
import { gitHubLogout } from '../../services/api';

type Props = {
  isSkeleton?: boolean;
};

const NavBar = ({ isSkeleton }: Props) => {
  const {
    setBugReportModalOpen,
    setShouldShowWelcome,
    setGithubConnected,
    setSettingsOpen,
  } = useContext(UIContext);
  const { openLink, isSelfServe, os } = useContext(DeviceContext);
  const { tabs, setActiveTab, activeTab, handleRemoveTab } =
    useContext(TabsContext);

  return (
    <div
      className={`h-8 flex items-center gap-6 px-8 bg-bg-base fixed top-0 left-0 right-0 z-50 justify-between
       border-b border-bg-border backdrop-blur-8 select-none`}
      data-tauri-drag-region
    >
      <div
        className={`flex items-center justify-start h-full overflow-auto ${
          os.type === 'Darwin' ? 'ml-12' : ''
        }`}
      >
        {!isSkeleton &&
          tabs.map((t, i) => (
            <div
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 border-r ${
                i === 0 ? 'border-l' : ''
              } border-bg-border h-full flex items-center justify-center gap-2 ${
                activeTab === t.key
                  ? 'bg-bg-shade text-label-title'
                  : 'bg-bg-base text-label-base'
              } cursor-pointer`}
            >
              {t.name === 'Home' ? <Home sizeClassName="w-4 h-4" /> : t.name}
              {t.key !== 'initial' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveTab(t.key);
                  }}
                  className={`w-5 h-5 flex items-center justify-center text-label-base hover:text-label-title ${
                    activeTab !== t.key ? 'opacity-0' : ''
                  } relative top-px`}
                  disabled={activeTab !== t.key}
                >
                  <CloseSign sizeClassName="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
      </div>
      {!isSkeleton && (
        <div>
          <DropdownWithIcon
            items={[
              {
                text: 'Settings',
                icon: <Cog />,
                type: MenuListItemType.DEFAULT,
                onClick: () => setSettingsOpen(true),
              },
              {
                text: 'Documentation',
                icon: <Magazine />,
                type: MenuListItemType.DEFAULT,
                onClick: () => openLink('https://bloop.ai/docs'),
              },
              {
                text: 'Report a bug',
                icon: <Bug />,
                type: MenuListItemType.DEFAULT,
                onClick: () => setBugReportModalOpen(true),
              },
              {
                text: 'Sign out',
                icon: <DoorRight />,
                type: MenuListItemType.DEFAULT,
                onClick: () => {
                  setShouldShowWelcome(true);
                  deleteAuthCookie();
                  setGithubConnected(false);
                  if (!isSelfServe) {
                    gitHubLogout();
                  }
                },
              },
            ]}
            icon={<Person />}
            dropdownBtnClassName="-mr-4"
            btnSize="tiny"
            btnVariant="tertiary"
          />
        </div>
      )}
    </div>
  );
};
export default NavBar;
