import { describe, expect, it } from 'vitest';
import { getMonday } from '../../src';

describe('getMonday', () => {
  it('should return the monday of the week', () => {
    const result = getMonday('2025-08-29');
    expect(result.getDay()).toStrictEqual(1);
    expect(result.getMonth()).toStrictEqual(7);
    expect(result.getFullYear()).toStrictEqual(2025);
  });

  it('should throw exception on invalid date', () => {
    expect(() => getMonday('hello')).toThrow();
  });
});
