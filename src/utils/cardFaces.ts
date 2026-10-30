import { Card } from '../types';

/** The single place a session's direction is applied; both sides stay untouched HTML. */
export function cardFaces(
  card: Pick<Card, 'question' | 'answer'>,
  inverted: boolean,
): { front: string; back: string } {
  return inverted
    ? { front: card.answer, back: card.question }
    : { front: card.question, back: card.answer };
}

/** Stored sessions predate the field, so only an exact `true` counts as inverted. */
export function readInverted(value: unknown): boolean {
  return value === true;
}
