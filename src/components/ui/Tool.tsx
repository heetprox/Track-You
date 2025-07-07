import React from 'react'
import SvgGoldFilter from './SvgGoldFilter'

const Tool = ({image, title, description}: {image: string, title: string, description: string}) => {
  return (
    <div className='flex flex-col  sus items-left '>
      <SvgGoldFilter image={image} width={100} height={100} className={""} />
      <h2
      
      style={{
        fontSize: "clamp(1rem, 2vw, 200rem)"
      }}
      className=' text-white'>{title}</h2>
      <p className='text-sm text-white/50'>{description}</p>
    </div>
  )
}

export default Tool
