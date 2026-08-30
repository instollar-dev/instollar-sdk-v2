import {
  useState,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  FC,
  createRef,
} from "react";
import { Plus, Trash2, ChevronRight, ChevronLeft, X } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";
import Modal, { ModalContent } from "./Modal";
import Select from "./Select";
import { toSelectOptions } from "../utils/toSelectOptions";
import { useMediaQuery } from "../hooks/useMediaQuery";

/**
 * Table Component
 *
 * A sophisticated, reusable table component with dynamic rows, columns, and cell types.
 *
 * @example
 * // Basic usage with column definitions
 * const columns: ColumnDef[] = [
 *   { key: "itemName", label: "Item name", type: "text", placeholder: "Input item name" },
 *   { key: "description", label: "Description", type: "text", placeholder: "Input description" },
 *   { key: "qty", label: "Qty", type: "number", placeholder: "0", align: "center", width: "80px" },
 * ];
 *
 * <Table
 *   columns={columns}
 *   rows={rows}
 *   onRowsChange={setRows}
 * />
 *
 * @example
 * // With select dropdown
 * const columns: ColumnDef[] = [
 *   { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
 * ];
 *
 * @example
 * // With custom cell renderer
 * const columns: ColumnDef[] = [
 *   {
 *     key: "custom",
 *     label: "Custom",
 *     renderCell: (row, onChange) => (
 *       <CustomComponent value={row.custom} onChange={onChange} />
 *     )
 *   },
 * ];
 *
 * @example
 * // With string/display type
 * const columns: ColumnDef[] = [
 *   {
 *     key: "status",
 *     label: "Status",
 *     type: "string",
 *     format: (value) => value.toUpperCase()
 *   },
 * ];
 *
 * @example
 * // With component prop
 * const CustomCell = ({ value, row, onChange }) => (
 *   <div className="custom-cell">{value}</div>
 * );
 *
 * const columns: ColumnDef[] = [
 *   {
 *     key: "custom",
 *     label: "Custom",
 *     component: CustomCell
 *   },
 * ];
 *
 * @example
 * // Get structured data using ref
 * const tableRef = useRef<TableHandle>(null);
 *
 * const handleSubmit = () => {
 *   const data = tableRef.current?.getData();
 *   const isValid = tableRef.current?.validate();
 *   console.log("Table data:", data);
 * };
 *
 * <Table
 *   ref={tableRef}
 *   columns={columns}
 *   rows={rows}
 *   onRowsChange={setRows}
 * />
 *
 * @example
 * // With extended cell (dropdown/popover that extends outside table)
 * const columns: ColumnDef[] = [
 *   {
 *     key: "actions",
 *     label: "Actions",
 *     type: "display",
 *     renderExtendedCell: (row, rowIndex, isOpen, onToggle, cellRef) => (
 *       <>
 *         <button onClick={onToggle}>More</button>
 *         {isOpen && (
 *           <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded border p-2 z-50">
 *             <button onClick={() => console.log("Edit", row)}>Edit</button>
 *             <button onClick={() => console.log("Delete", row)}>Delete</button>
 *           </div>
 *         )}
 *       </>
 *     ),
 *   },
 * ];
 *
 * @example
 * // With extra cells in a column (e.g., for totals/summaries)
 * const grandTotal = items.reduce((sum, item) => sum + item.total, 0);
 * const columns: ColumnDef[] = [
 *   { key: "itemName", label: "Item", type: "string" },
 *   { key: "qty", label: "Qty", type: "number", align: "center" },
 *   {
 *     key: "total",
 *     label: "Total",
 *     type: "string",
 *     align: "right",
 *     format: (value) => `$${value.toLocaleString()}`,
 *     extraCells: [
 *       {
 *         content: (
 *           <div className="flex justify-between items-center">
 *             <span className="font-bold">GRAND TOTAL</span>
 *             <span className="font-bold">${grandTotal.toLocaleString()}</span>
 *           </div>
 *         ),
 *         className: "bg-gray-50",
 *         align: "right"
 *       }
 *     ]
 *   },
 * ];
 */

export type CellType =
  | "text"
  | "number"
  | "select"
  | "date"
  | "email"
  | "tel"
  | "readonly"
  | "string"
  | "display";

export interface ColumnOption {
  label: string;
  value: string | number;
}

export interface ColumnDef {
  /** Unique key for the column (maps to row data property) */
  key: string;
  /** Column header label */
  label: string;
  /** Cell input type */
  type?: CellType;
  /** Placeholder text for inputs */
  placeholder?: string;
  /** Options for select type cells */
  options?: (string | number | ColumnOption)[];
  /** Column alignment */
  align?: "left" | "center" | "right";
  /** Column width */
  width?: string;
  /** Minimum width for responsive tables */
  minWidth?: string;
  /** Whether column is editable */
  editable?: boolean;
  /** Custom cell renderer function */
  renderCell?: (
    row: Record<string, any>,
    rowIndex: number,
    onChange: (value: any) => void,
  ) => ReactNode;
  /** React component to render in cell (alternative to renderCell) */
  component?: React.ComponentType<{
    row: Record<string, any>;
    rowIndex: number;
    value: any;
    onChange: (value: any) => void;
  }>;
  /** Custom header renderer */
  renderHeader?: () => ReactNode;
  /** Validation function */
  validate?: (value: any) => string | null;
  /** Default value for new rows */
  defaultValue?: any;
  /** Format function for string/display types */
  format?: (value: any, row: Record<string, any>) => string;
  /** Optional classes merged into string/display cell content (after defaults). */
  cellClassName?: string;
  /** Optional classes merged into the column header `<th>`. */
  headerClassName?: string;
  /** Optional classes merged into body `<td>` for this column (background, e.g. `bg-[#F3F4F6]`). Does not affect `<th>`. */
  cellBackgroundClassName?: string;
  /** Render extended cell content that appears outside table boundaries (e.g., dropdowns, popovers) */
  renderExtendedCell?: (
    row: Record<string, any>,
    rowIndex: number,
    isOpen: boolean,
    onToggle: () => void,
    cellRef: React.RefObject<HTMLTableCellElement | null>,
  ) => ReactNode;
  /** Whether extended cell should be controlled externally */
  extendedCellControlled?: boolean;
  /** Initial state for extended cell (if controlled) */
  extendedCellOpen?: (rowIndex: number) => boolean;
  /** Extra cells to render below the regular rows for this column (e.g., totals, summaries) */
  extraCells?: Array<{
    content: ReactNode;
    className?: string;
    align?: "left" | "center" | "right";
  }>;
}

export interface TableProps {
  /** Column definitions */
  columns: ColumnDef[];
  /** Array of table rows. If provided, component is controlled. */
  rows?: Record<string, any>[];
  /** Callback fired when rows change. Required if using controlled mode. */
  onRowsChange?: (rows: Record<string, any>[]) => void;
  /** Whether to show serial numbers column */
  showSerialNumbers?: boolean;
  /** Whether to show delete row button */
  showDeleteButton?: boolean;
  /** Whether table is editable (shows "Add another row" button) */
  editable?: boolean;
  /** Whether to show inline delete button on each row (only when rows > 1) */
  showInlineDelete?: boolean;
  /** Custom add row button text */
  addRowText?: string;
  /** Custom empty state message */
  emptyMessage?: string;
  /** Additional CSS classes */
  className?: string;
  /** Callback when a row is deleted */
  onRowDelete?: (rowIndex: number) => void;
  /** Minimum width for the table container */
  minWidth?: string;
  /** Custom footer content */
  footer?: ReactNode;
  /** Callback when data is requested via ref */
  onDataRequest?: (data: Record<string, any>[]) => void;
  /** Z-index for extended cells (default: 50) */
  extendedCellZIndex?: number;
  /** Container for extended cells (default: document.body) */
  extendedCellContainer?: HTMLElement;
  /** Enable pagination */
  paginated?: boolean;
  /** Current page (1-indexed) */
  currentPage?: number;
  /** Total number of pages */
  totalPages?: number;
  /** Number of rows per page */
  rowsPerPage?: number;
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
  /** Callback when rows per page changes */
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  /** Show rows per page selector */
  showRowsPerPage?: boolean;
  /** Custom pagination footer */
  customPagination?: ReactNode;
  /** Hide horizontal cell borders (top and bottom borders) */
  hideHorizontalBorders?: boolean;
  /** Hide vertical cell borders (left and right borders) */
  hideVerticalBorders?: boolean;
  /** Hide top cell borders only */
  hideTopBorder?: boolean;
  /** Hide bottom cell borders only */
  hideBottomBorder?: boolean;
  /** Enable mobile responsive mode (collapse columns + detail modal) */
  mobileResponsive?: boolean;
  /** Number of columns to show on mobile before collapsing into modal */
  mobileColumnsCount?: number;
  /** Optional callback to provide custom CSS classes for a row */
  getRowClassName?: (row: Record<string, any>, index: number) => string;
}

export interface TableHandle {
  /** Get all table data as structured array */
  getData: () => Record<string, any>[];
  /** Get data without internal IDs */
  getDataWithoutIds: () => Record<string, any>[];
  /** Validate all rows and return validation errors */
  validate: () => {
    isValid: boolean;
    errors: Array<{ rowIndex: number; field: string; message: string }>;
  };
  /** Get row count */
  getRowCount: () => number;
  /** Add a new row programmatically */
  addRow: () => void;
  /** Clear all rows */
  clearRows: () => void;
  /** Get specific row by index */
  getRow: (index: number) => Record<string, any> | undefined;
  /** Update specific row by index */
  updateRow: (index: number, data: Partial<Record<string, any>>) => void;
  /** Export data as JSON string */
  exportJSON: () => string;
  /** Export data as CSV string */
  exportCSV: () => string;
}

const Table = forwardRef<TableHandle, TableProps>(
  (
    {
      columns,
      rows: controlledRows,
      onRowsChange,
      showSerialNumbers = true,
      showDeleteButton = false,
      editable = true,
      showInlineDelete = false,
      addRowText = "Add another row",
      emptyMessage,
      className = "",
      onRowDelete,
      minWidth,
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
    },
    ref,
  ) => {
    const isMobile = useMediaQuery("(max-width: 767px)");
    const [selectedMobileRowIndex, setSelectedMobileRowIndex] = useState<
      number | null
    >(null);

    // Helper function to generate border classes
    const getBorderClasses = (options?: {
      includeTop?: boolean;
      includeBottom?: boolean;
      includeLeft?: boolean;
      includeRight?: boolean;
      isFirst?: boolean;
    }) => {
      const {
        includeTop = false,
        includeBottom = false,
        includeLeft = false,
        includeRight = false,
        isFirst = false,
      } = options || {};

      const classes: string[] = [];

      // Top border: hide if hideHorizontalBorders OR hideTopBorder is true
      if (includeTop && !hideHorizontalBorders && !hideTopBorder) {
        classes.push("border-t");
      }

      // Bottom border: hide if hideHorizontalBorders OR hideBottomBorder is true
      if (includeBottom && !hideHorizontalBorders && !hideBottomBorder) {
        classes.push("border-b");
      }

      // Vertical borders (left and right)
      if (!hideVerticalBorders) {
        if (includeRight) classes.push("border-r");
        if (includeLeft || isFirst) {
          classes.push("border-l");
        }
      }

      // Always add border-gray if any borders are present
      if (classes.length > 0) {
        classes.push("border-gray-100");
      }

      return classes.join(" ");
    };

    // Create default row from column definitions
    const createDefaultRow = (): Record<string, any> => {
      const row: Record<string, any> = { id: Date.now() };
      columns.forEach((col) => {
        row[col.key] =
          col.defaultValue !== undefined
            ? col.defaultValue
            : col.type === "number"
              ? 0
              : "";
      });
      return row;
    };

    const [internalRows, setInternalRows] = useState<Record<string, any>[]>([
      createDefaultRow(),
    ]);

    // Per-cell validation errors: rowIndex -> { [columnKey]: message }
    const [cellErrors, setCellErrors] = useState<
      Record<number, Record<string, string>>
    >({});

    // Track extended cell states: "columnKey-rowIndex" -> boolean
    const [extendedCellStates, setExtendedCellStates] = useState<
      Record<string, boolean>
    >({});

    // Refs for cells with extended content
    const cellRefs = useRef<
      Record<string, React.RefObject<HTMLTableCellElement | null>>
    >({});

    // State and ref for rows per page dropdown
    const [isRowsPerPageOpen, setIsRowsPerPageOpen] = useState(false);
    const rowsPerPageButtonRef = useRef<HTMLButtonElement>(null);

    // Use controlled rows if provided, otherwise use internal state
    const rows = controlledRows || internalRows;
    const setRows = onRowsChange
      ? (newRows: Record<string, any>[]) => {
        onRowsChange(newRows);
      }
      : setInternalRows;

    // Initialize cell refs
    useEffect(() => {
      columns.forEach((col) => {
        if (col.renderExtendedCell) {
          rows.forEach((_, rowIndex) => {
            const key = `${col.key}-${rowIndex}`;
            if (!cellRefs.current[key]) {
              cellRefs.current[key] = createRef<HTMLTableCellElement>();
            }
          });
        }
      });
    }, [columns, rows.length]);

    const getExtendedCellKey = (columnKey: string, rowIndex: number) => {
      return `${columnKey}-${rowIndex}`;
    };

    const isExtendedCellOpen = (columnKey: string, rowIndex: number) => {
      const key = getExtendedCellKey(columnKey, rowIndex);
      const column = columns.find((col) => col.key === columnKey);

      if (column?.extendedCellControlled && column.extendedCellOpen) {
        return column.extendedCellOpen(rowIndex);
      }

      return extendedCellStates[key] || false;
    };

    const toggleExtendedCell = (columnKey: string, rowIndex: number) => {
      const key = getExtendedCellKey(columnKey, rowIndex);
      const column = columns.find((col) => col.key === columnKey);

      if (column?.extendedCellControlled) {
        // Controlled mode - don't update internal state
        return;
      }

      setExtendedCellStates((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    };

    const handleAddRow = () => {
      const newRow = createDefaultRow();
      setRows([...rows, newRow]);
    };

    const handleDeleteRow = (rowIndex: number) => {
      const updatedRows = rows.filter((_, index) => index !== rowIndex);
      setRows(updatedRows);
      onRowDelete?.(rowIndex);
    };

    const handleFieldChange = (
      rowIndex: number,
      fieldKey: string,
      value: any,
    ) => {
      const updatedRows = rows.map((row, index) =>
        index === rowIndex ? { ...row, [fieldKey]: value } : row,
      );
      setRows(updatedRows);

      const column = columns.find((col) => col.key === fieldKey);
      if (column?.validate) {
        const error = column.validate(value);
        setCellErrors((prev) => {
          const prevRowErrors = prev[rowIndex] ?? {};
          // Remove existing error for this field
          const { [fieldKey]: _removed, ...restRow } = prevRowErrors;
          if (!error) {
            // No error for this field; keep other fields' errors
            return {
              ...prev,
              [rowIndex]: restRow,
            };
          }
          // Set new error for this field
          return {
            ...prev,
            [rowIndex]: {
              ...restRow,
              [fieldKey]: error,
            },
          };
        });
      }
    };

    const renderCell = (
      column: ColumnDef,
      row: Record<string, any>,
      rowIndex: number,
    ) => {
      const value = row[column.key];
      const cellValue = value ?? "";

      // Use custom component if provided
      if (column.component) {
        const Component = column.component;
        return (
          <Component
            row={row}
            rowIndex={rowIndex}
            value={cellValue}
            onChange={(newValue) =>
              handleFieldChange(rowIndex, column.key, newValue)
            }
          />
        );
      }

      // Use custom renderer if provided
      if (column.renderCell) {
        return column.renderCell(row, rowIndex, (value) =>
          handleFieldChange(rowIndex, column.key, value),
        );
      }

      const isEditable =
        column.editable !== false &&
        column.type !== "readonly" &&
        column.type !== "string" &&
        column.type !== "display";

      // String/Display type - display as string
      if (column.type === "string" || column.type === "display") {
        const displayValue = column.format
          ? column.format(cellValue, row)
          : String(cellValue || "");
        return (
          <span
            className={`text-spline-regular-label text-foreground ${column.cellClassName ?? ""}`}
          >
            {displayValue}
          </span>
        );
      }

      // Readonly cells
      if (column.type === "readonly" || !isEditable) {
        const displayValue = column.format
          ? column.format(cellValue, row)
          : String(cellValue || "");
        return (
          <span
            className={`text-spline-regular-p text-foreground ${column.cellClassName ?? ""}`}
          >
            {displayValue}
          </span>
        );
      }

      // Select dropdown
      if (column.type === "select") {
        const selectOptions = toSelectOptions(column.options || []);
        const strVal =
          cellValue === null || cellValue === undefined ? "" : String(cellValue);
        return (
          <div className="w-full min-w-0 max-w-full">
            <Select
              options={selectOptions}
              value={strVal === "" ? null : strVal}
              onChange={(v) =>
                handleFieldChange(
                  rowIndex,
                  column.key,
                  v === null || v === undefined ? "" : String(v),
                )
              }
              placeholder={column.placeholder || "Select..."}
              searchable={false}
              variant="inline"
              containerClassName="w-full min-w-0 max-w-full mx-0 -my-4"
              className="min-h-0 min-w-0 w-full py-4 pl-0 pr-0 text-spline-regular-p text-foreground"
              dropdownClassName="z-[100] min-w-[200px]"
            />
          </div>
        );
      }

      // Number input
      if (column.type === "number") {
        return (
          <input
            type="number"
            className={`w-full bg-transparent border-none focus:outline-none rounded py-1 px-2 text-spline-regular-p text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${column.align === "center" ? "text-center" : ""
              }`}
            value={cellValue === 0 ? "" : cellValue}
            placeholder={column.placeholder || "0"}
            onChange={(e) =>
              handleFieldChange(
                rowIndex,
                column.key,
                e.target.value === "" ? 0 : parseFloat(e.target.value) || 0,
              )
            }
          />
        );
      }

      // Date input
      if (column.type === "date") {
        return (
          <input
            type="date"
            className="w-full bg-transparent focus:outline-none rounded py-1 px-2 text-spline-regular-p text-foreground"
            value={cellValue}
            placeholder={column.placeholder}
            onChange={(e) =>
              handleFieldChange(rowIndex, column.key, e.target.value)
            }
          />
        );
      }

      // Default text input (text, email, tel)
      // Use textarea for text type to allow wrapping, input for email/tel
      if (column.type === "text" || !column.type) {
        return (
          <textarea
            className="w-full bg-transparent focus:outline-none rounded py-1 px-2 text-spline-regular-p text-foreground placeholder:text-gray-400 resize-none overflow-hidden"
            value={cellValue}
            placeholder={column.placeholder}
            onChange={(e) => {
              handleFieldChange(rowIndex, column.key, e.target.value);
              // Auto-resize textarea
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.max(24, target.scrollHeight)}px`;
            }}
            rows={1}
            style={{ minHeight: "24px" }}
            onFocus={(e) => {
              // Auto-resize on focus
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.max(24, target.scrollHeight)}px`;
            }}
          />
        );
      }

      return (
        <input
          type={column.type}
          className="w-full bg-transparent focus:outline-none rounded py-1 px-2 text-spline-regular-p text-foreground placeholder:text-gray-400"
          value={cellValue}
          placeholder={column.placeholder}
          onChange={(e) =>
            handleFieldChange(rowIndex, column.key, e.target.value)
          }
        />
      );
    };

    const getColumnStyle = (column: ColumnDef) => {
      const styles: React.CSSProperties = {};
      if (column.width) styles.width = column.width;
      // Set default minWidth if not explicitly provided
      styles.minWidth = column.minWidth || column.width || "150px";
      return styles;
    };

    const totalColumns =
      columns.length +
      (showSerialNumbers ? 1 : 0) +
      (showDeleteButton ? 1 : 0) +
      (showInlineDelete && rows.length > 1 ? 1 : 0);

    // Calculate max number of extra cells across all columns
    const maxExtraCells = Math.max(
      0,
      ...columns.map((col) => col.extraCells?.length || 0),
    );

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      getData: () => {
        const data = rows;
        onDataRequest?.(data);
        return data;
      },
      getDataWithoutIds: () => {
        return rows.map(({ id, ...rest }) => rest);
      },
      validate: () => {
        const errors: Array<{
          rowIndex: number;
          field: string;
          message: string;
        }> = [];
        const newCellErrors: Record<number, Record<string, string>> = {};
        rows.forEach((row, rowIndex) => {
          columns.forEach((column) => {
            if (column.validate) {
              const value = row[column.key];
              const error = column.validate(value);
              if (error) {
                errors.push({
                  rowIndex,
                  field: column.key,
                  message: error,
                });
                if (!newCellErrors[rowIndex]) {
                  newCellErrors[rowIndex] = {};
                }
                newCellErrors[rowIndex][column.key] = error;
              }
            }
          });
        });
        // Update per-cell error state so UI shows red borders even if user hasn't edited the cell.
        setCellErrors(newCellErrors);
        return {
          isValid: errors.length === 0,
          errors,
        };
      },
      getRowCount: () => rows.length,
      addRow: () => {
        handleAddRow();
      },
      clearRows: () => {
        setRows([]);
      },
      getRow: (index: number) => {
        return rows[index];
      },
      updateRow: (index: number, data: Partial<Record<string, any>>) => {
        const updatedRows = rows.map((row, i) =>
          i === index ? { ...row, ...data } : row,
        );
        setRows(updatedRows);
      },
      exportJSON: () => {
        return JSON.stringify(
          rows.map(({ id, ...rest }) => rest),
          null,
          2,
        );
      },
      exportCSV: () => {
        if (rows.length === 0) return "";

        // Get headers from columns
        const headers = columns.map((col) => col.label).join(",");

        // Get data rows
        const dataRows = rows.map((row) =>
          columns
            .map((col) => {
              const value = row[col.key] ?? "";
              // Escape commas and quotes in CSV
              if (
                typeof value === "string" &&
                (value.includes(",") || value.includes('"'))
              ) {
                return `"${value.replace(/"/g, '""')}"`;
              }
              return value;
            })
            .join(","),
        );

        return [headers, ...dataRows].join("\n");
      },
    }));

    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          <div
            className={`flex-1 overflow-y-auto overflow-x-auto custom-scrollbar ${className}`}
          >
            <table
              className="w-full border-separate border-spacing-y-px border-spacing-x-px"
              style={{
                minWidth: minWidth ? minWidth : (isMobile && mobileResponsive ? "unset" : "600px"),
              }}
            >
              <thead className="sticky top-0 z-10">
                <tr
                  className="text-left bg-white border-b border-gray-200"
                  style={{ boxShadow: "0 1px 0 0 rgb(229, 231, 235)" }}
                >
                  {isMobile && mobileResponsive && (
                    <th
                      className={`py-4 px-4 text-spline-bold-label text-foreground w-[48px] ${getBorderClasses({ includeTop: true, includeBottom: true, includeRight: true, isFirst: true })}`}
                    >
                      {/* Plus Icon Header */}
                    </th>
                  )}
                  {showSerialNumbers && (!isMobile || !mobileResponsive) && (
                    <th
                      className={`py-4 px-6 text-spline-bold-label text-foreground w-[60px] ${getBorderClasses({ includeTop: true, includeBottom: true, includeRight: true, isFirst: true })}`}
                      style={{ width: "60px" }}
                    >
                      S/N
                    </th>
                  )}
                  {(isMobile && mobileResponsive
                    ? columns.slice(0, mobileColumnsCount)
                    : columns
                  ).map((column, colIndex) => (
                    <th
                      key={column.key}
                      className={`py-4 px-6 text-spline-bold-label text-foreground ${column.headerClassName ?? ""} ${getBorderClasses({ includeTop: true, includeBottom: true, includeRight: true, isFirst: colIndex === 0 && (!showSerialNumbers || (isMobile && mobileResponsive)) })} ${column.align === "center"
                        ? "text-center"
                        : column.align === "right"
                          ? "text-right"
                          : ""
                        }`}
                      style={getColumnStyle(column)}
                    >
                      {column.renderHeader
                        ? column.renderHeader()
                        : column.label}
                    </th>
                  ))}
                  {showDeleteButton && (!isMobile || !mobileResponsive) && (
                    <th className="py-4 px-6 text-spline-bold-label text-foreground w-[60px] text-center">
                      Action
                    </th>
                  )}
                  {showInlineDelete &&
                    rows.length > 1 &&
                    (!isMobile || !mobileResponsive) && (
                      <th className="py-4 px-2 text-spline-bold-label text-foreground w-[40px] text-center border-b-0">
                        {/* Empty header for inline delete column */}
                      </th>
                    )}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && emptyMessage ? (
                  <tr>
                    <td
                      colSpan={
                        isMobile && mobileResponsive
                          ? mobileColumnsCount + 1
                          : totalColumns
                      }
                      className="py-8 text-center text-spline-regular-p text-gray-400"
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                ) : (
                  rows.map((row, index) => (
                    <tr
                      key={row.id || index}
                      className={`hover:bg-gray-50 transition-colors relative group ${getRowClassName ? getRowClassName(row, index) : ""}`}
                    >
                      {isMobile && mobileResponsive && (
                        <td
                          className={`py-4 px-4 text-center ${getBorderClasses({ includeBottom: true, includeRight: true, isFirst: true })}`}
                        >
                          <button
                            onClick={() => setSelectedMobileRowIndex(index)}
                            className="w-6 h-6 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark transition-all scale-100 hover:scale-110 active:scale-95 shadow-sm"
                            aria-label="View Details"
                          >
                            <Plus size={14} strokeWidth={3} />
                          </button>
                        </td>
                      )}
                      {showSerialNumbers &&
                        (!isMobile || !mobileResponsive) && (
                          <td
                            className={`py-4 px-6 text-spline-regular-p text-secondary-text ${getBorderClasses({ includeBottom: true, includeRight: true, isFirst: true })} text-center`}
                          >
                            {index + 1}
                          </td>
                        )}
                      {(isMobile && mobileResponsive
                        ? columns.slice(0, mobileColumnsCount)
                        : columns
                      ).map((column, colIndex) => {
                        const isEditable =
                          column.editable !== false &&
                          column.type !== "readonly" &&
                          column.type !== "string" &&
                          column.type !== "display";
                        const cellKey = getExtendedCellKey(column.key, index);
                        const hasExtendedCell = !!column.renderExtendedCell;
                        const hasError = !!cellErrors[index]?.[column.key];

                        // Initialize ref if needed
                        if (hasExtendedCell && !cellRefs.current[cellKey]) {
                          cellRefs.current[cellKey] =
                            createRef<HTMLTableCellElement>();
                        }

                        return (
                          <td
                            key={column.key}
                            ref={
                              hasExtendedCell
                                ? cellRefs.current[cellKey]
                                : undefined
                            }
                            className={`py-4 px-6 ${getBorderClasses({ includeBottom: true, includeRight: true, isFirst: colIndex === 0 })} relative transition-colors ${isEditable
                              ? "focus-within:outline-1 focus-within:outline-primary focus-within:-outline-offset-1 focus-within:z-10"
                              : ""
                              } ${column.align === "center"
                                ? "text-center"
                                : column.align === "right"
                                  ? "text-right"
                                  : ""
                              } ${hasExtendedCell ? "overflow-visible" : ""} ${hasError
                                ? "outline outline-red-500 -outline-offset-1 border-t border-red-500"
                                : ""
                              } ${column.cellBackgroundClassName ?? ""}`}
                            style={getColumnStyle(column)}
                          >
                            {renderCell(column, row, index)}
                            {hasExtendedCell &&
                              cellRefs.current[cellKey]?.current && (
                                <ExtendedCellPortal
                                  cellRef={cellRefs.current[cellKey]}
                                  isOpen={isExtendedCellOpen(column.key, index)}
                                  onToggle={() =>
                                    toggleExtendedCell(column.key, index)
                                  }
                                  zIndex={extendedCellZIndex}
                                  container={extendedCellContainer}
                                >
                                  {column.renderExtendedCell?.(
                                    row,
                                    index,
                                    isExtendedCellOpen(column.key, index),
                                    () => toggleExtendedCell(column.key, index),
                                    cellRefs.current[cellKey],
                                  )}
                                </ExtendedCellPortal>
                              )}
                          </td>
                        );
                      })}
                      {showDeleteButton && (
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleDeleteRow(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            type="button"
                            aria-label="Delete row"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      )}
                      {/* Inline delete button - shows on the side when rows > 1 */}
                      {showInlineDelete && rows.length > 1 && (
                        <td className="py-4 px-2 text-center w-[40px]">
                          <button
                            onClick={() => handleDeleteRow(index)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1 rounded hover:bg-red-50"
                            type="button"
                            aria-label="Delete row"
                            title="Delete row"
                          >
                            <Trash2 size={16} strokeWidth={2} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
                {/* Extra cells rows for columns that need them */}
                {maxExtraCells > 0 &&
                  Array.from({ length: maxExtraCells }).map(
                    (_, extraRowIndex) => {
                      // Check if any column has an extra cell in this row
                      const hasExtraCellInRow = columns.some(
                        (col) => col.extraCells?.[extraRowIndex],
                      );

                      // Find the first column with an extra cell to add left border
                      const firstExtraCellColumnKey = columns.find(
                        (col) => col.extraCells?.[extraRowIndex],
                      )?.key;

                      return (
                        <tr key={`extra-${extraRowIndex}`} className="relative">
                          {showSerialNumbers && (
                            <td
                              className={`py-4 px-6 ${hasExtraCellInRow
                                ? "border-none bg-transparent"
                                : `${getBorderClasses({ includeBottom: true, includeRight: true, includeLeft: true })} bg-white`
                                }`}
                            ></td>
                          )}
                          {columns.map((column, colIndex) => {
                            const extraCell =
                              column.extraCells?.[extraRowIndex];
                            const isFirstExtraCell =
                              column.key === firstExtraCellColumnKey;

                            if (!extraCell) {
                              // Empty cell - hide borders and background if there's an extra cell in this row
                              return (
                                <td
                                  key={column.key}
                                  className={`py-4 px-6 ${hasExtraCellInRow
                                    ? "border-none bg-transparent"
                                    : getBorderClasses({
                                      includeBottom: true,
                                      includeRight: true,
                                      includeLeft: true,
                                      isFirst: colIndex === 0,
                                    })
                                    }`}
                                  style={getColumnStyle(column)}
                                ></td>
                              );
                            }

                            // Cell with content - show borders, add left border if it's the first extra cell
                            return (
                              <td
                                key={column.key}
                                className={`py-4 px-6 ${getBorderClasses({ includeBottom: true, includeRight: true, includeLeft: isFirstExtraCell, isFirst: colIndex === 0 })} bg-white ${extraCell.align === "center"
                                  ? "text-center"
                                  : extraCell.align === "right"
                                    ? "text-right"
                                    : ""
                                  } ${extraCell.className || ""}`}
                                style={getColumnStyle(column)}
                              >
                                {extraCell.content}
                              </td>
                            );
                          })}
                          {showDeleteButton && (
                            <td
                              className={`py-4 px-6 ${hasExtraCellInRow
                                ? "border-none bg-transparent"
                                : `${getBorderClasses({ includeBottom: true, includeRight: true })} bg-white`
                                }`}
                            ></td>
                          )}
                          {showInlineDelete && rows.length > 1 && (
                            <td
                              className={`py-4 px-2 ${hasExtraCellInRow
                                ? "border-none bg-transparent"
                                : `${getBorderClasses({ includeBottom: true, includeRight: true })} bg-white`
                                }`}
                            ></td>
                          )}
                        </tr>
                      );
                    },
                  )}
              </tbody>
            </table>
          </div>
          {/* Footer section - fixed at bottom of table area */}
          {(footer || editable) && (
            <div className="shrink-0 bg-white px-6 py-4">
              {footer ? (
                footer
              ) : (
                <button
                  onClick={handleAddRow}
                  className="flex items-center gap-2 text-spline-bold-label text-foreground hover:text-primary transition-colors cursor-pointer"
                  type="button"
                >
                  <Plus size={18} strokeWidth={3} /> {addRowText}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination - fixed at bottom */}
        {paginated &&
          (customPagination || (
            <div className="shrink-0 flex flex-col md:flex-row items-center justify-between px-6 py-4 border-t border-b border-gray gap-3 bg-white rounded">
              <div className="flex items-center gap-3 text-spline-regular-p text-secondary-text">
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <div className="inline-flex items-center gap-2">
                  <button
                    onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-foreground hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => onPageChange?.(page)}
                        className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${page === currentPage
                          ? "bg-accent-yellow text-white"
                          : "bg-white text-foreground hover:bg-gray-100"
                          }`}
                        aria-label={`Go to page ${page}`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() =>
                      onPageChange?.(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-foreground hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
              {showRowsPerPage && (
                <div className="flex items-center gap-2 text-spline-regular-p text-secondary-text relative">
                  <span>Rows:</span>
                  <button
                    ref={rowsPerPageButtonRef}
                    onClick={() => setIsRowsPerPageOpen(!isRowsPerPageOpen)}
                    className="px-2 py-1 rounded-lg bg-white text-foreground inline-flex items-center gap-1 hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    {rowsPerPage} rows
                    <ChevronDown
                      size={16}
                      className={`text-secondary-text transition-transform ${isRowsPerPageOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isRowsPerPageOpen && (
                    <RowsPerPageDropdown
                      currentValue={rowsPerPage}
                      onSelect={(value) => {
                        onRowsPerPageChange?.(value);
                        setIsRowsPerPageOpen(false);
                      }}
                      onClose={() => setIsRowsPerPageOpen(false)}
                      buttonRef={rowsPerPageButtonRef}
                      zIndex={extendedCellZIndex}
                    />
                  )}
                </div>
              )}
            </div>
          ))}

        {/* Detail Modal for Mobile Responsive View */}
        {isMobile && mobileResponsive && selectedMobileRowIndex !== null && (
          <Modal
            isOpen={true}
            onClose={() => setSelectedMobileRowIndex(null)}
            size="md"
            className="rounded-xl overflow-hidden"
            closeOnBackdrop={true}
          >
            <div className="flex items-center justify-between mb-6 bg-white shrink-0">
              <h3 className="text-xl font-bold text-foreground">
                {"Details"}
              </h3>
              <button
                onClick={() => setSelectedMobileRowIndex(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-secondary-text" />
              </button>
            </div>
            <ModalContent className="mt-0 p-0">
              <div className="flex flex-col border-t border-gray-100">
                {columns.map((column) => {
                  const row = rows[selectedMobileRowIndex];
                  if (!row) return null;

                  return (
                    <div
                      key={column.key}
                      className="flex justify-between py-4 border-b border-gray-100 items-start gap-4"
                    >
                      <span className="text-sm font-semibold text-secondary-text min-w-[120px]">
                        {column.label}:
                      </span>
                      <div className="text-sm text-foreground text-right flex-1 wrap-break-word">
                        {renderCell(column, row, selectedMobileRowIndex)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ModalContent>
          </Modal>
        )}
      </div>
    );
  },
);

Table.displayName = "Table";

/**
 * Extended Cell Portal Component
 * Renders extended cell content positioned relative to the cell
 */
interface ExtendedCellPortalProps {
  cellRef: React.RefObject<HTMLTableCellElement | null>;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
  zIndex: number;
  container?: HTMLElement;
}

const ExtendedCellPortal: FC<ExtendedCellPortalProps> = ({
  cellRef,
  isOpen,
  children,
  zIndex,
  container,
}) => {
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  useEffect(() => {
    if (!isOpen || !cellRef.current) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      if (cellRef.current) {
        const rect = cellRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom,
          left: rect.left,
          width: rect.width,
        });
      }
    };

    updatePosition();

    // Update position on scroll/resize
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, cellRef]);

  if (!isOpen || !position) {
    return null;
  }

  const portalContent = (
    <div
      className="fixed"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        zIndex,
      }}
    >
      {children}
    </div>
  );

  return createPortal(portalContent, container || document.body);
};

/**
 * Rows Per Page Dropdown Component
 * Renders a dropdown menu for selecting rows per page
 */
interface RowsPerPageDropdownProps {
  currentValue: number;
  onSelect: (value: number) => void;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  zIndex: number;
}

const RowsPerPageDropdown: FC<RowsPerPageDropdownProps> = ({
  currentValue,
  onSelect,
  onClose,
  buttonRef,
  zIndex,
}) => {
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const rowOptions = [5, 10, 25];

  useEffect(() => {
    if (!buttonRef.current) {
      return;
    }

    const updatePosition = () => {
      if (!buttonRef.current) {
        return;
      }

      const rect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Dropdown dimensions (approximate)
      const dropdownMinWidth = 120;
      const estimatedDropdownHeight = rowOptions.length * 40 + 8; // Approximate height per option + padding
      const gap = 4; // Gap between button and dropdown
      const edgePadding = 8; // Padding from viewport edges

      // Calculate preferred position (below button, left-aligned)
      // Using getBoundingClientRect() gives viewport-relative coordinates, perfect for fixed positioning
      let top = rect.bottom + gap;
      let left = rect.left;
      let width = Math.max(rect.width, dropdownMinWidth);

      // Check right edge overflow
      const rightEdge = left + width;
      if (rightEdge > viewportWidth - edgePadding) {
        // Try aligning to right edge of button
        left = rect.right - width;

        // If still overflowing, constrain to viewport
        if (left < edgePadding) {
          left = edgePadding;
          width = Math.min(width, viewportWidth - left - edgePadding);
        }
      }

      // Check left edge overflow
      if (left < edgePadding) {
        left = edgePadding;
        width = Math.min(width, viewportWidth - left - edgePadding);
      }

      // Check bottom edge overflow
      const bottomEdge = top + estimatedDropdownHeight;
      if (bottomEdge > viewportHeight - edgePadding) {
        // Check if there's more space above
        const spaceAbove = rect.top;
        const spaceBelow = viewportHeight - rect.bottom;

        if (
          spaceAbove > spaceBelow &&
          spaceAbove >= estimatedDropdownHeight + gap
        ) {
          // Show above button
          top = rect.top - estimatedDropdownHeight - gap;
        } else {
          // Constrain to viewport bottom
          top = viewportHeight - estimatedDropdownHeight - edgePadding;
        }
      }

      // Ensure top doesn't go above viewport
      if (top < edgePadding) {
        top = edgePadding;
      }

      setPosition({
        top,
        left,
        width,
      });
    };

    updatePosition();

    // Update position on scroll/resize
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    // Handle click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [buttonRef, onClose, rowOptions.length]);

  if (!position) {
    return null;
  }

  const dropdownContent = (
    <div
      ref={dropdownRef}
      className="fixed bg-white border border-gray rounded-lg shadow-lg py-1 min-w-[120px]"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        zIndex,
      }}
    >
      {rowOptions.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className={`w-full text-left px-3 py-2 text-spline-regular-p transition-colors hover:bg-gray-100 ${currentValue === option
            ? "text-foreground bg-gray-50"
            : "text-secondary-text"
            }`}
        >
          {option} rows
        </button>
      ))}
    </div>
  );

  return createPortal(dropdownContent, document.body);
};

export default Table;
