import { Navbar } from "@/components/navbar";
import { BotIcon, Key, PenSquare } from "lucide-react";

export function HomePage() {
  return (
    <div className="flex flex-col justify-center items-center gap-6 w-full h-full">
      <Navbar />
      <section className="flex flex-col justify-center items-center gap-6">
        <h1 className="bg-clip-text text-transparent font-bold text-7xl bg-gradient-to-r from-[#5350F6] to-[#E662FE] mt-20 text-center">
          AI Study Tool
        </h1>
        <p className="text-5xl text-center max-w-7xl leading-relaxed">
          An AI-powered tool that has a ton of features that helps you while you
          study
        </p>
        <p className="text-2xl font-semibold text-[#FF3BFF]">
          Have a "friend" by your side while you study
        </p>
      </section>
      <section className="flex flex-col justify-center items-center gap-6 mb-20">
        <h2 className="bg-clip-text text-transparent font-bold text-5xl bg-gradient-to-r from-[#5350F6] to-[#E662FE] mt-20 text-center pb-2">
          Hack your study
        </h2>
        <h3 className="text-3xl text-center max-w-7xl">
          revolutionize your study process with AI integration
        </h3>
      </section>
      <section className="flex flex-row justify-evenly w-5/6 items-center gap-6 mb-16 max-md:flex-col max-md:items-center">
        <div className="max-w-xl flex flex-col gap-2">
          <h4 className="text-4xl font-semibold">
            Unleash AI Power in Education
          </h4>
          <p className="text-lg leading-relaxed">
            Step into the future of learning with our groundbreaking AI-powered
            homework assistant. Transform the way students approach their
            homework with an intuitive, interactive platform that blends
            cutting-edge technology with engaging educational experiences.
          </p>
        </div>
        <aside className="flex flex-col max-w-3xl p-4 gap-4">
          <div className="flex flex-row justify-center items-center gap-2">
            <h5 className="text-4xl font-semibold">Key Features</h5>
            <Key size={38} />
          </div>
          <section className="flex flex-row gap-2 bg-muted p-4 rounded-lg">
            <PenSquare size={36} className="w-14 h-14 stroke-primary" />
            <aside>
              <h5 className="text-lg font-semibold">AI-Enhanced Whiteboard</h5>
              <p>
                Dynamic digital whiteboard where students can write, draw, and
                visualize their homework problems.
              </p>
            </aside>
          </section>
          <section className="flex flex-row gap-2 bg-muted p-4 rounded-lg">
            <BotIcon size={36} className="w-14 h-14 stroke-primary" />
            <aside>
              <h5 className="text-lg font-semibold">
                Smart AI Assistance: Visual, Verbal, and Easy to Use
              </h5>
              <p>
                Instant whiteboard interpretation, voice-activated answers, and
                easy-to-use interface in one powerful tool!
              </p>
            </aside>
          </section>
        </aside>
      </section>
    </div>
  );
}
