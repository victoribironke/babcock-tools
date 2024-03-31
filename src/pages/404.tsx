import HeadTemplate from "@/components/general/HeadTemplate";
import Link from "next/link";

const NotFound = () => {
  return (
    <>
      <HeadTemplate title="Page not found" />

      <section className="w-full grid min-h-screen place-items-center px-6 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-blue">404</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-6 text-base leading-7">
            Sorry, we could not find the page you are looking for.
          </p>
          <div className="mt-6 flex items-center justify-center gap-x-6">
            <Link
              href="/"
              className="rounded-md bg-blue px-3.5 py-2.5 text-sm font-medium text-white shadow-sm"
            >
              Go back home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
