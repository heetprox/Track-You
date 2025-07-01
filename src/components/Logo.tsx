import Image from 'next/image'
import React from 'react'

const Logo = () => {
  return (
    <div className='sus text-sm flex items-center gap-1 text-white'>
        <Image src="/logo/logo.svg" alt="logo" width={100} height={100} className='w-6 h-6' />
      TrackYou
    </div>
  )
}

export default Logo
