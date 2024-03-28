import { classNames } from "@/utils/helpers";
import { useRouter } from "next/router";

const ErrorMessage = () => {
  const router = useRouter();

  return (
    <>
      <section className="w-full grid min-h-screen place-items-center px-6 lg:px-8">
        <div className="text-center">
          <p className="text-lg font-bold text-blue">Error.</p>
          <h1
            className={classNames(
              "mt-4 text-3xl font-bold tracking-tight sm:text-5xl",
              router.pathname.includes("dashboard")
                ? "text-white"
                : "text-gray-900"
            )}
          >
            An error occured
          </h1>
          <p
            className={classNames(
              "mt-6 text-lg leading-7",
              router.pathname.includes("dashboard")
                ? "text-white"
                : "text-gray-900"
            )}
          >
            Please refresh the page.
          </p>
          <div className="mt-6 flex items-center justify-center gap-x-6">
            <button
              onClick={router.reload}
              className="rounded-md bg-blue px-3.5 py-2.5 font-medium text-white shadow-sm"
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
