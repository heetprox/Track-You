import React from 'react'
import ClientShuffleWrapper from '../ClientShuffleWrapper'

const Top = () => {
  return (
    <main className="flex min-h-[100vh] w-full overflow-hidden flex-col items-center justify-between text-black"
    style={{
      fontSize: "clamp(1.5rem, 4vw, 200rem)"
    }}
    >
      <div className="flex flex-col serif items-center justify-center suse">
      Precision AI Search for legal teams.
      </div>
    
    </main>
  )
}

export default Top