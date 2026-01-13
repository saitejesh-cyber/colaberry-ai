import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";

import "../styles/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={poppins.variable}>
      <Component {...pageProps} />
    </div>
  );
}
