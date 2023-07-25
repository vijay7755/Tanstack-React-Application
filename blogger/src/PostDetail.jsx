import { useMutation, useQuery } from "@tanstack/react-query";

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

// async function updatePost(postId) {
//   const response = await fetch(
//     `https://jsonplaceholder.typicode.com/postId/${postId}`,
//     { method: "PATCH", data: { title: "REACT QUERY FOREVER!!!!" } }
//   );
//   return response.json();
// }

export function PostDetail({ post }) {
  // replace with useQuery
  const {data, isLoading, isError} = useQuery({
    queryKey: ["comments", post?.id],
    queryFn: () => fetchComments(post?.id),
  })

  const {mutate, isLoading: mutateloading, isError: mutateError, isSuccess: mutateSuccess} = useMutation({
    mutationFn: (id) => deletePost(id)
  })

  if(isLoading) return <div><h3>Loading comments...</h3></div>

  if(isError) return <div><h3>An unexpected error occured</h3></div>

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={() => {
        mutate(post.id)
      }}>Delete</button> 
      {mutateError ? <div><h2 style={{color: "red"}}>Error deleting the post</h2></div> : <></> }
      {mutateloading ? <div><h2 style={{color: "yellow"}}>Deleting the post in progress</h2></div> : <></> }
      {mutateSuccess ? <div><h2 style={{color: "green"}}>{`Post (not) deleted successfully`}</h2></div> : <></> }
      <button>Update title</button>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
