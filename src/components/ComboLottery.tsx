import { DotLottieReact, type DotLottie } from "@lottiefiles/dotlottie-react";
import { useCallback, useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import type { Bean, Combination } from "@/api/tikal";
import { cn } from "@/lib/utils";
import { GridView } from "./GridView";

type ExtendedCombination = Combination & {
  matchPercentage: number;
};

interface Props {
  combinations: ExtendedCombination[];
  beans: Bean[];
  columns: {
    key: string;
    label: string;
    renderCell?: (row: Record<string, any>) => React.ReactNode;
  }[];
}

export default function ComboLottery({ combinations, beans, columns }: Props) {
  const [randomCombination, setRandomCombination] =
    useState<ExtendedCombination | null>(null);
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);

  const onLoad = useCallback(
    () => dotLottie?.setFrame(dotLottie.totalFrames - 1),
    [dotLottie]
  );
  const onComplete = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * combinations.length);
    setRandomCombination(combinations[randomIndex]);
  }, [combinations]);

  useEffect(() => {
    if (dotLottie) {
      dotLottie.addEventListener("load", onLoad);
      dotLottie.addEventListener("complete", onComplete);
    }

    return () => {
      if (dotLottie) {
        dotLottie.removeEventListener("load", onLoad);
        dotLottie.removeEventListener("complete", onComplete);
      }
    };
  }, [dotLottie, onLoad, onComplete]);

  return (
    <div className="text-md text-gray-50">
      <Tooltip open>
        <TooltipTrigger className="cursor-pointer">
          <div
            className="w-16 h-16 mx-auto cursor-pointer"
            onClick={() => dotLottie?.play()}
          >
            <DotLottieReact
              loop={false}
              autoplay={false}
              src="/dice.lottie"
              dotLottieRefCallback={setDotLottie}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center animate-bounce">
            Click to roll the dice
            <br />
            for a random combination!
          </div>
        </TooltipContent>
      </Tooltip>
      <AlertDialog open={!!randomCombination}>
        <AlertDialogContent className="!max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {randomCombination?.Name}{" "}
              {randomCombination?.matchPercentage && (
                <span
                  className={cn("text-xs text-gray-500", {
                    "text-red-500": randomCombination?.matchPercentage <= 0.3,
                    "text-yellow-500":
                      randomCombination?.matchPercentage > 0.3 &&
                      randomCombination?.matchPercentage < 0.75,
                    "text-green-500":
                      randomCombination?.matchPercentage >= 0.75,
                  })}
                >
                  ({(randomCombination?.matchPercentage * 100).toFixed(0)}%
                  match)
                </span>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {randomCombination?.TagSerialized.split(",").join(" ")}
              <GridView
                rowIdKey="BeanId"
                rowCount={beans.length}
                isFetching={false}
                data={beans.filter((bean) =>
                  randomCombination?.TagSerialized.includes(bean.FlavorName)
                )}
                columns={columns}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRandomCombination(null)}>
              Thanks!
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
