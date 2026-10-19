import { CsvImportError, deckNameFromFileName, parseFlashcardsCsv } from '../src/utils/csv';

describe('parseFlashcardsCsv', () => {
  it('parses a semicolon separated file', () => {
    const result = parseFlashcardsCsv(
      'Question;Answer\nThis is the question; This is the <b>answer</b>\nSecond;Deux',
    );

    expect(result.delimiter).toBe(';');
    expect(result.cards).toEqual([
      { question: 'This is the question', answer: 'This is the <b>answer</b>' },
      { question: 'Second', answer: 'Deux' },
    ]);
  });

  it('parses a tab separated file with a BOM and CRLF line endings', () => {
    const result = parseFlashcardsCsv('\ufeffQUESTION\tanswer\r\nQ1\tA1\r\n');

    expect(result.delimiter).toBe('\t');
    expect(result.cards).toEqual([{ question: 'Q1', answer: 'A1' }]);
  });

  it('skips rows missing a question or an answer', () => {
    const result = parseFlashcardsCsv('Question;Answer\nQ1;A1\nQ2;\n;A3\n\n');

    expect(result.cards).toHaveLength(1);
    expect(result.skippedRows).toBe(2);
  });

  it('rejects an unsupported delimiter', () => {
    expect(() => parseFlashcardsCsv('Question,Answer\nQ1,A1')).toThrow(CsvImportError);
  });

  it('rejects missing headers', () => {
    expect(() => parseFlashcardsCsv('Front;Back\nQ1;A1')).toThrow(/Missing required headers/);
  });

  it('rejects an empty file', () => {
    expect(() => parseFlashcardsCsv('   ')).toThrow(CsvImportError);
  });
});

describe('deckNameFromFileName', () => {
  it('drops the extension', () => {
    expect(deckNameFromFileName('Spanish verbs.csv')).toBe('Spanish verbs');
  });

  it('falls back when no name is available', () => {
    expect(deckNameFromFileName(null)).toBe('Imported deck');
  });
});
