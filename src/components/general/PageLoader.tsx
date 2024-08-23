import { cn } from "@/lib/utils";
import { PageLoaderProps } from "@/types/general";

const PageLoader = ({ type }: PageLoaderProps) => {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center",
        type === "full" ? "h-screen" : "h-auto p-4"
      )}
    >
      <div className="w-12 h-12 z-10 rounded-full border-4 border-t-main border-l-main border-r-main animate-spin" />
    </div>
  );
};

export default PageLoader;
