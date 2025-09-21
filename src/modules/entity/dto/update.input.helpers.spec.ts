import { toPrismaUpdateInput } from './update.input.helpers';

describe('toPrismaUpdateInput', () => {
  it('should filter out null and undefined values', () => {
    const input = {
      name: 'test',
      description: null,
      age: undefined,
      active: true,
      count: 0,
    };

    const result = toPrismaUpdateInput(input);

    expect(result).toEqual({
      name: 'test',
      active: true,
      count: 0,
    });
  });

  it('should return empty object for null/undefined input', () => {
    expect(toPrismaUpdateInput(null as any)).toEqual({});
    expect(toPrismaUpdateInput(undefined as any)).toEqual({});
  });

  it('should preserve falsy values except null and undefined', () => {
    const input = {
      name: '',
      count: 0,
      active: false,
      description: null,
      other: undefined,
    };

    const result = toPrismaUpdateInput(input);

    expect(result).toEqual({
      name: '',
      count: 0,
      active: false,
    });
  });

  it('should handle empty object', () => {
    const result = toPrismaUpdateInput({});
    expect(result).toEqual({});
  });
});
