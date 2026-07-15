import type { ColumnDef } from './Table';

let rowIdSeed = 0;

/** Unique, monotonically increasing numeric row id (Date.now()-based). */
export function nextRowId(): number {
  rowIdSeed = Math.max(rowIdSeed + 1, Date.now());
  return rowIdSeed;
}

export function createDefaultRow(columns: ColumnDef[]): Record<string, any> {
  const row: Record<string, any> = { id: nextRowId() };
  for (const column of columns) {
    row[column.key] =
      column.defaultValue !== undefined
        ? column.defaultValue
        : column.type === 'number'
          ? 0
          : '';
  }
  return row;
}

export function stripRowIds(rows: Record<string, any>[]): Record<string, any>[] {
  return rows.map(({ id: _id, ...rest }) => rest);
}

/** RFC 4180-style escaping: double-quote when the value contains `"`, `,` or newlines. */
export function csvEscape(value: unknown): string {
  const text = value === null || value === undefined ? '' : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function rowsToCSV(columns: ColumnDef[], rows: Record<string, any>[]): string {
  const header = columns.map((column) => csvEscape(column.label)).join(',');
  const lines = rows.map((row) => columns.map((column) => csvEscape(row[column.key])).join(','));
  return [header, ...lines].join('\n');
}
