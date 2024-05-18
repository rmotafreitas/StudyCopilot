import { Navbar } from "@/components/navbar";

export function HomePage() {
  return (
    <div className="flex flex-col gap-6 min-h-screen min-w-full">
      <Navbar />
      <div className="w-full bg-inherit bg-no-repeat bg-cover justify-center items-center flex flex-row max-sm:flex-col gap-10 flex-wrap">
        <div className="max-w-3xl flex flex-col justify-center items-start gap-3 p-10">
          <h1 className="text-4xl font-bold">
            Your personal study AI by your side
            <span className="text-primary">
              <br />
              24/7
            </span>
          </h1>
          <h2 className="text-2xl text-foreground opacity-70">
            Let's get started!
          </h2>
        </div>
        <aside>
          <img className="max-w-2xl" src="hero.png" alt="Hero Image" />
        </aside>
      </div>
    </div>
  );
}
