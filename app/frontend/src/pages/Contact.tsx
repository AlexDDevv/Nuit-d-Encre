import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { LuBookHeart, LuCircleHelp, LuSend } from "react-icons/lu";
import ContactFaq from "@/components/sections/contact/ContactFaq";
import ContactHero from "@/components/sections/contact/ContactHero";
import SocialMedallion from "@/components/sections/contact/SocialMedallion";
import StatMedallion from "@/components/sections/contact/StatMedallion";
import SupportCard from "@/components/sections/contact/SupportCard";
import UsefulLinks from "@/components/sections/contact/UsefulLinks";
import BackToTop from "@/components/sections/shared/BackToTop";
import BlockHeading from "@/components/sections/shared/BlockHeading";
import { SectionSeparator } from "@/components/sections/shared/ornaments";
import SignatureFooter from "@/components/sections/shared/SignatureFooter";
import { ABOUT_PARAS, CONTACT, STAT_DEFS } from "@/data/contact";
import { SOCIAL_LINKS } from "@/data/socials";
import { useSiteStats } from "@/hooks/stats/useSiteStats";
import { cn } from "@/lib/utils";

const numberFormatter = new Intl.NumberFormat("fr-FR");

export default function Contact() {
    const [showTop, setShowTop] = useState(false);
    const { stats } = useSiteStats();

    // Toggle the "back to top" button past a scroll threshold.
    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 420);
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
            <Helmet>
                <title>Contact | Nuit d'Encre</title>
                <meta
                    name="description"
                    content="Contacter l'équipe de Nuit d'Encre, en savoir plus sur la bibliothèque et consulter la foire aux questions."
                />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="/about" />
            </Helmet>

            <div className="mx-auto w-full max-w-5xl">
                <div className="fade-up">
                    <ContactHero />
                </div>

                <SectionSeparator />
                <section
                    id="a-propos"
                    data-section="a-propos"
                    className="scroll-mt-24"
                >
                    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-12">
                        <div>
                            <BlockHeading
                                icon={LuBookHeart}
                                eyebrow="La maison"
                                title="À propos de Nuit d'Encre"
                            />
                            <div className="text-foreground/75 mt-6 max-w-[60ch] space-y-4 text-base leading-[1.85]">
                                {ABOUT_PARAS.map((p, i) => (
                                    <p
                                        key={i}
                                        className={cn(
                                            "text-pretty",
                                            i === 0 &&
                                                "text-foreground/85 font-quote text-lg italic leading-relaxed",
                                        )}
                                    >
                                        {p}
                                    </p>
                                ))}
                            </div>

                            <div className="mt-7 flex flex-col gap-3">
                                {STAT_DEFS.map((def) => (
                                    <StatMedallion
                                        key={def.key}
                                        icon={def.icon}
                                        label={def.label}
                                        value={
                                            stats
                                                ? numberFormatter.format(
                                                      stats[def.key],
                                                  )
                                                : "—"
                                        }
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="mt-10 lg:mt-0">
                            <div className="lg:sticky lg:top-6">
                                <SupportCard
                                    email={CONTACT.email}
                                    delai={CONTACT.delai}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <SectionSeparator />
                <section
                    id="reseaux"
                    data-section="reseaux"
                    className="scroll-mt-24"
                >
                    <BlockHeading
                        icon={LuSend}
                        eyebrow="Au grand jour"
                        title="Suivre la veillée"
                    />
                    <p className="text-muted-foreground mt-4 max-w-[60ch] font-quote text-base italic">
                        Retrouvez-nous ailleurs — annonces, coups de cœur et
                        coulisses de la bibliothèque.
                    </p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {SOCIAL_LINKS.map((s) => (
                            <SocialMedallion key={s.label} {...s} />
                        ))}
                    </div>
                </section>

                <SectionSeparator />
                <section id="faq" data-section="faq" className="scroll-mt-24">
                    <BlockHeading
                        icon={LuCircleHelp}
                        eyebrow="Questions fréquentes"
                        title="On vous éclaire"
                    />
                    <div className="mt-6">
                        <ContactFaq />
                    </div>
                </section>

                <SectionSeparator />
                <section id="liens" data-section="liens" className="scroll-mt-24">
                    <UsefulLinks />
                    <SignatureFooter />
                </section>
            </div>

            <BackToTop visible={showTop} />
        </>
    );
}
