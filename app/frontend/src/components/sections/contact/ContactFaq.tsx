import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/UI/Accordion";
import { FAQ } from "@/data/contact";

/** Contact page FAQ — single-open accordion (first item open by default). */
export default function ContactFaq() {
    return (
        <div className="grain border-border bg-card/55 relative overflow-hidden rounded-2xl border-2 px-5 md:px-7">
            <Accordion type="single" collapsible defaultValue="faq-0">
                {FAQ.map((item, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                        <AccordionTrigger className="aria-expanded:text-foreground py-5 text-base font-bold leading-snug md:text-lg">
                            {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="max-w-[64ch] pr-2 pb-6 font-quote text-sm leading-[1.8] md:text-base">
                            {item.a}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
