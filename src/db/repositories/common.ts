export function formatRow<T extends { id: number | string }>(row: T): T & { id: string } {
  return {
    ...row,
    id: String(row.id),
  };
}

export function parseId(id: string | number): number {
  const num = typeof id === 'number' ? id : parseInt(id, 10);
  return isNaN(num) ? 0 : num;
}
