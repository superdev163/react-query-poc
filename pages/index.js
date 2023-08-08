import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useInfiniteQuery,
} from "react-query";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import useIntersectionObserver from "../components/useIntersectionObserver";

const queryClient = new QueryClient();

export default function Home() {
  const [mode, setMode] = useState("ninjas");

  return (
    <QueryClientProvider client={queryClient}>
      {mode === "ninjas" ? (
        <Ninjas setMode={setMode} />
      ) : (
        <StarWars setMode={setMode} />
      )}
    </QueryClientProvider>
  );
}

function Ninjas({ setMode }) {
  const url = "https://6066d55e98f405001728df1e.mockapi.io/ninjas/ninjas";
  const { isLoading, error, data } = useQuery("ninjas", () =>
    fetch(url).then((res) => res.json())
  );

  const ninjas = data ?? [];

  return (
    <main className="App">
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            height: "60px",
            lineHeight: "60px",
            paddingLeft: "2rem",
            paddingRight: "2rem",
            border: "1px solid black",
            cursor: "pointer",
            backgroundColor: "white",
            fontWeight: "bold",
            fontSize: "16px",
            borderRadius: "16px",
          }}
          onClick={() => setMode("ninjas")}
        >
          Mode: Normal
        </div>
        <div
          style={{
            height: "60px",
            lineHeight: "60px",
            paddingLeft: "2rem",
            paddingRight: "2rem",
            border: "1px solid black",
            cursor: "pointer",
            backgroundColor: "white",
            fontWeight: "bold",
            fontSize: "16px",
            borderRadius: "16px",
          }}
          onClick={() => setMode("starwars")}
        >
          Mode: Infinite
        </div>
      </div>
      <div>
        {ninjas &&
          ninjas.map((ninja) => {
            return (
              <div className="Card">
                <span className="Card--id">#{ninja.id}</span>
                <img
                  className="Card--image"
                  src="https://gamek.mediacdn.vn/133514250583805952/2020/7/22/minatonamikaze-15954344445131022779104.png"
                  alt={ninja.avatar}
                />
                <Link href={`/ninja/${ninja.id}`}>
                  <h1 className="Card--name">{ninja.name}</h1>
                </Link>
                <span className="Card--details">{ninja.skills}</span>
              </div>
            );
          })}
      </div>
    </main>
  );
}

function StarWars({ setMode }) {
  const {
    isLoading,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(
    "starwars",
    async ({ pageParam = "https://swapi.dev/api/people/" }) =>
      await fetch(pageParam).then((res) => res.json()),
    {
      getNextPageParam: (lastPage, pages) => lastPage.next ?? false,
    }
  );

  useEffect(() => {
    console.log(data?.pages);
  }, [data]);

  const loadMoreButtonRef = React.useRef();

  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  return (
    <main className="App">
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            height: "60px",
            lineHeight: "60px",
            paddingLeft: "2rem",
            paddingRight: "2rem",
            border: "1px solid black",
            cursor: "pointer",
            backgroundColor: "white",
            fontWeight: "bold",
            fontSize: "16px",
            borderRadius: "16px",
          }}
          onClick={() => setMode("ninjas")}
        >
          Mode: Normal
        </div>
        <div
          style={{
            height: "60px",
            lineHeight: "60px",
            paddingLeft: "2rem",
            paddingRight: "2rem",
            border: "1px solid black",
            cursor: "pointer",
            backgroundColor: "white",
            fontWeight: "bold",
            fontSize: "16px",
            borderRadius: "16px",
          }}
          onClick={() => setMode("starwars")}
        >
          Mode: Infinite
        </div>
      </div>
      <div>
        {data?.pages.map((page) => (
          <React.Fragment>
            {page.results.map((ninja) => (
              <div className="Card">
                <span className="Card--id">#{ninja.id}</span>
                <img
                  className="Card--image"
                  src="https://gamek.mediacdn.vn/133514250583805952/2020/7/22/minatonamikaze-15954344445131022779104.png"
                  alt={ninja.name}
                />
                <h1 className="Card--name">{ninja.name}</h1>
                <span className="Card--details">
                  Born in {ninja.birth_year}
                </span>
              </div>
            ))}
          </React.Fragment>
        ))}
        <button
          ref={loadMoreButtonRef}
          onClick={() => fetchNextPage()}
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
