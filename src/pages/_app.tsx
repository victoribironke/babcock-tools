import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { classNames } from "@/utils/helpers";
import { Toaster } from "react-hot-toast";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import { RecoilRoot } from "recoil";
import { useRouter } from "next/router";

const gt = localFont({
  src: [
    {
      path: "../../public/fonts/GTWalsheimPro-Black.ttf",
      weight: "700",
    },
    {
      path: "../../public/fonts/GTWalsheimPro-Bold.ttf",
      weight: "600",
    },
    {
      path: "../../public/fonts/GTWalsheimPro-Medium.ttf",
      weight: "500",
    },
    {
      path: "../../public/fonts/GTWalsheimPro-Regular.ttf",
      weight: "400",
    },
    {
      path: "../../public/fonts/GTWalsheimPro-Light.ttf",
      weight: "300",
    },
    {
      path: "../../public/fonts/GTWalsheimPro-Thin.ttf",
      weight: "200",
    },
    {
      path: "../../public/fonts/GTWalsheimPro-UltraLight.ttf",
      weight: "100",
    },
  ],
  variable: "--font-gt",
});

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  return (
    <RecoilRoot>
      <Analytics />
      <Toaster toastOptions={{ className: gt.className }} />
      <main
        className={classNames(
          gt.className,
          "min-h-screen w-full flex items-center justify-start flex-col relative",
          router.pathname.includes("dashboard") && "bg-dark-blue"
        )}
      >
        <Component {...pageProps} />
      </main>
    </RecoilRoot>
  );
};

export default App;
