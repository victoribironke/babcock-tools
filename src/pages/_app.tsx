import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { classNames } from "@/utils/helpers";
import { Toaster } from "react-hot-toast";
import { Bricolage_Grotesque } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { RecoilRoot } from "recoil";
import { useRouter } from "next/router";
import DashboardTemplate from "@/components/dashboard/DashboardTemplate";
import { ErrorBoundary } from "react-error-boundary";
import ErrorMessage from "@/components/hoc/ErrorMessage";

const bg = Bricolage_Grotesque({ subsets: ["latin"], display: "swap" });

// const gt = localFont({
//   src: [
//     {
//       path: "../../public/fonts/GTWalsheimPro-Black.ttf",
//       weight: "700",
//     },
//     {
//       path: "../../public/fonts/GTWalsheimPro-Bold.ttf",
//       weight: "600",
//     },
//     {
//       path: "../../public/fonts/GTWalsheimPro-Medium.ttf",
//       weight: "500",
//     },
//     {
//       path: "../../public/fonts/GTWalsheimPro-Regular.ttf",
//       weight: "400",
//     },
//     {
//       path: "../../public/fonts/GTWalsheimPro-Light.ttf",
//       weight: "300",
//     },
//     {
//       path: "../../public/fonts/GTWalsheimPro-Thin.ttf",
//       weight: "200",
//     },
//     {
//       path: "../../public/fonts/GTWalsheimPro-UltraLight.ttf",
//       weight: "100",
//     },
//   ],
//   variable: "--font-gt",
// });

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  return (
    <RecoilRoot>
      <Analytics />
      <Toaster toastOptions={{ className: bg.className }} />
      <main
        className={classNames(
          bg.className,
          "min-h-screen w-full flex items-center justify-start flex-col relative",
          router.pathname.includes("dashboard") ? "bg-dark-blue" : "bg-white" //"bg-gradient-to-b from-gray-200 to-[#b1cdfb]"
        )}
      >
        <ErrorBoundary
          // onError={(e) => console.log(e)}
          FallbackComponent={ErrorMessage}
        >
          {router.pathname.includes("dashboard") ? (
            <DashboardTemplate>
              <Component {...pageProps} />
            </DashboardTemplate>
          ) : (
            <Component {...pageProps} />
          )}
        </ErrorBoundary>
      </main>
    </RecoilRoot>
  );
};

export default App;
