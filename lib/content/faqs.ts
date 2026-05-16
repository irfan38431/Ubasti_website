interface FaqItem { q: string; a: string; }

export const FAQ_BY_PAGE: Record<string, FaqItem[]> = {
  home: [
    { q: "Where is Ubasti Cat Cafe?", a: "We're located in Chennai, Tamil Nadu. DM us on Instagram for the exact address and directions." },
    { q: "Do I need to book in advance?", a: "Walk-ins are welcome when space is available, but booking in advance is recommended, especially on weekends." },
    { q: "How long is a session?", a: "Sessions are 60 minutes long. Extensions are available subject to availability." },
    { q: "Is there an entry fee?", a: "Yes — there's a per-person session fee. Check our Instagram for current pricing." },
    { q: "Are children allowed?", a: "Children aged 6 and above are welcome. Children under 7 must be accompanied by an adult chaperone." },
  ],
  kitties: [
    { q: "Can I adopt a cat I met at the cafe?", a: "Absolutely — that's exactly how adoption is meant to work here. Spend time with the cats, and if there's a spark, start the process via the Adoption page." },
    { q: "Are all cats available for adoption?", a: "Most resident cats are available, but some may be on hold or already in an adoption process. Check the Adoption page for current availability." },
    { q: "Do the cats get along with each other?", a: "Yes — our resident cats are socialised and live together comfortably. Some are bonded pairs who prefer to be adopted together." },
    { q: "What vaccinations do the cats have?", a: "All cats are vaccinated, dewormed, and spay/neutered before adoption. Medical records are provided on adoption day." },
  ],
  events: [
    { q: "How do I register for an event?", a: "Click the 'Register' button on any event listing. Some events are free, others have a participation fee." },
    { q: "Can I attend events as a walk-in?", a: "Some events allow walk-ins, but most have limited spots and require registration. Check each event's listing." },
    { q: "Do I need to pay a session fee on top of the event fee?", a: "For dedicated event sessions, the event fee covers your time. For events during open hours, the standard session fee applies." },
    { q: "Can I bring children to events?", a: "Child-friendliness varies by event. The event listing will indicate if children are welcome and any age restrictions." },
  ],
  'private-parties': [
    { q: "Is a deposit required?", a: "Yes — 30% advance to confirm the booking. Refundable up to 7 days before the event." },
    { q: "Can we bring a DJ or live music?", a: "We're a calm space — amplified music isn't permitted. We're happy to run a custom Spotify playlist for you." },
    { q: "Is alcohol allowed?", a: "Outside alcohol is not permitted. We can arrange a mocktail or soft drinks menu on request." },
    { q: "Can we extend beyond 70 minutes?", a: "Yes — for an additional fee and subject to availability. Mention this in your inquiry." },
    { q: "Do the cats participate in the party?", a: "Always — that's the whole point! But cats choose their own social schedule. We can't guarantee every cat will be front and centre." },
  ],
  grooming: [
    { q: "Do you groom all cat/dog breeds?", a: "We groom most breeds. Please mention your pet's breed and temperament when booking so we can prepare accordingly." },
    { q: "How long does a grooming session take?", a: "Cat sessions are typically 45-60 minutes. Dog sessions may take 60-90 minutes depending on coat type." },
    { q: "Should I bring anything?", a: "Just your pet! We provide all shampoos and equipment. If your pet has allergies, mention them when booking." },
    { q: "Is it safe for anxious pets?", a: "We work gently and patiently. For very anxious pets, a short meet-and-greet visit first can help." },
  ],
  boarding: [
    { q: "How do I book boarding?", a: "Contact us via the form or Instagram at least 3 days in advance. We'll confirm availability and guide you through drop-off." },
    { q: "Are vaccinations required?", a: "Yes — your cat must be up-to-date on core vaccinations (FVRCP). Please bring vaccination records on drop-off day." },
    { q: "Can I visit my cat during boarding?", a: "Yes, during lounge hours. We also send daily photo updates via WhatsApp." },
    { q: "What if my cat doesn't get along with others?", a: "The enclosure option is ideal for cats that prefer their own space. We always do a temperament check before lounge placement." },
  ],
  adoption: [
    { q: "Is there an adoption fee?", a: "Yes — the adoption fee covers vaccinations, microchipping, and spay/neuter costs already completed. The exact fee depends on the cat." },
    { q: "Do you adopt outside Chennai?", a: "Currently we adopt locally within Chennai and nearby areas so we can conduct a home visit." },
    { q: "Can I adopt more than one cat?", a: "Absolutely — bonded pairs especially benefit from going together, and we encourage it!" },
    { q: "What if it's not working out?", a: "Please contact us. We never want a cat to be in a bad situation — we'll help re-home them if needed." },
    { q: "Do the cats get along with dogs?", a: "It varies by cat. Some of our cats are dog-friendly. Ask us during your visit and we'll give you an honest answer." },
  ],
  shop: [
    { q: "When does the shop open?", a: "We're still working on it! Follow @ubasticatcafe on Instagram to be the first to know when we launch." },
    { q: "What kinds of products will you sell?", a: "Cat-inspired merchandise — totes, mugs, prints, stickers, and more. All with the Ubasti palette and brand." },
    { q: "Will you ship nationally?", a: "Yes — nationwide shipping is planned for launch. International shipping will follow." },
  ],
};
