import React from 'react'
import logoTolo from "../assets/logoTolo.png"

export default function HeaderNav() {
  return (
    <header className='bg-black h-20 sm:h-12 md:h-20 lg:h-32 flex items-center'>
      <img src={logoTolo} alt="Logo Tolo" className='w-10 h-10 sm:w-12 sm:h-12 md:w-32 md:h-32 lg:w-40 lg:h-40' />
    </header>
  )
}
