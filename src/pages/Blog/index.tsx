import { useCallback, useEffect, useState } from 'react'
import { Post } from './components/Post'
import { Profile } from './components/Profile'
import { SearchInput } from './components/SearchInput'
import { PostListContainer } from './styles'
import { api } from '../../lib/axios'
import { Spin } from '../../components/Spin'

const username = import.meta.env.VITE_GITHUB_USERNAME
const repoName = import.meta.env.VITE_GITHUB_REPONAME

export interface Ipost {
  title: string
  body: string
  created_at: string
  number: number
  html_url: string
  comments: number
  user: {
    login: string
  }
}

export function Blog() {
  const [posts, setPosts] = useState<Ipost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const getPosts = useCallback(
    async (query: string = '') => {
      try {
        setIsLoading(true)
        const response = await api.get(
          `/search/issues?q=${query}%20repo:${username}/${repoName}`,
        )

        setPosts(response.data.items)
      } finally {
        setIsLoading(false)
      }
    },
    [posts],
  )

  useEffect(() => {
    getPosts()
  }, [])

  return (
    <>
      <Profile />
      <SearchInput postsLenght={posts.length} getPosts={getPosts} />
      {isLoading ? (
        <Spin />
      ) : (
        <PostListContainer>
          {posts.map((post) => (
            <Post key={post.number} post={post} />
          ))}
        </PostListContainer>
      )}
    </>
  )
}
