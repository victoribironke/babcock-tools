import { cn } from "@/lib/utils";
import { is } from "@/pages/_app";
import { useRouter } from "next/router";

const ErrorMessage = () => {
  const { reload } = useRouter();

  return (
    <>
      <section
        className={cn(
          "w-full grid min-h-screen place-items-center px-6 lg:px-8",
          is.className
        )}
      >
        <div className="text-center">
          <p className="text-lg font-bold text-main">Error.</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            An error occured
          </h1>
          <p className="mt-6 text-lg leading-7">Please refresh the page.</p>
          <div className="mt-6 flex items-center justify-center gap-x-6">
            <button
              onClick={reload}
              className="rounded-md bg-main px-3.5 py-2.5 font-medium text-white shadow-sm"
            >
              Refresh
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ErrorMessage;
