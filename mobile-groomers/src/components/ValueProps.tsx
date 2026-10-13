const PROPS = [
  {
    icon: "🚐",
    title: "Zero Commute, Zero Stress",
    body: "The groomer comes to your driveway. No carrier, no car rides, no waiting room full of barking dogs.",
  },
  {
    icon: "🧑‍⚕️",
    title: "One-on-One Attention",
    body: "Your dog is the only pet in the van. That means faster grooms, closer supervision, and less anxiety.",
  },
  {
    icon: "🚫",
    title: "No Cages, Ever",
    body: "Mobile vans skip the cage-drying and holding kennels used in most salons — better for nervous or senior dogs.",
  },
  {
    icon: "⏱️",
    title: "In and Out in Under 2 Hours",
    body: "Most mobile grooms finish in 60–90 minutes start to finish, versus a half-day drop-off at a traditional salon.",
  },
];

export default function ValueProps() {
  return (
    <section className="container-page py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl sm:text-4xl">Why Mobile Grooming Beats the Salon</h2>
        <p className="mt-3 text-ink-soft">
          Van-based grooming is built around your dog&apos;s comfort — not a shop&apos;s schedule.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PROPS.map((p) => (
          <div key={p.title} className="card card-hover p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-soft text-2xl">
              {p.icon}
            </div>
            <h3 className="mt-4 text-lg">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
