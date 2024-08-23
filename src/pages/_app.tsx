import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ErrorBoundary } from "react-error-boundary";
import { cn } from "@/lib/utils";
import { Instrument_Sans } from "next/font/google";
import { useRouter } from "next/router";
import DashboardTemplate from "@/components/dashboard/DashboardTemplate";
import { Toaster } from "react-hot-toast";
import { RecoilRoot } from "recoil";
import { Analytics } from "@vercel/analytics/react";
import Head from "next/head";
import ErrorMessage from "@/components/hoc/ErrorMessage";

export const is = Instrument_Sans({ display: "swap", subsets: ["latin"] });

const App = ({ Component, pageProps }: AppProps) => {
  const { pathname } = useRouter();

  return (
    <RecoilRoot>
      <Analytics />
      <Toaster
        toastOptions={{
          className: is.className,
        }}
      />
      <ErrorBoundary FallbackComponent={ErrorMessage}>
        <main
          className={cn(
            "w-full min-h-screen flex items-center justify-center",
            is.className
          )}
        >
          <Head>
            <title>Babcock Tools</title>
          </Head>

          {pathname.includes("dashboard") ? (
            <DashboardTemplate>
              <Component {...pageProps} />
            </DashboardTemplate>
          ) : (
            <Component {...pageProps} />
          )}
        </main>
      </ErrorBoundary>
    </RecoilRoot>
  );
};

export default App;
