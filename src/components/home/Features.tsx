import React from 'react'
import SvgGoldFilter from '../ui/SvgGoldFilter'
import Tool from '../ui/Tool'

const Features = () => {
  return (
    <div className='flex flex-col items-center bg-[#1a1a1a] justify-center w-full min-h-screen '
      style={{
        padding: "clamp(1rem, 7vw, 200rem) 0"
      }}
    >
      <div className="flex flex-col w-[55%]"
        style={{
          gap: "clamp(1rem, 5vw, 200rem)"
        }}
      >
        <div className="flex w-full flex-col "
          style={{
            gap: "clamp(1rem, 1vw, 200rem)"
          }}
        >


          <div className="text-white tracking-tight harmo"
            style={{
              lineHeight: "1",
              fontSize: "clamp(4rem, 4.5vw, 200rem)"
            }}
          >Sync with GitHub & X{"."}
            <br />
            Both ways{"."}</div>
          <div className="flex sus leading-normal text-white"
            style={{
              fontSize: "clamp(1rem, 1vw, 200rem)"
            }}
          >

            Manage your tasks efficiently with Huly's bidirectional GitHub synchronization. <br />Use Huly as an advanced front-end for GitHub Issues and GitHub Projects.

          </div>
        </div>

        <div className="flex aspect-video w-full">







        </div>

        <div className="flex">
            <Tool image="/icons/fire.png" title="Fire" description="Fire is a tool that can be used to create a fire." />

        </div>
      </div>

    </div>
  )
}

export default Features
