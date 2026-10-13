import * as Dialog from '@radix-ui/react-dialog';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';

export default function MobileNavigation({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="navigation-backdrop fixed inset-0 z-40 bg-black/45 backdrop-blur-sm" />
      <Dialog.Content
        className="navigation-drawer fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] outline-none"
        inert={!open}
        aria-describedby={undefined}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          document.getElementById('sidebar-toggle')?.focus();
        }}
      >
        <Dialog.Title className="sr-only">{t('navigation.label')}</Dialog.Title>
        <Sidebar isOpen onClose={onClose} />
      </Dialog.Content>
    </Dialog.Portal>
  );
}
