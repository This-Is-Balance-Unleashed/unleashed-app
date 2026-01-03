import Image from "next/image";
import { Button } from "./button";
import { ZigzagIcon, WIcon, TinglesIcon } from '../icons';

export function ExperienceSection() {
  const experiences = [
    {
      title: "Keynotes:",
      description:
        "Designing careers & businesses rooted in purpose, global impact and wellness",
    },
    {
      title: "Speaker Sessions:",
      description:
        "Insights from industry leaders who took a step back & built remarkable careers.",
    },
    {
      title: "Panel Sessions:",
      description:
        "Insights for financial and all-round growth for a more sustainable and impactful life.",
    },
    {
      title: "Masterclasses:",
      description:
        "Practical systems for calm yet efficient productivity rooted in wellness.",
    },
  ];

  return (
    <section className="relative bg-black py-20 overflow-hidden">
      {/* White noise texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "url(/white-noise.svg)",
          backgroundSize: "cover",
        }}
      />

      {/* Decorative swoosh top right */}
      <svg
        className="absolute top-8 right-8 w-32 h-32 text-secondary"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 80 Q50 20 90 40"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      <div className="relative z-10 container mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-melo font-semibold text-white mb-4">
            What You Will Experience
          </h2>
          {/* Orange wavy underline */}
          <ZigzagIcon className="absolute right-32/100 top-13 -rotate-1 mx-auto w-64 md:w-65 mb-6" />
          <p className="text-lg md:text-xl text-white max-w-2xl mx-auto leading-relaxed font-sans mt-8">
            Rooted in purpose, insights from industry leaders, and all round
            growth for a sustainable and impactful life
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content List */}
          <div className="space-y-8">
            {experiences.map((experience, index) => (
              <div key={index} className="flex gap-4">
                {/* Orange arrow */}
                <svg
                  className="w-12 h-12 -rotate-90 shrink-0 mt-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="36"
                  fill="none"
                  viewBox="0 0 16 36"
                >
                  <path
                    fill="#ff8e00"
                    d="M3.5 27q.5-.7 1.1-.7.9 0 .7-.8v-3.8a9 9 0 0 1 0-3.7v-.5l-.3-2q0-1-.3-2-.4-1.5-.3-3.1.2-.8-.3-1.4v-.2c0-1.2-.5-2.3-.4-3.5l-.1-2.1-1.3-.8q0-.8.6-1L6.3.7 7.7.3q1-.3 2-.2.8.2 1.5-.1.6.9.5 2-.2 2.6.1 5.3l.1 4.2v9.7l-.1 1.8q0 .6.6.7l2.6-.4q1.2 1.1 1 2.7l-.3.9-1.3 2a29 29 0 0 0-2.9 4q-.4 1-1.4 1.7-.3.2-.4.5l-.8.7q-.6.4-1.2 0a8 8 0 0 1-1.7-2 5 5 0 0 0-1.6-1.9l-.5-.5L3 30q-.7-1-1.5-1.7C1 27.8 1 26.8.1 26.4l-.1-.2v-.4h.4q.3.1.5.4l1.2.6zm4.8 7.8q1.1-1 1.8-2 .6-.7.7-1.5a6 6 0 0 1 1-2.2l1.7-2.4a1 1 0 0 0 .2-1h-2.2q-1 0-1-1.1V23q.2-2 0-4l-.1-.7c.1-2.3-.3-4.6 0-6.8L10.1 8q-.2-2.4 0-4.9 0-.6-.3-1.2c-1.5-.3-2.9.2-4.4.5q-.5 0-.9.5l.2 2.3q.7 4 1 8.1.5 3 .4 6v1.2l.3 3.6q0 1.4.6 2.5l.3.5q.3 1-.5 1.1l-1.2.1q-1 0-2 .6C5 31.1 7 32.5 8.2 34.7"
                  />
                </svg>

                <div className="text-white">
                  <p className="text-base md:text-lg leading-relaxed font-sans max-w-[45ch]">
                    <span className="font-bold">{experience.title}</span>{" "}
                    {experience.description}
                  </p>
                </div>
              </div>
            ))}

            {/* CTA Button */}
            <div className="pt-8">
              <Button variant="primary" size="lg" href="/tickets">
                Get Your Ticket
              </Button>
            </div>
          </div>

          {/* Right Column - Event Photo */}
          <div className="relative">
            {/* Decorative w.svg at top */}
            <WIcon className="z-10 absolute -top-4 -left-6 w-16 h-16 md:w-20 md:h-20" />

            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/experience.svg"
                alt="Event attendees listening to speakers"
                width={800}
                height={600}
                className="w-full h-auto"
              />
            </div>

            {/* Bottom decorative tingles.svg */}
            <TinglesIcon className="absolute -bottom-8 -right-8 w-20 h-20 md:w-24 md:h-24" />
          </div>
        </div>
      </div>

      {/* Green wave decoration at section bottom */}
      
    </section>
  );
}
