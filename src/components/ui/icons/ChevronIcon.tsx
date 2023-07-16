import React from 'react'

const ChevronIcon = ({ styles = '' }) => {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={styles}
    >
      <g id='SVGRepo_bgCarrier' stroke-width='0'></g>
      <g
        id='SVGRepo_tracerCarrier'
        stroke-linecap='round'
        stroke-linejoin='round'
      ></g>
      <g id='SVGRepo_iconCarrier'>
        {' '}
        <rect width='24' height='24' fill='white'></rect>{' '}
        <path
          d='M14.5 17L9.5 12L14.5 7'
          stroke='#000000'
          stroke-linecap='round'
          stroke-linejoin='round'
        ></path>{' '}
      </g>
    </svg>
  )
}

export default ChevronIcon
