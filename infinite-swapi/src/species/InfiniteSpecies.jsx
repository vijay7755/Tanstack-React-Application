import { useInfiniteQuery } from "@tanstack/react-query"
import InfiniteScroll from "react-infinite-scroller"
import { Species } from "./Species"

const initialUrl = "https://swapi.dev/api/species/"

const fetchUrl = async ({ pageParam = initialUrl }) => {
  const response = await fetch(pageParam)
  return response.json()
};

export function InfiniteSpecies() {
  // TODO: get data for InfiniteScroll via React Query

  const { data, fetchNextPage, hasNextPage, isLoading, isFetching, isError, error } = useInfiniteQuery({
    queryKey: ["species"],
    queryFn: fetchUrl,
    getNextPageParam: (lastPage, pages) => lastPage.next || undefined
  })

  if (isLoading) return <h5 className="loading">Loading...</h5>
  if (isError) return <h5 className="loading">{`oops Error! ${error.toString()}`}</h5>

  return (
    <>
      {isFetching && <h5 className="loading">Fetching...</h5>}
      <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
        {
          data.pages.map(pageData => {
            return pageData.results.map(item => {
              return (
                <Species
                  key={item.name}
                  name={item.name}
                  language={item.language}
                  averageLifespan={item.average_lifespan}
                />
              )
            })
          })
        }
      </InfiniteScroll>
    </>
  )
}
