import { cardFaces, readInverted } from '../src/utils/cardFaces';

describe('cardFaces', () => {
  it('puts the question in front when not inverted', () => {
    const card = { question: 'Haus', answer: 'house' };

    expect(cardFaces(card, false)).toEqual({ front: 'Haus', back: 'house' });
  });

  it('puts the answer in front when inverted', () => {
    const card = { question: 'Haus', answer: 'house' };

    expect(cardFaces(card, true)).toEqual({ front: 'house', back: 'Haus' });
  });

  it('does not mutate the card', () => {
    const card = { question: 'Haus', answer: 'house' };

    cardFaces(card, true);

    expect(card).toEqual({ question: 'Haus', answer: 'house' });
  });

  it('passes HTML through untouched in both directions', () => {
    const card = { question: '<b>Haus</b> &amp; <i>Hof</i>', answer: 'a<br/>house' };

    expect(cardFaces(card, false)).toEqual({
      front: '<b>Haus</b> &amp; <i>Hof</i>',
      back: 'a<br/>house',
    });
    expect(cardFaces(card, true)).toEqual({
      front: 'a<br/>house',
      back: '<b>Haus</b> &amp; <i>Hof</i>',
    });
  });
});

describe('readInverted', () => {
  it('reads true as inverted', () => {
    expect(readInverted(true)).toBe(true);
  });

  it('reads a missing value as not inverted', () => {
    expect(readInverted(undefined)).toBe(false);
  });

  it('reads false as not inverted', () => {
    expect(readInverted(false)).toBe(false);
  });

  it('reads stray values as not inverted', () => {
    expect(readInverted('true')).toBe(false);
    expect(readInverted(1)).toBe(false);
    expect(readInverted(null)).toBe(false);
    expect(readInverted({})).toBe(false);
  });
});
