import { useSuspenseQuery } from "@tanstack/react-query";
import { tikalApi } from "@/api/tikal";
import { useState } from "react";
import { TableView } from "./TableView";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Grid2X2, Table2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const ViewMode = {
  Table: "table",
  Grid: "grid",
} as const;

type ViewMode = (typeof ViewMode)[keyof typeof ViewMode];

export default function Beans() {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Table);
  const { data } = useSuspenseQuery({
    queryKey: ["beans"],
    queryFn: () => tikalApi.getBeans({ limit: 10 }),
  });

  const renderView = () => {
    switch (viewMode) {
      default:
      case ViewMode.Table:
        return (
          <TableView
            rowIdKey="BeanId"
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
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                        Gluten Free
                      </span>
                    )}
                    {row.Kosher && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Kosher
                      </span>
                    )}
                    {row.Seasonal && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Seasonal
                      </span>
                    )}
                    {row.SugarFree && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
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
              "bg-blue-500 text-white": viewMode === ViewMode.Table,
              "bg-gray-200": viewMode !== ViewMode.Table,
            })}
            onClick={() => setViewMode(ViewMode.Table)}
          >
            <Table2 className="h-4 w-4" />
          </Button>
          <Button
            className={cn({
              "bg-blue-500 text-white": viewMode === ViewMode.Grid,
              "bg-gray-200 text-blue-500": viewMode !== ViewMode.Grid,
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
