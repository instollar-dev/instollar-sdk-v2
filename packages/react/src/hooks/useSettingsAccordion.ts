import { useCallback, useState } from 'react';

/**
 * Single-open accordion state for settings pages.
 * Section keys should be stable English strings (not translated titles).
 */
export function useSettingsAccordion(initialSection: string | null = null) {
  const [openSection, setOpenSection] = useState<string | null>(initialSection);

  const toggleSection = useCallback((section: string) => {
    setOpenSection((current) => (current === section ? null : section));
  }, []);

  const isSectionOpen = useCallback(
    (section: string) => openSection === section,
    [openSection],
  );

  return {
    openSection,
    setOpenSection,
    toggleSection,
    isSectionOpen,
  } as const;
}
