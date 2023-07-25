'use client'
import { Honeycomb, Prisma } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from './ui/Command'
import { CommandItem } from 'cmdk'
import { usePathname, useRouter } from 'next/navigation'
import debounce from 'lodash.debounce'
import HoneycombIcon from './ui/icons/HoneycombIcon'
import { useOnClickOutside } from '@/hooks/use-on-click-outside'

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
  const [input, setInput] = useState<string>('')
  const router = useRouter()
  const pathname = usePathname()
  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      if (!input) return []
      const { data } = await axios.get(`/api/search?q=${input}`)
      return data as (Honeycomb & { _count: Prisma.HoneycombCountOutputType })[]
    },
    queryKey: ['search-query'],
    enabled: false,
  })

  const request = debounce(() => {
    refetch()
  }, 300)

  const debounceRequest = useCallback(() => {
    request()
  }, [request])

  const commandRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(commandRef, () => {
    setInput('')
  })

  useEffect(() => {
    setInput('')
  }, [pathname])

  return (
    <Command
      ref={commandRef}
      className='relative rounded-lg border max-w-lg z-50 overflow-visible'
    >
      <CommandInput
        value={input}
        onValueChange={text => {
          setInput(text)
          debounceRequest()
        }}
        className='outline-none border-none focus:border-none focus:outline-none ring-0'
        placeholder='Search Honeycombs...'
      />

      {input.length > 0 ? (
        <CommandList className='absolute bg-white top-full inset-x-0 shadow rounded-b-md'>
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading='Honeycombs'>
              {queryResults?.map(honeycomb => (
                <CommandItem
                  key={honeycomb.id}
                  value={honeycomb.name}
                  onSelect={e => {
                    router.push(`/r/${e}`)
                    router.refresh()
                  }}
                >
                  <HoneycombIcon size='22' />
                  <a href={`/r/${honeycomb.name}`}>/r/${honeycomb.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      ) : null}
    </Command>
  )
}

export default SearchBar
