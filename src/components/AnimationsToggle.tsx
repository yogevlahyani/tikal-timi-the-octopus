import { cn } from "@/lib/utils";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useRef } from "react";
import { Switch } from "./ui/switch";

interface Props {
  className?: string;
}

export default function AnimationsToggle({ className }: Props) {
  const [skipAnimations, setSkipAnimations] = useLocalStorage(
    "skipAnimations",
    false
  );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleAnimations = () => {
    setSkipAnimations(!skipAnimations);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div
      className={cn("flex items-center gap-2 cursor-pointer", className)}
      onClick={toggleAnimations}
    >
      <Switch checked={skipAnimations} className="cursor-pointer" />
      <span className="text-sm">Skip Animations</span>
    </div>
  );
}
