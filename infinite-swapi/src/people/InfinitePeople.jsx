import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroller";
import { Person } from "./Person";

const initialUrl = "https://swapi.dev/api/people/";

const fetchUrl = async ({ pageParam = initialUrl }) => {
  const response = await fetch(`${pageParam}`);
  return response.json();
};

export function InfinitePeople() {
  // TODO: get data for InfiniteScroll via React Query

  const { data, fetchNextPage, hasNextPage, isLoading, isFetching, isError, error } = useInfiniteQuery({
    queryKey: ["sw-people"],
    queryFn: fetchUrl,
    getNextPageParam: (lastPage, pages) => lastPage?.next || undefined
  })

  console.log("Star wars people: ", data)
  console.log("isLoading: ", isLoading)
  console.log("isFetching: ", isFetching)

  if(isLoading) return <h5 className="loading">Loading...</h5>
  if(isError) return <h5 className="loading">{`oops Error! ${error.toString()}`}</h5>

  return (
    <>
      {isFetching && <h5 className="loading">Fetching...</h5>}
        <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
          {data.pages.map(pageData => {
            return pageData.results.map(person => {
              return <Person 
                      key={person.name}
                      name={person.name} 
                      hairColor={person.hair_color} 
                      eyeColor={person.eye_color} 
                      />
            })
          })}
        </InfiniteScroll>
    </>
  )
}
