import { Navbar } from "@/components/navbar";

export function HomePage() {
  return (
    <div className="flex flex-col gap-6 min-h-screen min-w-full">
      <Navbar />
      <div className="w-full bg-inherit bg-no-repeat bg-cover justify-center items-center flex flex-row max-sm:flex-col gap-10 flex-wrap">
        <div className="max-w-3xl flex flex-col justify-center items-start gap-3 p-10">
          <h1 className="text-4xl font-bold">
            Lorem ipsum dolor sit, amet consectetur adipisicing.
            <span className="text-primary"> Lorem, ipsum dolor.</span>
          </h1>
          <h2 className="text-2xl text-foreground opacity-70">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tenetur
            minima at perspiciatis nostrum non, rerum doloribus ea consectetur
            quos ex fuga nisi deleniti voluptatum eius sapiente obcaecati hic.
            Repellat, quibusdam.
          </h2>
        </div>
        <aside>
          <img className="max-w-2xl" src="hero.png" alt="Hero Image" />
        </aside>
      </div>
    </div>
  );
}
