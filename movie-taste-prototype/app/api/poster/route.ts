import { NextResponse } from "next/server";

const posterOverrides: Record<string, string> = {
  "amelie-2001": "https://image.tmdb.org/t/p/w500/oTKduWL2tpIKEmkAqF4mFEAWAsv.jpg",
  "arrival-2016": "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
  "dune-2021": "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
  "everythingeverywhereallatonce-2022": "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
  "getout-2017": "https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg",
  "gonegirl-2014": "https://image.tmdb.org/t/p/w500/qymaJhucquUwjpb8oiqynMeXnID.jpg",
  "her-2013": "https://image.tmdb.org/t/p/w500/eCOtqtfvn7mxGl6nfmq4b1exJRc.jpg",
  "inception-2010": "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
  "interstellar-2014": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  "knivesout-2019": "https://image.tmdb.org/t/p/w500/pThyQovXQrw2m0s9x82twj48Jq4.jpg",
  "lalaland-2016": "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
  "madmaxfuryroad-2015": "https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg",
  "parasite-2019": "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
  "prisoners-2013": "https://image.tmdb.org/t/p/w500/uhviyknTT5cEQXbn6vWIqfM4vGm.jpg",
  "spidermanintothespiderverse-2018": "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
  "thebigshort-2015": "https://image.tmdb.org/t/p/w500/scVEaJEwP8zUix8vgmMoJJ9Nq0w.jpg",
  "thedarkknight-2008": "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  "thegrandbudapesthotel-2014": "https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg",
  "thesocialnetwork-2010": "https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg",
  "thewolfofwallstreet-2013": "https://image.tmdb.org/t/p/w500/34m2tygAYBGqA9MXKhRDtzYd4MR.jpg",
  "whiplash-2014": "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const title = url.searchParams.get("title");
  const year = url.searchParams.get("year");

  if (!title) {
    return NextResponse.json({ poster: null }, { status: 400 });
  }

  const override = posterOverrides[posterKey(title, year)];

  if (override) {
    return NextResponse.json({ poster: override });
  }

  try {
    const response = await fetch(
      `https://movies-api.accel.li/api/v2/list_movies.json?limit=5&query_term=${encodeURIComponent(
        `${title} ${year ?? ""}`.trim(),
      )}`,
      { next: { revalidate: 60 * 60 * 24 * 30 } },
    );
    const data = (await response.json()) as {
      data?: {
        movies?: Array<{
          large_cover_image?: string;
          medium_cover_image?: string;
          year?: number;
        }>;
      };
    };
    const movies = data.data?.movies ?? [];
    const exact = movies.find((movie) => String(movie.year) === year);
    const poster = exact?.large_cover_image ?? movies[0]?.large_cover_image ?? movies[0]?.medium_cover_image;

    return NextResponse.json({ poster: poster ?? null });
  } catch {
    return NextResponse.json({ poster: null }, { status: 502 });
  }
}

function posterKey(title: string, year: string | null) {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "")}-${year ?? ""}`;
}
