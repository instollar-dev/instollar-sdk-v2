import { Add, ArrowDown2, ArrowLeft2, ArrowRight2, CloseCircle, Trash } from 'iconsax-react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { useClickOutside } from '../hooks/useClickOutside';
import { useFloatingPosition } from '../hooks/useFloatingPosition';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { cn } from '../utils/cn';
import { iconPaint } from '../utils/iconPaint';
import { toSelectOptions } from '../utils/toSelectOptions';
import { Select } from './Select';
import { createDefaultRow, rowsToCSV, stripRowIds } from './tableUtils';

export type CellType =
  | 'text'
  | 'number'
  | 'select'
  | 'date'
  | 'email'
  | 'tel'
  | 'readonly'
  | 'string'
  | 'display';

export interface ColumnOption {
  label: string;
  value: string | number;
}

export interface ColumnDef {
  key: string;
  label: string;
  type?: CellType;
  placeholder?: string;
  options?: (string | number | ColumnOption)[];
  align?: 'left' | 'center' | 'right';
  width?: string;
  minWidth?: string;
  editable?: boolean;
  renderCell?: (
    row: Record<string, any>,
    rowIndex: number,
    onChange: (value: any) => void,
  ) => ReactNode;
  component?: React.ComponentType<{
    row: Record<string, any>;
    rowIndex: number;
    value: any;
    onChange: (value: any) => void;
  }>;
  renderHeader?: () => ReactNode;
  validate?: (value: any) => string | null;
  defaultValue?: any;
  format?: (value: any, row: Record<string, any>) => string;
  cellClassName?: string;
  headerClassName?: string;
  cellBackgroundClassName?: string;
  renderExtendedCell?: (
    row: Record<string, any>,
    rowIndex: number,
    isOpen: boolean,
    onToggle: () => void,
    cellRef: React.RefObject<HTMLTableCellElement | null>,
  ) => ReactNode;
  extendedCellControlled?: boolean;
  extendedCellOpen?: (rowIndex: number) => boolean;
  extraCells?: Array<{
    content: ReactNode;
    className?: string;
    align?: 'left' | 'center' | 'right';
  }>;
}

export interface TableLabels {
  details?: string;
  serialNumber?: string;
  action?: string;
  pageOf?: (page: number, total: number) => string;
  rows?: string;
}

export interface TableProps {
  columns: ColumnDef[];
  rows?: Record<string, any>[];
  onRowsChange?: (rows: Record<string, any>[]) => void;
  showSerialNumbers?: boolean;
  showDeleteButton?: boolean;
  editable?: boolean;
  showInlineDelete?: boolean;
  addRowText?: string;
  emptyMessage?: string;
  onRowDelete?: (rowIndex: number) => void;
  footer?: ReactNode;
  onDataRequest?: (data: Record<string, any>[]) => void;
  extendedCellZIndex?: number;
  extendedCellContainer?: HTMLElement;
  paginated?: boolean;
  currentPage?: number;
  totalPages?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  showRowsPerPage?: boolean;
  customPagination?: ReactNode;
  hideHorizontalBorders?: boolean;
  hideVerticalBorders?: boolean;
  hideTopBorder?: boolean;
  hideBottomBorder?: boolean;
  mobileResponsive?: boolean;
  mobileColumnsCount?: number;
  getRowClassName?: (row: Record<string, any>, index: number) => string;
  className?: string;
  tableClassName?: string;
  theadClassName?: string;
  tbodyClassName?: string;
  trClassName?: string;
  thClassName?: string;
  tdClassName?: string;
  minWidth?: string;
  labels?: TableLabels;
}

export interface TableHandle {
  getData: () => Record<string, any>[];
  getDataWithoutIds: () => Record<string, any>[];
  validate: () => {
    isValid: boolean;
    errors: Array<{ rowIndex: number; field: string; message: string }>;
  };
  getRowCount: () => number;
  addRow: () => void;
  clearRows: () => void;
  getRow: (index: number) => Record<string, any> | undefined;
  updateRow: (index: number, data: Partial<Record<string, any>>) => void;
  exportJSON: () => string;
  exportCSV: () => string;
}

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

const alignClasses: Record<NonNullable<ColumnDef['align']>, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

function alignClass(align?: 'left' | 'center' | 'right') {
  return align ? alignClasses[align] : 'text-left';
}

function autoResizeTextarea(el: HTMLTextAreaElement) {
  el.style.height = 'auto';
  el.style.height = `${Math.max(24, el.scrollHeight)}px`;
}

const inputBaseClass =
  'w-full border-none bg-transparent text-open-regular-p text-foreground outline-none placeholder:text-muted';

/* ------------------------------------------------------------------ */
/* Extended cell portal                                                */
/* ------------------------------------------------------------------ */

function ExtendedCellPortal({
  cellRef,
  container,
  zIndex,
  children,
}: {
  cellRef: RefObject<HTMLTableCellElement | null>;
  container?: HTMLElement;
  zIndex: number;
  children: ReactNode;
}) {
  const [rect, setRect] = useState<{ top: number; left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const update = () => {
      const cell = cellRef.current;
      if (!cell) return;
      const bounds = cell.getBoundingClientRect();
      setRect({ top: bounds.bottom, left: bounds.left, width: bounds.width });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [cellRef]);

  if (!rect || typeof document === 'undefined') return null;

  const style: CSSProperties = {
    position: 'fixed',
    top: rect.top,
    left: rect.left,
    width: rect.width,
    zIndex,
  };

  return createPortal(<div style={style}>{children}</div>, container ?? document.body);
}

/* ------------------------------------------------------------------ */
/* Mobile detail modal (internal — intentionally not a public Modal)   */
/* ------------------------------------------------------------------ */

function TableDetailModal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <span className="text-open-bold-p text-foreground">{title}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer text-muted transition-colors hover:text-foreground"
          >
            <CloseCircle size={20} color={iconPaint.current} aria-hidden />
          </button>
        </div>
        <div className="flex min-h-0 flex-col gap-4 overflow-y-auto p-6">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

/* ------------------------------------------------------------------ */
/* Rows-per-page dropdown (portal + viewport collision handling)       */
/* ------------------------------------------------------------------ */

function RowsPerPageDropdown({
  rowsPerPage,
  rowsLabel,
  onSelect,
}: {
  rowsPerPage: number;
  rowsLabel: string;
  onSelect: (value: number) => void;
}) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const position = useFloatingPosition(anchorRef, open, 140);

  const close = useCallback(() => setOpen(false), []);
  useClickOutside([anchorRef, menuRef], close, open);

  const menu =
    open && position ? (
      <div
        ref={menuRef}
        style={{
          position: 'fixed',
          left: position.left,
          width: position.width,
          zIndex: 2147483646,
          ...(position.placement === 'bottom'
            ? { top: position.top }
            : { bottom: position.bottom }),
        }}
        className="overflow-hidden rounded-lg border border-gray-100 bg-white py-1 shadow-lg"
      >
        {ROWS_PER_PAGE_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              onSelect(option);
              setOpen(false);
            }}
            className={cn(
              'block w-full cursor-pointer px-3 py-2 text-left text-open-regular-tiny transition-colors hover:bg-gray-50',
              option === rowsPerPage ? 'font-semibold text-primary' : 'text-foreground',
            )}
          >
            {option} rows
          </button>
        ))}
      </div>
    ) : null;

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex cursor-pointer items-center gap-1.5 rounded-md border border-gray-100 px-3 py-1.5 text-open-regular-tiny text-foreground transition-colors hover:bg-gray-50"
      >
        <span>
          {rowsLabel}: {rowsPerPage} rows
        </span>
        <ArrowDown2
          size={14}
          color={iconPaint.muted}
          className={cn('transition-transform duration-200', open && 'rotate-180')}
          aria-hidden
        />
      </button>
      {typeof document !== 'undefined' && menu ? createPortal(menu, document.body) : null}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Table                                                               */
/* ------------------------------------------------------------------ */

const Table = forwardRef<TableHandle, TableProps>(function Table(
  {
    columns,
    rows,
    onRowsChange,
    showSerialNumbers = true,
    showDeleteButton = false,
    editable = true,
    showInlineDelete = false,
    addRowText = 'Add another row',
    emptyMessage,
    onRowDelete,
    footer,
    onDataRequest,
    extendedCellZIndex = 50,
    extendedCellContainer,
    paginated = false,
    currentPage = 1,
    totalPages = 1,
    rowsPerPage = 10,
    onPageChange,
    onRowsPerPageChange,
    showRowsPerPage = true,
    customPagination,
    hideHorizontalBorders = false,
    hideVerticalBorders = false,
    hideTopBorder = false,
    hideBottomBorder = false,
    mobileResponsive = true,
    mobileColumnsCount = 2,
    getRowClassName,
    className,
    tableClassName,
    theadClassName,
    tbodyClassName,
    trClassName,
    thClassName,
    tdClassName,
    minWidth = '600px',
    labels,
  },
  ref,
) {
  const isControlled = rows !== undefined;
  const [internalRows, setInternalRows] = useState<Record<string, any>[]>(() => [
    createDefaultRow(columns),
  ]);
  const currentRows = isControlled ? (rows as Record<string, any>[]) : internalRows;

  const [cellErrors, setCellErrors] = useState<Record<number, Record<string, string>>>({});
  const [extendedOpen, setExtendedOpen] = useState<Record<string, boolean>>({});
  const [detailRowIndex, setDetailRowIndex] = useState<number | null>(null);

  const extendedCellRefs = useRef(new Map<string, RefObject<HTMLTableCellElement | null>>());

  const isMobileViewport = useMediaQuery('(max-width: 767px)');
  const isMobile = mobileResponsive && isMobileViewport;

  const visibleColumns = isMobile ? columns.slice(0, mobileColumnsCount) : columns;
  const showSerialColumn = showSerialNumbers && !isMobile;
  const showInlineDeleteColumn = showInlineDelete && currentRows.length > 1;

  const detailsLabel = labels?.details ?? 'Details';
  const serialLabel = labels?.serialNumber ?? 'S/N';
  const actionLabel = labels?.action ?? 'Action';
  const rowsLabel = labels?.rows ?? 'Rows';
  const pageOfLabel = labels?.pageOf ?? ((page: number, total: number) => `Page ${page} of ${total}`);

  const commitRows = useCallback(
    (next: Record<string, any>[]) => {
      if (!isControlled) setInternalRows(next);
      onRowsChange?.(next);
    },
    [isControlled, onRowsChange],
  );

  const handleCellChange = useCallback(
    (rowIndex: number, column: ColumnDef, value: any) => {
      const next = currentRows.map((row, index) =>
        index === rowIndex ? { ...row, [column.key]: value } : row,
      );
      commitRows(next);

      if (column.validate) {
        const message = column.validate(value);
        setCellErrors((previous) => {
          const rowErrors = { ...(previous[rowIndex] ?? {}) };
          if (message) {
            rowErrors[column.key] = message;
          } else {
            delete rowErrors[column.key];
          }
          const nextErrors = { ...previous };
          if (Object.keys(rowErrors).length > 0) {
            nextErrors[rowIndex] = rowErrors;
          } else {
            delete nextErrors[rowIndex];
          }
          return nextErrors;
        });
      }
    },
    [commitRows, currentRows],
  );

  const addRow = useCallback(() => {
    commitRows([...currentRows, createDefaultRow(columns)]);
  }, [columns, commitRows, currentRows]);

  const deleteRow = useCallback(
    (rowIndex: number) => {
      commitRows(currentRows.filter((_, index) => index !== rowIndex));
      setCellErrors((previous) => {
        const next: Record<number, Record<string, string>> = {};
        for (const [key, value] of Object.entries(previous)) {
          const index = Number(key);
          if (index === rowIndex) continue;
          next[index > rowIndex ? index - 1 : index] = value;
        }
        return next;
      });
      onRowDelete?.(rowIndex);
    },
    [commitRows, currentRows, onRowDelete],
  );

  const validateAll = useCallback(() => {
    const errors: Array<{ rowIndex: number; field: string; message: string }> = [];
    const nextCellErrors: Record<number, Record<string, string>> = {};
    currentRows.forEach((row, rowIndex) => {
      for (const column of columns) {
        if (!column.validate) continue;
        const message = column.validate(row[column.key]);
        if (message) {
          errors.push({ rowIndex, field: column.key, message });
          nextCellErrors[rowIndex] = { ...(nextCellErrors[rowIndex] ?? {}), [column.key]: message };
        }
      }
    });
    setCellErrors(nextCellErrors);
    return { isValid: errors.length === 0, errors };
  }, [columns, currentRows]);

  useImperativeHandle(ref, () => ({
    getData: () => {
      onDataRequest?.(currentRows);
      return currentRows;
    },
    getDataWithoutIds: () => stripRowIds(currentRows),
    validate: validateAll,
    getRowCount: () => currentRows.length,
    addRow,
    clearRows: () => commitRows([]),
    getRow: (index: number) => currentRows[index],
    updateRow: (index: number, data: Partial<Record<string, any>>) => {
      commitRows(currentRows.map((row, i) => (i === index ? { ...row, ...data } : row)));
    },
    exportJSON: () => JSON.stringify(stripRowIds(currentRows), null, 2),
    exportCSV: () => rowsToCSV(columns, currentRows),
  }));

  const getExtendedCellRef = (key: string): RefObject<HTMLTableCellElement | null> => {
    let cellRef = extendedCellRefs.current.get(key);
    if (!cellRef) {
      cellRef = { current: null };
      extendedCellRefs.current.set(key, cellRef);
    }
    return cellRef;
  };

  const isExtendedCellOpen = (column: ColumnDef, rowIndex: number, key: string) =>
    column.extendedCellControlled
      ? Boolean(column.extendedCellOpen?.(rowIndex))
      : Boolean(extendedOpen[key]);

  const toggleExtendedCell = (column: ColumnDef, key: string) => {
    if (column.extendedCellControlled) return;
    setExtendedOpen((previous) => ({ ...previous, [key]: !previous[key] }));
  };

  /* ---------------------------- cell rendering ---------------------------- */

  const renderCellContent = (column: ColumnDef, row: Record<string, any>, rowIndex: number) => {
    const value = row[column.key];
    const onChange = (nextValue: any) => handleCellChange(rowIndex, column, nextValue);

    if (column.component) {
      const CellComponent = column.component;
      return <CellComponent row={row} rowIndex={rowIndex} value={value} onChange={onChange} />;
    }

    if (column.renderCell) {
      return column.renderCell(row, rowIndex, onChange);
    }

    const displayText = column.format ? column.format(value, row) : String(value || '');

    if (
      column.type === 'string' ||
      column.type === 'display' ||
      column.type === 'readonly' ||
      column.editable === false
    ) {
      return (
        <span className={cn('text-open-regular-p text-foreground', column.cellClassName)}>
          {displayText}
        </span>
      );
    }

    if (column.type === 'select') {
      const selectValue = value === '' || value === null || value === undefined ? undefined : String(value);
      return (
        <div className="mx-0 -my-4 w-full min-w-[150px]">
          <Select
            options={toSelectOptions(column.options ?? [])}
            value={selectValue}
            onValueChange={(nextValue) => {
              const single = Array.isArray(nextValue) ? nextValue[0] : nextValue;
              onChange(single === null || single === undefined ? '' : String(single));
            }}
            placeholder={column.placeholder}
            searchable={false}
            variant="inline"
            containerClassName="w-full"
            dropdownClassName="min-w-[200px]"
          />
        </div>
      );
    }

    if (column.type === 'number') {
      return (
        <input
          type="number"
          value={value === 0 || value === '' || value === null || value === undefined ? '' : value}
          placeholder={column.placeholder}
          onChange={(event) => {
            const raw = event.target.value;
            onChange(raw === '' ? 0 : parseFloat(raw) || 0);
          }}
          className={cn(
            inputBaseClass,
            '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
            column.align === 'center' && 'text-center',
            column.align === 'right' && 'text-right',
          )}
        />
      );
    }

    if (column.type === 'date') {
      return (
        <input
          type="date"
          value={value ?? ''}
          placeholder={column.placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={inputBaseClass}
        />
      );
    }

    if (column.type === 'text' || column.type === undefined) {
      return (
        <textarea
          rows={1}
          value={value ?? ''}
          placeholder={column.placeholder}
          ref={(el) => {
            if (el) autoResizeTextarea(el);
          }}
          onChange={(event) => {
            autoResizeTextarea(event.target);
            onChange(event.target.value);
          }}
          onFocus={(event) => autoResizeTextarea(event.target)}
          className={cn(inputBaseClass, 'resize-none overflow-hidden')}
        />
      );
    }

    return (
      <input
        type={column.type}
        value={value ?? ''}
        placeholder={column.placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={inputBaseClass}
      />
    );
  };

  /* ------------------------------- borders -------------------------------- */

  const cellBorders = (options: {
    isFirstColumn: boolean;
    isHeader?: boolean;
    isLastRow?: boolean;
  }) =>
    cn(
      'border-gray-100',
      !hideHorizontalBorders && !(options.isLastRow && hideBottomBorder) && 'border-b',
      !hideVerticalBorders && 'border-r',
      !hideVerticalBorders && options.isFirstColumn && 'border-l',
      options.isHeader && !hideTopBorder && 'border-t',
    );

  const columnStyle = (column: ColumnDef): CSSProperties => ({
    width: column.width,
    minWidth: column.minWidth || column.width || '150px',
  });

  const tdBaseClass =
    'relative px-6 py-4 align-middle transition-colors focus-within:z-10 focus-within:[outline:1px_solid_var(--color-primary)] focus-within:[outline-offset:-1px]';
  const errorCellClass =
    'border-t border-t-red-500 [outline:1px_solid_#ef4444] [outline-offset:-1px]';

  const totalColumnCount =
    visibleColumns.length +
    (showSerialColumn ? 1 : 0) +
    (isMobile ? 1 : 0) +
    (showDeleteButton ? 1 : 0) +
    (showInlineDeleteColumn ? 1 : 0);

  const maxExtraCells = columns.reduce(
    (max, column) => Math.max(max, column.extraCells?.length ?? 0),
    0,
  );

  /* -------------------------------- render -------------------------------- */

  const renderBodyCell = (
    column: ColumnDef,
    row: Record<string, any>,
    rowIndex: number,
    columnIndexInRow: number,
    isLastRow: boolean,
  ) => {
    const hasError = Boolean(cellErrors[rowIndex]?.[column.key]);
    const extendedKey = `${column.key}-${rowIndex}`;
    const hasExtendedCell = Boolean(column.renderExtendedCell);
    const extendedRef = hasExtendedCell ? getExtendedCellRef(extendedKey) : undefined;
    const extendedIsOpen = hasExtendedCell && isExtendedCellOpen(column, rowIndex, extendedKey);
    const onToggle = () => toggleExtendedCell(column, extendedKey);

    return (
      <td
        key={column.key}
        ref={extendedRef}
        style={columnStyle(column)}
        onClick={hasExtendedCell && !column.extendedCellControlled ? onToggle : undefined}
        className={cn(
          tdBaseClass,
          cellBorders({ isFirstColumn: columnIndexInRow === 0, isLastRow }),
          alignClass(column.align),
          hasExtendedCell && !column.extendedCellControlled && 'cursor-pointer',
          hasError && errorCellClass,
          column.cellBackgroundClassName,
          tdClassName,
        )}
      >
        {renderCellContent(column, row, rowIndex)}
        {hasExtendedCell && extendedIsOpen && extendedRef ? (
          <ExtendedCellPortal
            cellRef={extendedRef}
            container={extendedCellContainer}
            zIndex={extendedCellZIndex}
          >
            {column.renderExtendedCell!(row, rowIndex, extendedIsOpen, onToggle, extendedRef)}
          </ExtendedCellPortal>
        ) : null}
      </td>
    );
  };

  const renderExtraRows = () => {
    if (maxExtraCells === 0) return null;

    const leadingSpacerCount =
      (showSerialColumn ? 1 : 0) + (isMobile ? 1 : 0);
    const trailingSpacerCount =
      (showDeleteButton ? 1 : 0) + (showInlineDeleteColumn ? 1 : 0);

    return Array.from({ length: maxExtraCells }, (_, extraIndex) => {
      const rowHasContent = visibleColumns.some((column) => column.extraCells?.[extraIndex]);
      const firstContentIndex = visibleColumns.findIndex(
        (column) => column.extraCells?.[extraIndex],
      );
      const spacerClass = rowHasContent ? 'border-none bg-transparent' : '';

      return (
        <tr key={`extra-${extraIndex}`} className={trClassName}>
          {Array.from({ length: leadingSpacerCount }, (_, i) => (
            <td key={`lead-${i}`} className={cn('px-6 py-4', spacerClass, tdClassName)} />
          ))}
          {visibleColumns.map((column, columnIndex) => {
            const extraCell = column.extraCells?.[extraIndex];
            if (!extraCell) {
              return (
                <td
                  key={column.key}
                  className={cn('px-6 py-4', spacerClass, tdClassName)}
                />
              );
            }
            return (
              <td
                key={column.key}
                style={columnStyle(column)}
                className={cn(
                  'px-6 py-4',
                  'border-b border-r border-gray-100',
                  columnIndex === firstContentIndex && 'border-l',
                  alignClass(extraCell.align ?? column.align),
                  extraCell.className,
                  tdClassName,
                )}
              >
                {extraCell.content}
              </td>
            );
          })}
          {Array.from({ length: trailingSpacerCount }, (_, i) => (
            <td key={`trail-${i}`} className={cn('px-6 py-4', spacerClass, tdClassName)} />
          ))}
        </tr>
      );
    });
  };

  const renderPagination = () => {
    if (!paginated) return null;
    if (customPagination) return <>{customPagination}</>;

    const pages = Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1);

    return (
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-6 py-4">
        <span className="text-open-regular-tiny text-muted">
          {pageOfLabel(currentPage, totalPages)}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous page"
            disabled={currentPage <= 1}
            onClick={() => onPageChange?.(currentPage - 1)}
            className="flex size-8 cursor-pointer items-center justify-center rounded-md text-foreground transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft2 size={16} color={iconPaint.current} aria-hidden />
          </button>

          {pages.map((page) => (
            <button
              key={page}
              type="button"
              aria-current={page === currentPage ? 'page' : undefined}
              onClick={() => onPageChange?.(page)}
              className={cn(
                'flex size-8 cursor-pointer items-center justify-center rounded-md text-open-regular-tiny transition-colors',
                page === currentPage
                  ? 'bg-secondary font-semibold text-primary'
                  : 'text-muted hover:bg-gray-50 hover:text-foreground',
              )}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            aria-label="Next page"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange?.(currentPage + 1)}
            className="flex size-8 cursor-pointer items-center justify-center rounded-md text-foreground transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowRight2 size={16} color={iconPaint.current} aria-hidden />
          </button>
        </div>

        {showRowsPerPage ? (
          <RowsPerPageDropdown
            rowsPerPage={rowsPerPage}
            rowsLabel={rowsLabel}
            onSelect={(value) => onRowsPerPageChange?.(value)}
          />
        ) : null}
      </div>
    );
  };

  const detailRow = detailRowIndex !== null ? currentRows[detailRowIndex] : undefined;

  return (
    <div className="flex w-full flex-col">
      <div className={cn('custom-scrollbar w-full overflow-auto', className)}>
        <table
          className={cn('w-full border-separate [border-spacing:1px]', tableClassName)}
          style={{ minWidth }}
        >
          <thead
            className={cn(
              'sticky top-0 z-10 bg-white shadow-[0_1px_0_0_#f3f4f6]',
              theadClassName,
            )}
          >
            <tr className={trClassName}>
              {isMobile ? (
                <th
                  className={cn(
                    'w-[48px] px-3 py-4',
                    cellBorders({ isFirstColumn: true, isHeader: true }),
                    thClassName,
                  )}
                  aria-label={detailsLabel}
                />
              ) : null}
              {showSerialColumn ? (
                <th
                  style={{ width: '60px', minWidth: '60px' }}
                  className={cn(
                    'px-3 py-4 text-center text-open-bold-tiny text-foreground',
                    cellBorders({ isFirstColumn: !isMobile, isHeader: true }),
                    thClassName,
                  )}
                >
                  {serialLabel}
                </th>
              ) : null}
              {visibleColumns.map((column, columnIndex) => (
                <th
                  key={column.key}
                  style={columnStyle(column)}
                  className={cn(
                    'px-6 py-4 text-open-bold-tiny text-foreground',
                    cellBorders({
                      isFirstColumn: columnIndex === 0 && !showSerialColumn && !isMobile,
                      isHeader: true,
                    }),
                    alignClass(column.align),
                    column.headerClassName,
                    thClassName,
                  )}
                >
                  {column.renderHeader ? column.renderHeader() : column.label}
                </th>
              ))}
              {showDeleteButton ? (
                <th
                  className={cn(
                    'px-6 py-4 text-center text-open-bold-tiny text-foreground',
                    cellBorders({ isFirstColumn: false, isHeader: true }),
                    thClassName,
                  )}
                >
                  {actionLabel}
                </th>
              ) : null}
              {showInlineDeleteColumn ? (
                <th
                  className={cn(
                    'w-[48px] px-3 py-4',
                    cellBorders({ isFirstColumn: false, isHeader: true }),
                    thClassName,
                  )}
                />
              ) : null}
            </tr>
          </thead>

          <tbody className={tbodyClassName}>
            {currentRows.length === 0 ? (
              <tr className={trClassName}>
                <td
                  colSpan={totalColumnCount}
                  className={cn(
                    'px-6 py-8 text-center text-open-regular-p text-muted',
                    cellBorders({ isFirstColumn: true, isLastRow: maxExtraCells === 0 }),
                    tdClassName,
                  )}
                >
                  {emptyMessage ?? 'No data available'}
                </td>
              </tr>
            ) : (
              currentRows.map((row, rowIndex) => {
                const isLastRow = rowIndex === currentRows.length - 1 && maxExtraCells === 0;
                return (
                  <tr
                    key={row.id ?? rowIndex}
                    className={cn(
                      'transition-colors hover:bg-gray-50',
                      getRowClassName?.(row, rowIndex),
                      trClassName,
                    )}
                  >
                    {isMobile ? (
                      <td
                        className={cn(
                          'px-3 py-4 text-center',
                          cellBorders({ isFirstColumn: true, isLastRow }),
                          tdClassName,
                        )}
                      >
                        <button
                          type="button"
                          aria-label={detailsLabel}
                          onClick={() => setDetailRowIndex(rowIndex)}
                          className="inline-flex size-6 cursor-pointer items-center justify-center rounded-full bg-primary transition-opacity hover:opacity-90"
                        >
                          <Add size={14} color={iconPaint.inverse} aria-hidden />
                        </button>
                      </td>
                    ) : null}
                    {showSerialColumn ? (
                      <td
                        style={{ width: '60px', minWidth: '60px' }}
                        className={cn(
                          'px-3 py-4 text-center text-open-regular-p text-foreground',
                          cellBorders({ isFirstColumn: !isMobile, isLastRow }),
                          tdClassName,
                        )}
                      >
                        {rowIndex + 1}
                      </td>
                    ) : null}
                    {visibleColumns.map((column, columnIndex) =>
                      renderBodyCell(
                        column,
                        row,
                        rowIndex,
                        showSerialColumn || isMobile ? columnIndex + 1 : columnIndex,
                        isLastRow,
                      ),
                    )}
                    {showDeleteButton ? (
                      <td
                        className={cn(
                          'px-6 py-4 text-center',
                          cellBorders({ isFirstColumn: false, isLastRow }),
                          tdClassName,
                        )}
                      >
                        <button
                          type="button"
                          aria-label={`Delete row ${rowIndex + 1}`}
                          onClick={() => deleteRow(rowIndex)}
                          className="cursor-pointer text-muted transition-colors hover:text-destructive"
                        >
                          <Trash size={18} color={iconPaint.current} aria-hidden />
                        </button>
                      </td>
                    ) : null}
                    {showInlineDeleteColumn ? (
                      <td
                        className={cn(
                          'px-3 py-4 text-center',
                          cellBorders({ isFirstColumn: false, isLastRow }),
                          tdClassName,
                        )}
                      >
                        <button
                          type="button"
                          aria-label={`Delete row ${rowIndex + 1}`}
                          onClick={() => deleteRow(rowIndex)}
                          className="cursor-pointer text-muted transition-colors hover:text-destructive"
                        >
                          <Trash size={16} color={iconPaint.current} aria-hidden />
                        </button>
                      </td>
                    ) : null}
                  </tr>
                );
              })
            )}
            {renderExtraRows()}
          </tbody>
        </table>
      </div>

      {footer ? (
        <div className="bg-white px-6 py-4">{footer}</div>
      ) : editable ? (
        <div className="bg-white">
          <button
            type="button"
            onClick={addRow}
            className="flex cursor-pointer items-center gap-2 px-6 py-4 text-open-bold-tiny text-foreground transition-colors hover:text-primary"
          >
            <Add size={16} color={iconPaint.current} aria-hidden />
            {addRowText}
          </button>
        </div>
      ) : null}

      {renderPagination()}

      {detailRow ? (
        <TableDetailModal title={detailsLabel} onClose={() => setDetailRowIndex(null)}>
          {columns.map((column) => (
            <div key={column.key} className="flex flex-col gap-1">
              <span className="text-open-bold-tiny text-muted">{column.label}</span>
              <div
                className={cn(
                  'rounded-lg border border-gray-100 px-3 py-2',
                  cellErrors[detailRowIndex!]?.[column.key] && 'border-red-500',
                )}
              >
                {renderCellContent(column, detailRow, detailRowIndex!)}
              </div>
            </div>
          ))}
        </TableDetailModal>
      ) : null}
    </div>
  );
});

Table.displayName = 'Table';

export { Table };
export default Table;
