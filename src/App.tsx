/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.css'
import useIntersectionObserver from "./useIntersectionObserver";
import React from 'react';
import {  useInfiniteQuery } from 'react-query';


function App() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    "starwars",
    async ({ pageParam = "https://swapi.dev/api/people/" }) =>
      await fetch(pageParam).then((res) => res.json()),
    {
      getNextPageParam: (lastPage) => lastPage.next ?? false,
    }
  );

  const loadMoreButtonRef = React.useRef();

  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  return (
    <main className="App">
      
      <div>
        {data?.pages.map((page) => (
          <React.Fragment>
            {page.results.map((character: any) => (
              <div className="Card">
                <span className="Card--id">#{character.id}</span>
                <img
                  className="Card--image"
                  src="https://gamek.mediacdn.vn/133514250583805952/2020/7/22/minatonamikaze-15954344445131022779104.png"
                  alt={character.name}
                />
                <h1 className="Card--name">{character.name}</h1>
                <span className="Card--details">
                  Born in {character.birth_year}
                </span>
              </div>
            ))}
          </React.Fragment>
        ))}
        <button
          ref={loadMoreButtonRef}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
            ? "Load Newer"
            : "Nothing more to load"}
        </button>
      </div>
    </main>
  );
}

export default App
