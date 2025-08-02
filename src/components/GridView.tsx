import { useState, useEffect, useCallback } from "react";
import { Input } from "./ui/input";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import { Bean } from "lucide-react";
import type {
  OnChangeFn,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

interface Props {
  rowIdKey?: string;
  rowCount: number;
  isFetching?: boolean;
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  sorting?: SortingState;
  setSorting?: OnChangeFn<SortingState>;
  globalFilter?: string;
  setGlobalFilter?: OnChangeFn<string>;
  data: Record<string, any>[];
  columns: {
    key: string;
    label: string;
    renderCell?: (row: Record<string, unknown>) => React.ReactNode;
  }[];
}

interface GridItem {
  id: string;
  image?: string;
  name: string;
  description?: string;
  [key: string]: unknown;
}

export const GridView = ({
  rowIdKey = "id",
  rowCount,
  isFetching,
  pagination,
  setPagination,
  sorting,
  setSorting,
  globalFilter,
  setGlobalFilter,
  data,
  columns,
}: Props) => {
  const [filteredData, setFilteredData] = useState<GridItem[]>([]);
  const [sortedData, setSortedData] = useState<GridItem[]>([]);

  const transformDataToGridItems = useCallback(
    (rawData: Record<string, unknown>[]): GridItem[] => {
      return rawData.map((item) => ({
        id: String(item[rowIdKey] || ""),
        image:
          item.image || item.img || item.photo || item.ImageUrl
            ? String(item.image || item.img || item.photo || item.ImageUrl)
            : undefined,
        name: String(
          item.name || item.title || item.label || item.FlavorName || "Untitled"
        ),
        description:
          item.description || item.desc || item.summary || item.Description
            ? String(
                item.description ||
                  item.desc ||
                  item.summary ||
                  item.Description
              )
            : undefined,
        ...item,
      }));
    },
    [rowIdKey]
  );

  useEffect(() => {
    const gridItems = transformDataToGridItems(data);
    if (!globalFilter) {
      setFilteredData(gridItems);
      return;
    }

    const filtered = gridItems.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(globalFilter.toLowerCase())
      )
    );
    setFilteredData(filtered);
  }, [data, globalFilter, transformDataToGridItems]);

  useEffect(() => {
    if (!sorting || sorting.length === 0) {
      setSortedData(filteredData);
      return;
    }

    const sorted = [...filteredData].sort((a, b) => {
      for (const sort of sorting) {
        const aValue = String(a[sort.id] || "");
        const bValue = String(b[sort.id] || "");

        if (aValue === bValue) continue;

        const comparison = aValue.localeCompare(bValue);
        return sort.desc ? -comparison : comparison;
      }
      return 0;
    });

    setSortedData(sorted);
  }, [filteredData, sorting]);

  const handleSort = (field: string) => {
    if (!setSorting) return;

    const currentSort = sorting?.find((s) => s.id === field);
    if (!currentSort) {
      setSorting([{ id: field, desc: false }]);
    } else if (!currentSort.desc) {
      setSorting([{ id: field, desc: true }]);
    } else {
      setSorting([]);
    }
  };

  const getSortIcon = (field: string) => {
    const currentSort = sorting?.find((s) => s.id === field);
    if (!currentSort) return null;
    return currentSort.desc ? " ==" : " =<";
  };

  const sortableFields = columns.map((col) => ({
    key: col.key,
    label: col.label,
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Input
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter?.(String(e.target.value))}
          placeholder="Search..."
          className="max-w-sm"
        />

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            className="border rounded px-2 py-1 text-sm"
            onChange={(e) => e.target.value && handleSort(e.target.value)}
            value={sorting?.[0]?.id || ""}
          >
            <option value="">None</option>
            {sortableFields.map((field) => (
              <option key={field.key} value={field.key}>
                {field.label}
                {getSortIcon(field.key)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {sortedData.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200"
          >
            {item.image && (
              <div className="aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <div className="p-4 space-y-2">
              <h3
                className="font-semibold text-gray-900 truncate"
                title={item.name}
              >
                {item.name}
              </h3>

              {item.description && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm text-gray-600 line-clamp-2 cursor-help">
                      {item.description}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p className="whitespace-normal">{item.description}</p>
                  </TooltipContent>
                </Tooltip>
              )}

              <div className="space-y-1">
                {columns
                  .filter(
                    (col) =>
                      col.key !== "ImageUrl" &&
                      col.key !== "FlavorName" &&
                      col.key !== "Description"
                  )
                  .slice(0, 2)
                  .map((col) => {
                    const value = item[col.key];
                    if (!value) return null;

                    return (
                      <div
                        key={col.key}
                        className="text-xs text-gray-500 flex justify-between"
                      >
                        <span className="font-medium">{col.label}:</span>
                        <span className="truncate ml-2">
                          {col.renderCell
                            ? col.renderCell(item)
                            : String(value)}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 pt-4">
        <div className="flex items-center gap-2">
          <button
            className="border rounded p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            onClick={() =>
              setPagination({ pageIndex: 0, pageSize: pagination.pageSize })
            }
            disabled={pagination.pageIndex === 0}
          >
            {"<<"}
          </button>
          <button
            className="border rounded p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            onClick={() =>
              setPagination({
                pageIndex: pagination.pageIndex - 1,
                pageSize: pagination.pageSize,
              })
            }
            disabled={pagination.pageIndex === 0}
          >
            {"<"}
          </button>
          <button
            className="border rounded p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            onClick={() =>
              setPagination({
                pageIndex: pagination.pageIndex + 1,
                pageSize: pagination.pageSize,
              })
            }
            disabled={
              pagination.pageIndex >=
              Math.ceil(rowCount / pagination.pageSize) - 1
            }
          >
            {">"}
          </button>
          <button
            className="border rounded p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            onClick={() =>
              setPagination({
                pageIndex: Math.ceil(rowCount / pagination.pageSize) - 1,
                pageSize: pagination.pageSize,
              })
            }
            disabled={
              pagination.pageIndex >=
              Math.ceil(rowCount / pagination.pageSize) - 1
            }
          >
            {">>"}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-sm">
            <div>Page</div>
            <strong>
              {pagination.pageIndex + 1} of{" "}
              {Math.ceil(rowCount / pagination.pageSize).toLocaleString()}
            </strong>
          </span>

          <span className="flex items-center gap-1 text-sm">
            | Go to page:
            <input
              type="number"
              min="1"
              max={Math.ceil(rowCount / pagination.pageSize)}
              defaultValue={pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                setPagination({
                  pageIndex: page,
                  pageSize: pagination.pageSize,
                });
              }}
              className="border p-1 rounded w-16 text-center"
            />
          </span>

          <select
            value={pagination.pageSize}
            onChange={(e) => {
              setPagination({ pageIndex: 0, pageSize: Number(e.target.value) });
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>

          {isFetching && (
            <Bean className="h-6 w-6 text-orange-500 animate-bounce" />
          )}
        </div>
      </div>

      <div className="text-sm text-gray-600 text-center">
        Showing {sortedData.length.toLocaleString()} of{" "}
        {rowCount?.toLocaleString()} items
      </div>
    </div>
  );
};
