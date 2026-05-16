import { Hero }              from "@/components/public/Hero";
import { Ideology }          from "@/components/public/Ideology";
import { OfferingsTriptych } from "@/components/public/OfferingsTriptych";
import { BookingCta }        from "@/components/public/BookingCta";
import { KittyTeaser }       from "@/components/public/KittyTeaser";
import { ContactForm }       from "@/components/public/ContactForm";

export const metadata = {
  title: "Ubasti — Cat Cafe & Lounge | Chennai",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ideology />
      <OfferingsTriptych />
      <BookingCta />
      <KittyTeaser />
      <ContactForm />
    </>
  );
}
