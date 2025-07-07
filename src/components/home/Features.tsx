import React from 'react'
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
          <div className="flex sus leading-normal text-white/80"
            style={{
              fontSize: "clamp(1rem, 1vw, 200rem)"
            }}
          >

            Manage your tasks efficiently with Huly's bidirectional GitHub synchronization. <br />Use Huly as an advanced front-end for GitHub Issues and GitHub Projects.

          </div>
        </div>

        <div className="flex aspect-video w-full bg-white/5">







        </div>

        <div className="grid grid-cols-3 gap-8">
            <Tool image="/icons/fireew.png" title="Coding" description="Build and maintain coding streaks similar to GitHub's contribution graph." title2=' Streaks' />
            <Tool image="/icons/progress.svg" title="in Detail " description="Get insights into your coding patterns, most productive hours, and language proficiency." title2='Analytics' />
            <Tool image="/icons/time.png" title="Time" description="Automatically track your coding time across different projects and languages." title2='Tracking' />

            <Tool image="/icons/code.png" title="Language " description="Support for over 50 programming languages and frameworks." title2='Support' />
            <Tool image="/icons/trophy.png" title="Weekly" description="Compete with friends on daily, weekly, and monthly leaderboards." title2='Leaderboards' />
            <Tool image="/icons/daily.svg" title="Daily" description="Track your daily activity and set goals to improve consistently." title2='Progress  ' />

        </div>
      </div>

    </div>
  )
}

export default Features
