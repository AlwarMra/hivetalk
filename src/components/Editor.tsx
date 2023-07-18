'use client'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { useForm } from 'react-hook-form'
import { PostCreationRequest, postValidator } from '@/lib/validators/post'
import { zodResolver } from '@hookform/resolvers/zod'
import type EditorJS from '@editorjs/editorjs'
import { uploadFiles } from '@/lib/uploadthing'
import { toast } from '@/hooks/use-toast'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { usePathname, useRouter } from 'next/navigation'

interface EditorProps {
  honeycombId: string
}

const Editor: FC<EditorProps> = ({ honeycombId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostCreationRequest>({
    resolver: zodResolver(postValidator),
    defaultValues: {
      honeycombId,
      title: '',
      content: null,
    },
  })
  const router = useRouter()
  const pathname = usePathname()
  const _titleRef = useRef<HTMLTextAreaElement>()
  const editorRef = useRef<EditorJS>()
  const [isMounted, setIsMounted] = useState<boolean>(false)

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default
    const Header = (await import('@editorjs/header')).default
    const Embed = (await import('@editorjs/embed')).default
    const Table = (await import('@editorjs/table')).default
    const List = (await import('@editorjs/list')).default
    const Code = (await import('@editorjs/code')).default
    const LinkTool = (await import('@editorjs/link')).default
    const InlineCode = (await import('@editorjs/inline-code')).default
    const ImageTool = (await import('@editorjs/image')).default

    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: 'editor',
        onReady() {
          editorRef.current = editor
        },
        placeholder: 'Type here to write your post...',
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: { endpoint: '/api/link' },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles([file], 'imageUploader')
                  return { success: 1, file: { url: res.fileUrl } }
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          embed: Embed,
          table: Table,
        },
      })
    }
  }, [])

  useEffect(() => {
    if (typeof window !== undefined) {
      setIsMounted(true)
    }
  }, [])
  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: 'Something went wrong',
          description: (value as { messsage: string }).messsage,
          variant: 'destructive',
        })
      }
    }
  }, [errors])
  useEffect(() => {
    const init = async () => {
      await initializeEditor()
    }
    setTimeout(() => {
      _titleRef.current?.focus()
    }, 0)

    if (isMounted) {
      init()

      return () => {
        editorRef.current?.destroy()
        editorRef.current = undefined
      }
    }
  }, [isMounted, initializeEditor])

  const { mutate: createPost } = useMutation({
    mutationFn: async ({
      title,
      content,
      honeycombId,
    }: PostCreationRequest) => {
      const payload: PostCreationRequest = {
        title,
        content,
        honeycombId,
      }
      const { data } = await axios.post('/api/honeycomb/post/create', payload)
      return data
    },
    onError: () => {
      return toast({
        title: 'Something went wrong',
        description: 'Your post was not published',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      const newPathName = pathname.split('/').slice(0, -1).join('/')
      router.push(newPathName)
      router.refresh()

      return toast({
        description: 'Your post has been published',
      })
    },
  })

  async function onSubmit(data: PostCreationRequest) {
    const blocks = await editorRef.current?.save()

    const payload: PostCreationRequest = {
      title: data.title,
      content: blocks,
      honeycombId,
    }

    createPost(payload)
  }

  if (!isMounted) {
    return null
  }

  const { ref: titleRef, ...rest } = register('title')

  return (
    <div className='w-full p-4 bg-amber-50 rounded-lg border border-amber-200'>
      <form
        id='honeycomb-post-form'
        className='w-fit'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='prose prose-stone dark:prose-invert'>
          <TextareaAutosize
            ref={e => {
              titleRef(e)
              // @ts-ignore
              _titleRef.current = e
            }}
            {...rest}
            placeholder='Title'
            className='w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none'
          />

          <div id='editor' className='m-h-[500px]' />
        </div>
      </form>
    </div>
  )
}

export default Editor
