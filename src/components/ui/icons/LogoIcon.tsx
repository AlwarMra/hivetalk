import React from 'react'

const LogoIcon = ({ size = '30' }) => {
  return (
    <svg
      width={`${size}px`}
      height={`${size}px`}
      viewBox='0 0 36 36'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      aria-hidden='true'
      role='img'
      preserveAspectRatio='xMidYMid meet'
    >
      <path
        fill='#F4900C'
        d='M31 22c-3 11-5.019 14-13 14c-8 0-10-3-13-14C2.965 14.54 7 8 18 8s15.034 6.54 13 14z'
      ></path>
      <path
        fill='#BE1931'
        d='M29 11c2 4-3 8-11 8S5 15 7 11c1.482-2.964 4.373-6 11-6s9.519 3.036 11 6z'
      ></path>
      <ellipse fill='#FFAC33' cx='18' cy='11' rx='12' ry='6'></ellipse>
      <path
        fill='#FFE8B6'
        d='M27 10c1 1 2 2 2 3s-1 3-2 2c0 0 2.948 1.154 2 4c-1 3-4 2-4 0s-1.553-3.342-2-2c-1 3-3 3-4 2s-1-2-1-2s-3 0-2-2s0-2 0-2s0-1 1-1s7-1 8-2s2 0 2 0z'
      ></path>
      <path
        fill='#662113'
        d='M28 9.278C28 11.886 23.523 14 18 14S8 11.886 8 9.278C8 6.67 12.477 5 18 5s10 1.67 10 4.278z'
      ></path>
      <path
        fill='#F4900C'
        d='M18 14c4.548 0 8.379-1.435 9.593-3.396A37.263 37.263 0 0 0 27 10s-2-2-3-1s-6 1-7 1s-2 1-2 1s1.587 2.011 1.397 2.934c.523.04 1.056.066 1.603.066z'
      ></path>
      <path
        fill='#FFCC4D'
        d='M26 8.5c0 1.933-3.582 3.5-8 3.5s-8-1.567-8-3.5S13.582 3 18 3s8 3.567 8 5.5z'
      ></path>
      <ellipse fill='#F4900C' cx='18' cy='2.5' rx='2' ry='1.5'></ellipse>
      <path
        fill='#FFCC4D'
        d='M5.685 24.41c.725 2.457 1.425 4.435 2.204 6.013C11 33 16 33 18 33s7 0 10.106-2.576c.78-1.576 1.483-3.556 2.208-6.014C27.609 25.973 23.112 27 18 27s-9.61-1.027-12.315-2.59z'
      ></path>
    </svg>
  )
}

export default LogoIcon
