export const categories = {
  categoriesScreen: {
    customSectionTitle: 'Custom categories',
    customSectionSubtitle: {
      one: '{count} available',
      other: '{count} available',
    },
    customEmptyHint: 'Your own categories will appear here.',
    defaultSectionTitle: 'Default categories',
    defaultSectionSubtitle: {
      one: '{count} built in',
      other: '{count} built in',
    },
    newCategoryButton: 'New category',
    categoryTileA11yLabel: 'Options for {name}',
  },
  categoryOptionsMenu: {
    deleteItem: 'Delete category',
  },
  // Two whole sentences, so no language has to join fragments; `name` is the user's own text.
  deleteCategoryAlert: {
    title: 'Delete category?',
    message: '"{name}" will be deleted.',
    messageWithDecks: {
      one: '"{name}" will be deleted. {count} deck will have no category.',
      other: '"{name}" will be deleted. {count} decks will have no category.',
    },
  },
  newCategoryScreen: {
    saveButtonA11yLabel: 'Save category',
    nameField: 'Name',
    colourLabel: 'Colour',
    iconLabel: 'Icon',
    // Characters typed over the most the name may have.
    nameCounter: '{length}/{max}',
    nameErrors: {
      empty: 'Enter a name.',
      tooLong: {
        one: 'Use {count} character or fewer.',
        other: 'Use {count} characters or fewer.',
      },
      duplicate: 'A category with this name already exists.',
    },
  },
  discardChangesAlert: {
    title: 'Discard changes?',
    message: 'This category has not been saved.',
  },
  // The Category tile at the top of the New category screen.
  tilePreview: {
    placeholder: 'Category name',
    a11yLabel: 'Preview: {name}',
    noNameA11yLabel: 'Preview: no name yet',
  },
  colourPicker: {
    a11yLabel: 'Colour picker',
    swatchA11yLabel: 'Colour {position} of {total}',
  },
  customColourSwatch: {
    a11yLabel: 'Custom colour',
    a11yHint: 'Opens the colour chooser',
  },
  iconPicker: {
    a11yLabel: 'Icon picker',
  },
  customColourDialog: {
    title: 'Custom colour',
    hueLabel: 'Hue',
    hueValue: '{value}°',
    saturationLabel: 'Saturation',
    brightnessLabel: 'Brightness',
    percentValue: '{value}%',
    previewA11yLabel: 'Colour preview {color}',
    tooDark: 'Too dark for the icon. Try a lighter colour.',
    useButton: 'Use colour',
  },
  categorySquare: {
    a11yLabel: 'Category: {name}',
  },
} as const;
