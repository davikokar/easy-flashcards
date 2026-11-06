export const shell = {
  appMenu: {
    triggerA11yLabel: 'App menu',
    exportSampleDeckItem: 'Export sample deck',
    settingsItem: 'Settings',
  },
  exportSampleDeckDialog: {
    title: 'Export sample deck',
    // Four paragraphs, separated by blank lines.
    body: 'This saves the same sample deck as two files, CSV and JSON. You are asked where to save each one and can cancel either to skip it.\n\nCSV: lines starting with # (title, description, category) are skipped on import, then a "question" / "answer" header and one card per row, separated here by semicolons (a comma, a tab or another single symbol also works).\n\nJSON: also brings back the title, description and category.\n\nBasic HTML such as <b>, <i> and <br /> is allowed on either side of a card.',
  },
  kebabMenu: {
    triggerA11yLabel: 'More options',
  },
  searchBar: {
    inputA11yLabel: 'Search text',
    closeButtonA11yLabel: 'Close search',
  },
} as const;
