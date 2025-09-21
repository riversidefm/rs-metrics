export function toPrismaUpdateInput<T extends Record<string, any>>(
  input: T,
): Partial<T> {
  const updateData: Partial<T> = {};

  for (const key in input) {
    const value = input[key];
    if (value !== null && value !== undefined) {
      updateData[key] = value;
    }
  }

  return updateData;
}
