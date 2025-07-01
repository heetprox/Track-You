"use client"
import Link from 'next/link'
import React, { useState } from 'react'

const SimpleButton = ({ title, href }: { title: string, href: string }) => {
    const [isHovered, setIsHovered] = useState(false)
    
    return (
        <Link href={href} className="flex  bg-white text-black hover:text-white duration-500  rounded-md overflow-hidden cursor-pointer items-center space gap-2 px-2 py-1 relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
            style={{
               
            }}
        
        >
            <div
            className={`sus text-sm flex z-10 transition-all duration-500 
                
                `}
            style={{
                // fontSize: "clamp(0.8rem, 1vw, 200rem)"
            }}>
                {title}
            </div>
            <div className={`w-2 h-2 absolute right-0 -top-5  bg-[#9478FC] hite rounded-full ${isHovered ? "scale-[30]" : "scale-100 -z-40"} transition-all duration-700 ease-in-out`}>

            </div>
        </Link>
    )
}

export default SimpleButton
