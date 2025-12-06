import Parallax from "@/app/components/Parallax"
import Scene from "@/app/components/Scene";

export default function Home() {
  // const layers = [
  //   { src: "/bg1/1.png", scale: 1.1 },
  //   { src: "/bg1/2.png", scale: 1.2, mb: 10 },
  //   { src: "/bg1/3.png", scale: 1.3, mb: 40 },
  //   { src: "/bg1/4.png", scale: 1.35, mb: 60 },
  //   { src: "/bg1/5.png", scale: 1.4, mb: 100 },
  // ];

    const layers = [
    { src: "/bg2/1.png", scale: 1 },
    { src: "/bg2/2.png", scale: 1 },
    { src: "/bg2/3.png", scale: 1},
    { src: "/bg2/4.png", scale: 1 },
    { src: "/bg2/5.png", scale: 1 },
    // { src: "/bg2/6.png", scale: 1.35 },
  ];

  return (
    <main className="relative w-full h-[100dvh] bg-black overflow-hidden">
      <Parallax layers={layers} />
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <Scene />
      </div>

      <div className="relative z-10 flex items-center justify-center h-full">
        <h1 className="text-white text-4xl font-bold">
          My Parallax Test
        </h1>
      </div>
    </main>
  );
}