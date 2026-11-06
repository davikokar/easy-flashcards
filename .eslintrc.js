// ADR-0020 guard: UI text belongs in the catalogue, not in the component.
const LETTER = '[A-Za-z]';
const TEXT_PROPS =
  '/^(accessibilityLabel|accessibilityHint|title|label|placeholder|message|actionLabel|searchLabel|inputLabel|description|caption|subtitle|text)$/';

const letterLiteral = `Literal[raw=/^["'].*${LETTER}/]`;
const letterTemplate = `TemplateLiteral:has(TemplateElement[value.raw=/${LETTER}/])`;
const textNode = `:matches(${letterLiteral}, ${letterTemplate})`;
const branch = ':matches(ConditionalExpression, LogicalExpression)';

// Text reached directly, or through up to two levels of ?: and &&/||/??.
const reachable = root =>
  [
    `${root} > ${textNode}`,
    `${root} > ${branch} > ${textNode}`,
    `${root} > ${branch} > ${branch} > ${textNode}`,
  ].join(', ');

const textProp = `JSXAttribute[name.name=${TEXT_PROPS}]`;
const alertCall =
  "CallExpression[callee.object.name='Alert'][callee.property.name='alert']";

module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      // Locales, utils/i18n.ts and tests are outside these globs, so they are exempt.
      files: ['src/screens/**', 'src/components/**', 'src/navigation/**'],
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            selector: `JSXText[value=/${LETTER}/]`,
            message: 'Text written in JSX is not translatable (ADR-0020). Use t(...).',
          },
          {
            selector: `${reachable(textProp)}, ${reachable(`${textProp} > JSXExpressionContainer`)}`,
            message: 'UI text must come from the catalogue via t(...) (ADR-0020).',
          },
          {
            selector: `${reachable('JSXElement > JSXExpressionContainer')}, ${reachable('JSXFragment > JSXExpressionContainer')}`,
            message: 'Text written in JSX is not translatable (ADR-0020). Use t(...).',
          },
          {
            selector: reachable(`Property[key.name=${TEXT_PROPS}]`),
            message: 'UI text must come from the catalogue via t(...) (ADR-0020).',
          },
          {
            selector: reachable(alertCall),
            message: 'Alert text must come from the catalogue via t(...) (ADR-0020).',
          },
        ],
      },
    },
  ],
};
