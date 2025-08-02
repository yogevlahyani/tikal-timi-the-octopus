import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { tikalApi } from "@/api/tikal";
import { Bean } from "lucide-react";
import { isOrangish } from "@/utils/hex";
import { GridView } from "./GridView";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { cn } from "@/lib/utils";
import ComboLottery from "./ComboLottery";

export default function Recommendations() {
  const { data: colors } = useSuspenseQuery({
    queryKey: ["colors"],
    queryFn: () => tikalApi.getColors(),
    select: ({ data }) =>
      data
        .filter((color) => color.hex.every((value) => isOrangish(value)))
        .map((color) => color.colorId),
  });

  const {
    data: beans,
    isLoading,
    isFetching,
    isError,
  } = useSuspenseQuery({
    queryKey: ["all-beans"],
    queryFn: () => tikalApi.fetchAllParallel(),
  });

  const preferredBeans = useMemo(
    () => beans.filter((bean) => colors.includes(bean.ColorGroup)),
    [beans, colors]
  );

  const { data: combinations } = useSuspenseQuery({
    queryKey: ["combinations"],
    queryFn: () => tikalApi.getCombinations(),
    select: ({ data }) =>
      data
        .filter((combo) =>
          combo.TagSerialized.split(",").some((bean) =>
            preferredBeans.some((b) => b.FlavorName === bean)
          )
        )
        .map((combo) => ({
          ...combo,
          matchPercentage:
            combo.TagSerialized.split(",")
              .map((bean) => preferredBeans.find((b) => b.FlavorName === bean))
              .filter(Boolean).length / preferredBeans.length,
        }))
        .sort((a, b) => b.matchPercentage - a.matchPercentage),
  });

  if (isLoading)
    return <Bean className="h-8 w-32 text-orange-500 animate-bounce" />;
  if (isError) throw new Error("Failed to fetch beans attributes");

  const columns = [
    {
      key: "ImageUrl",
      label: "Image",
      renderCell: (row: Record<string, any>) => (
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
      renderCell: (row: Record<string, any>) => (
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
      renderCell: (row: Record<string, any>) => (
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
  ];

  return (
    <div className="flex flex-col w-full gap-8">
      <div className="fixed bottom-12 right-18 z-10">
        <ComboLottery
          combinations={combinations}
          beans={beans}
          columns={columns}
        />
      </div>
      <GridView
        rowIdKey="BeanId"
        rowCount={preferredBeans.length}
        isFetching={isFetching}
        data={preferredBeans}
        columns={columns}
      />
      <h2 className="text-2xl font-semibold">Combinations:</h2>
      <Accordion type="single" collapsible>
        {combinations.map((combo) => (
          <AccordionItem value={`${combo.CombinationId}`}>
            <div key={combo.CombinationId} className="space-y-4">
              <AccordionTrigger>
                <div className="flex flex-1 items-center justify-between">
                  {combo.Name}{" "}
                  <span
                    className={cn("text-xs text-gray-500", {
                      "text-red-500": combo.matchPercentage <= 0.1,
                      "text-yellow-500":
                        combo.matchPercentage > 0.1 &&
                        combo.matchPercentage < 0.3,
                      "text-green-500": combo.matchPercentage >= 0.3,
                    })}
                  >
                    ({(combo.matchPercentage * 100).toFixed(0)}% match)
                  </span>
                </div>
              </AccordionTrigger>
            </div>
            <AccordionContent>
              {combo.TagSerialized.split(",").join(" ")}
              <GridView
                rowIdKey="BeanId"
                rowCount={beans.length}
                isFetching={isFetching}
                data={beans.filter((bean) =>
                  combo.TagSerialized.includes(bean.FlavorName)
                )}
                columns={columns}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
