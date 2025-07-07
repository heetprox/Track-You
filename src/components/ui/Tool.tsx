import React from 'react'

const Tool = ({image, title, description}: {image: string, title: string, description: string}) => {
  return (
    <div className='flex flex-col sus items-left'>
       <div
        className="svg-gold-filter"
        style={{
          WebkitMask: `url(${image}) no-repeat left / contain`,
          mask: `url(${image}) no-repeat left / contain`,
          width: "auto",
          height: "60px",
          display: 'inline-block',
          marginBottom: "12px"
        }}
        aria-label={title}
      />
      <h2
      style={{
        fontSize: "clamp(1rem, 1.75vw, 200rem)"
      }}
      className=' text-white  harmo leading-tight'>{title}</h2>
      <p className='text-md sus text-white/70'>{description}</p>
    </div>
  )
}

export default Tool
