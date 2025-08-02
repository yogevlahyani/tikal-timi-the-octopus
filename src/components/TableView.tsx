import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type OnChangeFn,
  type PaginationState,
} from "@tanstack/react-table";
import { Bean } from "lucide-react";

interface Props {
  rowIdKey?: string;
  rowCount: number;
  isFetching?: boolean;
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  data: Record<string, any>[];
  columns: {
    key: string;
    label: string;
    renderCell?: (row: Record<string, any>) => React.ReactNode;
  }[];
}

const columnHelper = createColumnHelper<Record<string, any>>();

export const TableView = ({
  rowIdKey = "id",
  rowCount,
  isFetching,
  pagination,
  setPagination,
  data,
  columns,
}: Props) => {
  const table = useReactTable({
    data,
    columns: columns.map((col) =>
      columnHelper.accessor(col.key, {
        header: () => col.label,
        cell: (info) =>
          col.renderCell ? col.renderCell(info.row.original) : info.getValue(),
      })
    ),
    getCoreRowModel: getCoreRowModel(),
    getRowId: (originalRow) => originalRow[rowIdKey],
    manualPagination: true,
    rowCount,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  });

  return (
    <>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-500/20">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="p-2 first:rounded-s-full last:rounded-e-full"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
        {isFetching && (
          <Bean className="h-8 w-32 text-orange-500 animate-bounce" />
        )}
      </div>
      <div>
        Showing {table.getRowModel().rows.length.toLocaleString()} of{" "}
        {rowCount?.toLocaleString()} Rows
      </div>
    </>
  );
};
