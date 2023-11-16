import { IMAGES } from "@/constants/images";
import { HeadTemplateProps } from "@/types/general";
import Head from "next/head";

const HeadTemplate = ({ title }: HeadTemplateProps) => {
  return (
    <Head>
      <title>{title ? `${title} — Babcock Tools` : "Babcock Tools"}</title>
      <link rel="shortcut-icon" href={IMAGES.logo.src} type="image/x-icon" />
      <link rel="icon" href={IMAGES.logo.src} type="image/x-icon" />
      {/* <meta
        name="description"
        content="List your space, get bookings and get paid from one place."
      /> */}
      {/* <!-- Facebook Meta Tags --> */}
      {/* <meta property="og:url" content="https://app.ventivo.co" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Ventivo" />
      <meta
        property="og:description"
        content="List your space, get bookings and get paid from one place."
      />
      <meta
        property="og:image"
        content="https://app.ventivo.co/logo-padding.png"
      /> */}
      {/* <!-- Twitter Meta Tags --> */}
      {/* <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="app.ventivo.co" />
      <meta property="twitter:url" content="https://app.ventivo.co" />
      <meta name="twitter:title" content="Ventivo" />
      <meta
        name="twitter:description"
        content="List your space, get bookings and get paid from one place."
      />
      <meta
        name="twitter:image"
        content="https://app.ventivo.co/logo-padding.png"
      /> */}
    </Head>
  );
};

export default HeadTemplate;
