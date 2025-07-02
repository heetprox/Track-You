import React from 'react'
import Image from 'next/image'
import TextSplit from '../ui/SplitText'

const Top = () => {
  return (
    <main className="flex min-h-[100vh] h-screen w-full overflow-hidden flex-col items-center justify-center text-black relative"
      style={{
        fontSize: "clamp(4rem, 16vw, 200rem)"
      }}
    >
      <div className="absolute z-10 bottom-0 left-1/2 transform -translate-x-1/2">
        <Image
          src="/robo/robo.svg"
          alt="Robot"
          width={100}
          height={100}
          className="object-contain hidden md:block w-[40vw]"
        />

      </div>
      <div className="sus uppercase relative z-0">
        <TextSplit delay={0.3}>
          TrackYou
        </TextSplit>
      </div>


      <div className="flex flex-col absolute w-[10vw] h-fit bottom-3 right-3">
        <div className="flex sus  underline underline-offset-2 capitalize text-black/80 pb-1"
          style={{
            fontSize: "clamp(0.75rem, 0.75vw, 200rem)"
          }}
        >winner of week #1</div>

        <div className="flex  bg-black rounded-md gap-2"
          style={{
            padding: "clamp(0.25rem, 0.30vw, 200rem)"
          }}
        >
          <Image src="/example.webp" alt="Robot" width={400} height={600} className="object-contain hidden md:block w-10 rounded-md" />
          <div className="flex flex-col sus text-white items-start justify-center"
            style={{
              fontSize: "clamp(0.5rem, 0.75vw, 200rem)"
            }}
          >
            <div className="">Soumodeep</div>
            <div className="">34h 10m</div>
          </div>
        </div>
      </div>


    </main>
  )
}

export default Top