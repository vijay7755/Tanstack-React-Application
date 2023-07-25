import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

async function fetchPosts(page) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${page}`
  );
  return response.json();
}

export function Posts() {
  // const [isLoading, setisLoading] = useState(true);
  // const [data, setData]  =useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient()

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1
      queryClient.prefetchQuery({
        queryKey: ["posts", nextPage],
        queryFn: () => fetchPosts(nextPage)
      })
    }
  }, [currentPage, queryClient])


  // This is how we paginate API call traditionaly
  // useEffect(() => {
  //   setisLoading(true)
  //   fetchPosts(currentPage).then(res => {
  //     setData(res)
  //     setisLoading(false)
  //   })

  // }, [currentPage])

  // replace with useQuery
  const { data, error, isLoading, isFetching, isError, isSuccess } = useQuery({
    queryKey: ['posts', currentPage],
    queryFn: () => fetchPosts(currentPage),
    staleTime: 1000,
    cacheTime: `5 * 60 * 1000`,
    keepPreviousData: true
  });

  // isFetching is true when ongoing asunchronous call and its not yet resolved
  // isLoading is true when there is no cache data plus isFteching
  console.log(`isFetching: ${isFetching}, isLoading: ${isLoading}`)
  console.log("isError: ", isError)
  console.log("isSuccess: ", isSuccess)
  console.log("error: ", error)
  console.log("data: ", data)

  if (isLoading) return <div><h1>Loading...</h1></div>

  if (isError) return <div><h1>An unexpected error occurred</h1></div>

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button onClick={() => {
          if (currentPage > 1) setCurrentPage(prev => prev - 1)
        }}>
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button onClick={() => {
          if (maxPostPage >= currentPage)setCurrentPage(prev => prev + 1)
        }}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
