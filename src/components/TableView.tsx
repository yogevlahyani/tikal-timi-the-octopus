import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface Props {
  rowIdKey?: string;
  data: Record<string, any>[];
  columns: {
    key: string;
    label: string;
    renderCell?: (row: Record<string, any>) => React.ReactNode;
  }[];
}

const columnHelper = createColumnHelper<Record<string, any>>();

export const TableView = ({ rowIdKey = "id", data, columns }: Props) => {
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
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
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
              <td key={cell.id}>
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
  );
};
