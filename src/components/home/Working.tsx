"use client"
import React, { useRef, useState, useEffect } from 'react'
import TextSplit from '../ui/SplitText'

const Working = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry?.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Stop observing once visible
                }
            },
            { threshold: 0.2 } // Trigger when 20% of the element is visible
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div 
            ref={sectionRef}
            className='flex flex-col items-center text-[#1a1a1a] justify-center w-full min-h-screen '
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
                        {isVisible && (
                            <>
                                <TextSplit delay={0.1}>Ready{"."}</TextSplit>
                                <TextSplit delay={0.3}>To Start{"."}</TextSplit>
                                <TextSplit delay={0.5}>The Journey{"."}</TextSplit>
                            </>
                        )}
                    </div>

                </div>


            </div>

        </div>
    )
}

export default Working 
