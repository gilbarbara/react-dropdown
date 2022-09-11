import { getCursor, getOptionData, isNumber, matchOptions, parseNumber } from '~/modules/helpers';

const options = [
  { label: '💍 One ring to rule them all', value: 'rule' },
  { label: '9 rings', value: 9, disabled: true },
  { label: 'One Ring to find them', value: 'find' },
  { label: 'One Ring to bring them all', value: 'bring' },
  { label: 'In the darkness bind them', value: 'bind', disabled: true },
];

describe('getOptionData', () => {
  it.each([
    { input: { label: 'A', value: 'a' }, path: 'label', expected: 'A' },
    { input: { label: <p>AA</p>, value: 'a' }, path: 'label', expected: 'AA' },
    { input: { label: 'AB', value: 'a' }, path: 'length', expected: '' },
  ])('should return $expected for path "$path"', ({ expected, input, path }) => {
    // @ts-expect-error
    expect(getOptionData(input, path)).toBe(expected);
  });
});

describe('getCursor', () => {
  it.each([
    { cursor: null, type: 'down', expected: 0 },
    { cursor: 0, type: 'down', expected: 2 },
    { cursor: 2, type: 'down', expected: 3 },
    { cursor: 3, type: 'down', expected: 0 },
    { cursor: null, type: 'up', expected: 3 },
    { cursor: 3, type: 'up', expected: 2 },
    { cursor: 2, type: 'up', expected: 0 },
    { cursor: 0, type: 'up', expected: 3 },
  ])(
    'should return $expected for cursor: $cursor and type: $type',
    ({ cursor, expected, type }) => {
      expect(getCursor(cursor, type as 'down' | 'up', options)).toBe(expected);
    },
  );

  it('should return the fallback', () => {
    // @ts-ignore
    expect(getCursor(0)).toBe(0);
  });
});

describe('isNumber', () => {
  it.each([
    { input: '1px', expected: false },
    { input: 1, expected: true },
  ])('should return $expected for $input', ({ expected, input }) => {
    expect(isNumber(input)).toBe(expected);
  });
});

describe('matchOptions', () => {
  it.each([
    { input: 'ru', expected: true, strict: false },
    { input: 'ru', expected: false, strict: true },
    { input: 9, expected: true, strict: true },
    { input: 'ram', expected: false, strict: false },
  ])('should return $expected for $input using strict: $strict', ({ expected, input, strict }) => {
    expect(matchOptions(options, input, strict)).toBe(expected);
  });
});

describe('parseNumber', () => {
  it.each([
    { input: '1px', expected: 1 },
    { input: 2, expected: 2 },
  ])('should parse $input to $expected', ({ expected, input }) => {
    expect(parseNumber(input)).toBe(expected);
  });
});
