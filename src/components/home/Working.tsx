import React from 'react'
import TextSplit from '../ui/SplitText'

const Working = () => {
    return (
        <div className='flex flex-col items-center text-[#1a1a1a] justify-center w-full min-h-screen '
            style={{
                padding: "clamp(1rem, 7vw, 200rem) 0"
            }}
        >
            <div className="flex flex-col w-[75%]"
                style={{
                    gap: "clamp(1rem, 5vw, 200rem)"
                }}
            >
                <div className="flex w-full flex-col "
                    style={{
                        gap: "clamp(1rem, 1vw, 200rem)"
                    }}
                >


                    <div className=" text-center leading-[0.8] uppercase tracking-tighter harmo"
                        style={{
                            fontSize: "clamp(4rem, 12vw, 200rem)"
                        }}
                    >
                        <TextSplit delay={0.3}>Ready{"."}</TextSplit>
                        <TextSplit delay={0.6}>To Start{"."}</TextSplit>
                        <TextSplit delay={0.9}>The Journey{"."}</TextSplit>
 
                    </div>

                </div>


            </div>

        </div>
    )
}

export default Working 
