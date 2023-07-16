import Link from 'next/link'
import React from 'react'
import { LogoIcon } from '@/components/ui/icons/index'
import { buttonVariants } from './Button'

const Navbar = () => {
  return (
    <div className='fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-amber-300 z-[10] py-2'>
      <div className='container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
        <Link href='/' className='flex  items-center gap-2'>
          <LogoIcon />
          <p className='hidden text-zinc-700 text-sm font-medium md:block'>
            Hivetalk
          </p>
        </Link>
        {/* Searchbar */}
        <Link href='sign-in' className={buttonVariants()}>
          Sign In
        </Link>
      </div>
    </div>
  )
}

export default Navbar
