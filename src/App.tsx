import { useState } from "react";
import AgeGate from "@/components/AgeGate";
import { BagProvider } from "@/components/BagContext";
import BagDrawer from "@/components/BagDrawer";
import { ClickSplash, Cursor, ScrollProgress } from "@/components/Effects";
import LiquidEdge from "@/components/LiquidEdge";
import Navbar from "@/components/Navbar";
import { CREAM, CREAM_DRIPS, FOOTER_EDGE, INK, INK_DRIPS, MENU_EDGE } from "@/components/edges";
import { useSmoothScroll } from "@/lib/scroll";
import Calculator from "@/sections/Calculator";
import Faq from "@/sections/Faq";
import Footer from "@/sections/Footer";
import Hero from "@/sections/Hero";
import Lineup from "@/sections/Lineup";
import Marquee from "@/sections/Marquee";
import Menu from "@/sections/Menu";

const AGE_KEY = "puff-age-ok";

function readAgeOk() {
  try {
    return localStorage.getItem(AGE_KEY) === "1";
  } catch {
    return false;
  }
}

export default function App() {
  const [ready, setReady] = useState(readAgeOk);
  const [gate, setGate] = useState(() => !readAgeOk());
  useSmoothScroll();

  return (
    <BagProvider>
      <ScrollProgress />
      <Navbar show={ready} />

      <main className="relative">
        <Hero ready={ready} />
        <Menu />
        <LiquidEdge shape={MENU_EDGE} fill={CREAM} bg={INK} flip className="-mt-px" />
        <Marquee />
        <Lineup />
        <LiquidEdge shape={CREAM_DRIPS} fill={CREAM} bg={INK} className="-mb-px" />
        <Calculator />
        <LiquidEdge shape={INK_DRIPS} fill={INK} bg={CREAM} className="-mt-px" />
        <Faq />
        <LiquidEdge shape={FOOTER_EDGE} fill={INK} bg={CREAM} flip className="-mb-px" />
      </main>

      <Footer />
      <BagDrawer />

      {gate && (
        <AgeGate
          onEnter={() => {
            try {
              localStorage.setItem(AGE_KEY, "1");
            } catch {
              /* ignore */
            }
            setReady(true);
          }}
          onDone={() => setGate(false)}
        />
      )}

      <Cursor />
      <ClickSplash />
      <div className="grain" aria-hidden="true" />
    </BagProvider>
  );
}
