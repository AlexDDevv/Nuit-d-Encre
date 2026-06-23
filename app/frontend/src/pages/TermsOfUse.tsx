import { Fragment, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import LegalHeader from "@/components/sections/legal/LegalHeader";
import LegalSection from "@/components/sections/legal/LegalSection";
import { TocDesktop, TocMobile } from "@/components/sections/legal/LegalSummary";
import { LegalContent } from "@/components/sections/legal/types";
import BackToTop from "@/components/sections/shared/BackToTop";
import { SectionSeparator } from "@/components/sections/shared/ornaments";
import SignatureFooter from "@/components/sections/shared/SignatureFooter";
import legalData from "@/data/legal.json";

const { sections, lastUpdate } = legalData as LegalContent;

export default function TermsOfUse() {
    const [active, setActive] = useState(sections[0].id);
    const [showTop, setShowTop] = useState(false);
    const refs = useRef<Record<string, HTMLElement>>({});

    const registerRef = (id: string, el: HTMLElement | null) => {
        if (el) refs.current[id] = el;
    };

    // scroll-spy : surligne la section visible la plus haute
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top - b.boundingClientRect.top,
                    );
                const id = visible[0]?.target.getAttribute("data-section");
                if (id) setActive(id);
            },
            { rootMargin: "-96px 0px -55% 0px", threshold: [0, 0.1, 0.5] },
        );

        Object.values(refs.current).forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    // visibilité du bouton « revenir en haut »
    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 420);
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
            <Helmet>
                <title>Mentions Légales | Nuit d'Encre</title>
                <meta
                    name="description"
                    content="Mentions légales et informations juridiques concernant Nuit d'Encre, application de bibliothèque en ligne."
                />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="/legal" />
            </Helmet>

            <div className="mx-auto w-full max-w-6xl">
                <div className="fade-up">
                    <LegalHeader lastUpdate={lastUpdate} />
                </div>

                <div className="mt-8 lg:grid lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-12">
                    {/* colonne sommaire - bureau */}
                    <aside className="hidden lg:block">
                        <TocDesktop
                            sections={sections}
                            active={active}
                            onJump={setActive}
                        />
                    </aside>

                    {/* sous lg : accordéon en tête du corps */}
                    <div className="mb-8 lg:hidden">
                        <TocMobile
                            sections={sections}
                            active={active}
                            onJump={setActive}
                        />
                    </div>

                    {/* corps du document */}
                    <div>
                        {sections.map((s, i) => (
                            <Fragment key={s.id}>
                                {i > 0 && <SectionSeparator />}
                                <LegalSection
                                    section={s}
                                    lastUpdate={lastUpdate}
                                    registerRef={registerRef}
                                />
                            </Fragment>
                        ))}

                        <SignatureFooter />
                    </div>
                </div>
            </div>

            <BackToTop visible={showTop} />
        </>
    );
}
