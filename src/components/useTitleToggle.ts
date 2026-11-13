import { useCallback, useMemo, useState } from 'react';
import type { AccessibilityActionEvent, AccessibilityActionInfo } from 'react-native';
import { useT } from '../i18n/I18nProvider';

const TOGGLE_TITLE = 'toggleTitle';

/**
 * Local expanded state for a card's title, with the long press and the accessibility action that
 * flip it. The state belongs to the mounted card, so it never outlives or crosses to another item.
 */
export function useTitleToggle() {
  const t = useT();
  const [expanded, setExpanded] = useState(false);
  const onLongPress = useCallback(() => setExpanded(value => !value), []);

  const accessibilityActions = useMemo<AccessibilityActionInfo[]>(
    () => [
      {
        name: TOGGLE_TITLE,
        label: expanded
          ? t('common.titleToggle.collapseA11yLabel')
          : t('common.titleToggle.expandA11yLabel'),
      },
    ],
    [expanded, t],
  );

  const onAccessibilityAction = useCallback((event: AccessibilityActionEvent) => {
    if (event.nativeEvent.actionName === TOGGLE_TITLE) {
      setExpanded(value => !value);
    }
  }, []);

  return { expanded, onLongPress, accessibilityActions, onAccessibilityAction };
}
