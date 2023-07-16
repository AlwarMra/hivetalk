import Link from 'next/link'
import UserAuthForm from '@/components/UserAuthForm'
import LogoIcon from './ui/icons/LogoIcon'

const SignUp = () => {
  return (
    <div className='container w-full mx-auto flex flex-col justify-center space-y-6 sm:w-[400px]'>
      <div className='flex flex-col space-y-2 text-center'>
        <p className='text-center'>
          <LogoIcon />
        </p>
        <h1 className='text-2xl font-semibold tracking-tight'>Sign up</h1>
        <p className='text-sm max-w-xs mx-auto'>
          By continuing you are setting up a Honeytalk account and agree to our
          User Agreement and Privacy Policy
        </p>
        <UserAuthForm />
        <p className='px-8 text-center text-sm text-zinc-700'>
          Already a bee?{' '}
          <Link
            href='/sign-in'
            className='hover:text-zinc-800 text-sm underline underline-offset-4'
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
