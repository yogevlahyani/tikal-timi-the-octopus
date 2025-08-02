import { useSuspenseQuery } from "@tanstack/react-query";
import { BarChart } from "./BarChart";
import { tikalApi } from "@/api/tikal";
import { Bean } from "lucide-react";

export default function Discovery() {
  const { data, isLoading, isError } = useSuspenseQuery({
    queryKey: ["beans-attributes"],
    queryFn: () => tikalApi.fetchAllParallel(),
    select: (data) =>
      data.reduce(
        (acc, bean) => {
          acc.GlutenFree += bean.GlutenFree ? 1 : 0;
          acc.SugarFree += bean.SugarFree ? 1 : 0;
          acc.Seasonal += bean.Seasonal ? 1 : 0;
          acc.Kosher += bean.Kosher ? 1 : 0;
          return acc;
        },
        { GlutenFree: 0, SugarFree: 0, Seasonal: 0, Kosher: 0 }
      ),
  });

  const getColorForAttribute = (attribute: string) => {
    switch (attribute) {
      case "GlutenFree":
        return "#f9f3a8";
      case "SugarFree":
        return "#b8d4b8";
      case "Seasonal":
        return "#b8c8d4";
      case "Kosher":
        return "#d4b8d4";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading)
    return <Bean className="h-8 w-32 text-orange-500 animate-bounce" />;
  if (isError) throw new Error("Failed to fetch beans attributes");

  return (
    <div className="flex flex-col w-full gap-8">
      <BarChart
        data={Object.keys(data).map((key: string) => ({
          label: key,
          value: data[key as keyof typeof data],
          color: getColorForAttribute(key),
        }))}
      />
    </div>
  );
}
