"use client"
import Link from 'next/link'
import React, { useState } from 'react'

const SimpleButton = ({ title, href }: { title: string, href: string }) => {
    const [isHovered, setIsHovered] = useState(false)
    
    return (
        <Link href={href} className="flex border border-black bg-black text-white rounded-full cursor-pointer items-center space gap-2" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
            style={{
                padding: "clamp(0.25rem, 0.5vw, 100rem) clamp(1rem, 1vw, 100rem)",
            }}
        
        >
            <div style={{
                fontSize: "clamp(0.8rem, 1vw, 200rem)"
            }}>
                {title}
            </div>
            <div className={`w-2.5 h-2.5 bg-white rounded-full ${isHovered ? "scale-150" : "scale-100"} transition-all duration-300 ease-in-out`}>

            </div>
        </Link>
    )
}

export default SimpleButton
