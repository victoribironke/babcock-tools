import { IMAGES } from "@/constants/images";
import { HeadTemplateProps } from "@/types/general";
import Head from "next/head";

const HeadTemplate = ({ title }: HeadTemplateProps) => {
  return (
    <Head>
      <title>{title ? `${title} — Babcock Tools` : "Babcock Tools"}</title>
      <link rel="shortcut-icon" href={IMAGES.logo.src} type="image/x-icon" />
      <link rel="icon" href={IMAGES.logo.src} type="image/x-icon" />
      <meta
        name="description"
        content="A suite of tools for Babcock University students."
      />
      {/* <!-- Facebook Meta Tags --> */}
      <meta property="og:url" content="https://www.babcock.tools" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Babcock Tools" />
      <meta
        property="og:description"
        content="A suite of tools for Babcock University students."
      />
      <meta
        property="og:image"
        content="https://www.babcock.tools/images/logo.jpeg"
      />
      {/* <!-- Twitter Meta Tags --> */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="www.babcock.tools" />
      <meta property="twitter:url" content="https://www.babcock.tools" />
      <meta name="twitter:title" content="Babcock Tools" />
      <meta
        name="twitter:description"
        content="A suite of tools for Babcock University students."
      />
      <meta
        name="twitter:image"
        content="https://www.babcock.tools/images/logo.jpeg"
      />
    </Head>
  );
};

export default HeadTemplate;
