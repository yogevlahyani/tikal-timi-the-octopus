import { useQuery } from "@tanstack/react-query";
import { tikalApi } from "@/api/tikal";
import { useState } from "react";
import { TableView } from "./TableView";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Bean, Grid2X2, Table2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import type { PaginationState, SortingState } from "@tanstack/react-table";

const ViewMode = {
  Table: "table",
  Grid: "grid",
} as const;

type ViewMode = (typeof ViewMode)[keyof typeof ViewMode];

export default function Beans() {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Table);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const { data, isFetching } = useQuery({
    queryKey: ["beans", pagination],
    queryFn: () =>
      tikalApi.getBeans({
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
      }),
    placeholderData: (previousData) => previousData,
  });

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Bean className="h-8 w-32 text-orange-500 animate-bounce" />
      </div>
    );
  }

  const renderView = () => {
    switch (viewMode) {
      default:
      case ViewMode.Table:
        return (
          <TableView
            rowIdKey="BeanId"
            rowCount={data.total}
            isFetching={isFetching}
            pagination={pagination}
            setPagination={setPagination}
            sorting={sorting}
            setSorting={setSorting}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            data={data.data}
            columns={[
              {
                key: "ImageUrl",
                label: "Image",
                renderCell: (row) => (
                  <img
                    src={row.ImageUrl}
                    alt={row.FlavorName}
                    className="w-16 object-cover rounded mx-auto"
                  />
                ),
              },
              {
                key: "FlavorName",
                label: "Name",
              },
              {
                key: "Description",
                label: "Description",
                renderCell: (row) => (
                  <Tooltip>
                    <TooltipTrigger>
                      {row.Description?.length > 50
                        ? `${row.Description.slice(0, 50)}...`
                        : row.Description || "No description"}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{row.Description}</p>
                    </TooltipContent>
                  </Tooltip>
                ),
              },
              {
                key: "Attributes",
                label: "Attributes",
                renderCell: (row) => (
                  <div className="flex flex-wrap gap-1">
                    {row.GlutenFree && (
                      <span className="bg-jellybean-lime/20 text-jellybean-lime px-2 py-1 rounded">
                        Gluten Free
                      </span>
                    )}
                    {row.Kosher && (
                      <span className="bg-jellybean-sky/20 text-jellybean-sky px-2 py-1 rounded">
                        Kosher
                      </span>
                    )}
                    {row.Seasonal && (
                      <span className="bg-jellybean-lemon/20 text-jellybean-lemon px-2 py-1 rounded">
                        Seasonal
                      </span>
                    )}
                    {row.SugarFree && (
                      <span className="bg-jellybean-cherry/20 text-jellybean-cherry px-2 py-1 rounded">
                        Sugar Free
                      </span>
                    )}
                  </div>
                ),
              },
            ]}
          />
        );

      case ViewMode.Grid:
        return <div>Grid View</div>;
    }
  };

  return (
    <div className="flex flex-col w-full gap-8">
      <div className="flex justify-between items-center">
        <h3>
          Total of <strong className="font-bold">{data.total}</strong> Beans
        </h3>
        <div className="flex gap-2">
          <Button
            className={cn({
              "bg-primary text-primary-foreground": viewMode === ViewMode.Table,
              "bg-secondary text-secondary-foreground":
                viewMode !== ViewMode.Table,
            })}
            onClick={() => setViewMode(ViewMode.Table)}
          >
            <Table2 className="h-4 w-4" />
          </Button>
          <Button
            className={cn({
              "bg-primary text-primary-foreground": viewMode === ViewMode.Grid,
              "bg-secondary text-secondary-foreground":
                viewMode !== ViewMode.Grid,
            })}
            onClick={() => setViewMode(ViewMode.Grid)}
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <hr />
      {renderView()}
    </div>
  );
}
