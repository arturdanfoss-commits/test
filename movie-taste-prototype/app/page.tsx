"use client";

import { useMemo, useState } from "react";

type Movie = {
  id: number;
  title: string;
  originalTitle: string;
  year: string;
  poster: string;
  description: string;
  traits: string[];
  mood: string;
};

const surveyMovies: Movie[] = [
  movie(1, "Начало", "Inception", "2010", "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg", ["sci-fi", "mind-bending", "action"], "умный драйв"),
  movie(2, "Отель Гранд Будапешт", "The Grand Budapest Hotel", "2014", "https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg", ["comedy", "stylized", "warm"], "элегантная комедия"),
  movie(3, "Паразиты", "Parasite", "2019", "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", ["thriller", "social", "dark"], "социальное напряжение"),
  movie(4, "Безумный Макс: Дорога ярости", "Mad Max: Fury Road", "2015", "https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg", ["action", "visual", "intense"], "чистый экшен"),
  movie(5, "Прибытие", "Arrival", "2016", "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg", ["sci-fi", "emotional", "slow-burn"], "тихая фантастика"),
  movie(6, "Ла-Ла Ленд", "La La Land", "2016", "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg", ["romance", "music", "bittersweet"], "романтика и музыка"),
  movie(7, "Прочь", "Get Out", "2017", "https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg", ["horror", "social", "thriller"], "умный хоррор"),
  movie(8, "Достать ножи", "Knives Out", "2019", "https://image.tmdb.org/t/p/w500/pThyQovXQrw2m0s9x82twj48Jq4.jpg", ["mystery", "comedy", "twist"], "детективная игра"),
  movie(9, "Тёмный рыцарь", "The Dark Knight", "2008", "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", ["action", "crime", "dark"], "мрачный блокбастер"),
  movie(10, "Она", "Her", "2013", "https://image.tmdb.org/t/p/w500/eCOtqtfvn7mxGl6nfmq4b1exJRc.jpg", ["romance", "sci-fi", "emotional"], "нежное будущее"),
  movie(11, "Одержимость", "Whiplash", "2014", "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg", ["drama", "music", "intense"], "нервная амбиция"),
  movie(12, "Человек-паук: Через вселенные", "Spider-Man: Into the Spider-Verse", "2018", "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg", ["animation", "action", "warm"], "кинетическая радость"),
  movie(13, "Социальная сеть", "The Social Network", "2010", "https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg", ["drama", "dialogue", "social"], "холодная амбиция"),
  movie(14, "Интерстеллар", "Interstellar", "2014", "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", ["sci-fi", "epic", "emotional"], "космическая эмоция"),
  movie(15, "Игра на понижение", "The Big Short", "2015", "https://image.tmdb.org/t/p/w500/scVEaJEwP8zUix8vgmMoJJ9Nq0w.jpg", ["comedy", "social", "dialogue"], "умная злость"),
  movie(16, "Служанка", "The Handmaiden", "2016", "https://image.tmdb.org/t/p/w500/dLlH4aNHdnmf62umnInL8xPlPzw.jpg", ["thriller", "romance", "twist"], "опасная элегантность"),
  movie(17, "Паддингтон 2", "Paddington 2", "2017", "https://image.tmdb.org/t/p/w500/1OJ9vkD5xPt3skC6KguyXAgagRZ.jpg", ["comedy", "warm", "family"], "чистый комфорт"),
  movie(18, "Из машины", "Ex Machina", "2014", "https://image.tmdb.org/t/p/w500/dmJW8IAKHKxFNiUnoDR7JfsK7Rp.jpg", ["sci-fi", "psychological", "thriller"], "холодное подозрение"),
  movie(19, "Волк с Уолл-стрит", "The Wolf of Wall Street", "2013", "https://image.tmdb.org/t/p/w500/34m2tygAYBGqA9MXKhRDtzYd4MR.jpg", ["comedy", "crime", "high-energy"], "дикий аппетит"),
  movie(20, "Лунный свет", "Moonlight", "2016", "https://image.tmdb.org/t/p/w500/qLnfEmPrDjJfPyyddLJPkXmshkp.jpg", ["drama", "emotional", "quiet"], "тихая боль"),
  movie(21, "Дюна", "Dune", "2021", "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg", ["sci-fi", "epic", "visual"], "пустынный масштаб"),
  movie(22, "Исчезнувшая", "Gone Girl", "2014", "https://image.tmdb.org/t/p/w500/qymaJhucquUwjpb8oiqynMeXnID.jpg", ["thriller", "psychological", "twist"], "ядовитый триллер"),
  movie(23, "Всё везде и сразу", "Everything Everywhere All at Once", "2022", "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg", ["sci-fi", "comedy", "emotional"], "абсурдный катарсис"),
  movie(24, "Пленницы", "Prisoners", "2013", "https://image.tmdb.org/t/p/w500/uhviyknTT5cEQXbn6vWIqfM4vGm.jpg", ["crime", "thriller", "dark"], "мрачный фокус"),
];

const recommendationSeed = [
  ["Крёстный отец", "The Godfather", "1972"], ["Криминальное чтиво", "Pulp Fiction", "1994"], ["Бойцовский клуб", "Fight Club", "1999"], ["Форрест Гамп", "Forrest Gump", "1994"], ["Побег из Шоушенка", "The Shawshank Redemption", "1994"],
  ["Славные парни", "Goodfellas", "1990"], ["Семь", "Se7en", "1995"], ["Молчание ягнят", "The Silence of the Lambs", "1991"], ["Гладиатор", "Gladiator", "2000"], ["Отступники", "The Departed", "2006"],
  ["Таксист", "Taxi Driver", "1976"], ["Апокалипсис сегодня", "Apocalypse Now", "1979"], ["Чужой", "Alien", "1979"], ["Чужие", "Aliens", "1986"], ["Терминатор 2", "Terminator 2: Judgment Day", "1991"],
  ["Назад в будущее", "Back to the Future", "1985"], ["Парк Юрского периода", "Jurassic Park", "1993"], ["Титаник", "Titanic", "1997"], ["Спасти рядового Райана", "Saving Private Ryan", "1998"], ["Американская история X", "American History X", "1998"],
  ["Большой Лебовски", "The Big Lebowski", "1998"], ["Шестое чувство", "The Sixth Sense", "1999"], ["Помни", "Memento", "2000"], ["Реквием по мечте", "Requiem for a Dream", "2000"], ["Малхолланд Драйв", "Mulholland Drive", "2001"],
  ["Город Бога", "City of God", "2002"], ["Поймай меня, если сможешь", "Catch Me If You Can", "2002"], ["Олдбой", "Oldboy", "2003"], ["Убить Билла", "Kill Bill", "2003"], ["Перед закатом", "Before Sunset", "2004"],
  ["Отель Руанда", "Hotel Rwanda", "2004"], ["Малышка на миллион", "Million Dollar Baby", "2004"], ["Горбатая гора", "Brokeback Mountain", "2005"], ["V значит вендетта", "V for Vendetta", "2005"], ["Дитя человеческое", "Children of Men", "2006"],
  ["Лабиринт Фавна", "Pan's Labyrinth", "2006"], ["Жизнь других", "The Lives of Others", "2006"], ["Нефть", "There Will Be Blood", "2007"], ["Зодиак", "Zodiac", "2007"], ["Искупление", "Atonement", "2007"],
  ["ВАЛЛ-И", "WALL-E", "2008"], ["Миллионер из трущоб", "Slumdog Millionaire", "2008"], ["Гран Торино", "Gran Torino", "2008"], ["Аватар", "Avatar", "2009"], ["Бесславные ублюдки", "Inglourious Basterds", "2009"],
  ["Район №9", "District 9", "2009"], ["Чёрный лебедь", "Black Swan", "2010"], ["Король говорит!", "The King's Speech", "2010"], ["1+1", "The Intouchables", "2011"], ["Артист", "The Artist", "2011"],
  ["Операция Арго", "Argo", "2012"], ["Джанго освобождённый", "Django Unchained", "2012"], ["Жизнь Пи", "Life of Pi", "2012"], ["Гравитация", "Gravity", "2013"], ["12 лет рабства", "12 Years a Slave", "2013"],
  ["Отрочество", "Boyhood", "2014"], ["Стрингер", "Nightcrawler", "2014"], ["Бердмэн", "Birdman", "2014"], ["Марсианин", "The Martian", "2015"], ["Комната", "Room", "2015"],
  ["В центре внимания", "Spotlight", "2015"], ["Зверополис", "Zootopia", "2016"], ["Манчестер у моря", "Manchester by the Sea", "2016"], ["Капитан Фантастик", "Captain Fantastic", "2016"], ["Логан", "Logan", "2017"],
  ["Дюнкерк", "Dunkirk", "2017"], ["Форма воды", "The Shape of Water", "2017"], ["Три билборда", "Three Billboards Outside Ebbing, Missouri", "2017"], ["Зови меня своим именем", "Call Me by Your Name", "2017"], ["Первому игроку приготовиться", "Ready Player One", "2018"],
  ["Рома", "Roma", "2018"], ["Фаворитка", "The Favourite", "2018"], ["Джокер", "Joker", "2019"], ["1917", "1917", "2019"], ["Кролик Джоджо", "Jojo Rabbit", "2019"],
  ["Душа", "Soul", "2020"], ["Звук металла", "Sound of Metal", "2019"], ["Минари", "Minari", "2020"], ["Ещё по одной", "Another Round", "2020"], ["Отец", "The Father", "2020"],
  ["CODA", "CODA", "2021"], ["Власть пса", "The Power of the Dog", "2021"], ["Лакричная пицца", "Licorice Pizza", "2021"], ["Топ Ган: Мэверик", "Top Gun: Maverick", "2022"], ["Тар", "Tar", "2022"],
  ["Банши Инишерина", "The Banshees of Inisherin", "2022"], ["Фабельманы", "The Fabelmans", "2022"], ["Оппенгеймер", "Oppenheimer", "2023"], ["Барби", "Barbie", "2023"], ["Убийцы цветочной луны", "Killers of the Flower Moon", "2023"],
  ["Анатомия падения", "Anatomy of a Fall", "2023"], ["Зона интересов", "The Zone of Interest", "2023"], ["Прошлые жизни", "Past Lives", "2023"], ["Бедные-несчастные", "Poor Things", "2023"], ["Дюна: Часть вторая", "Dune: Part Two", "2024"],
  ["Гражданская война", "Civil War", "2024"], ["Матрица", "The Matrix", "1999"], ["Престиж", "The Prestige", "2006"], ["Амели", "Amelie", "2001"], ["Унесённые призраками", "Spirited Away", "2001"], ["Шоу Трумана", "The Truman Show", "1998"],
] as const;

const traitBank = [
  ["crime", "drama", "dark"], ["comedy", "dialogue", "slick"], ["sci-fi", "visual", "epic"], ["romance", "emotional", "warm"], ["thriller", "psychological", "twist"], ["animation", "family", "optimistic"],
];

const recommendationMovies = recommendationSeed.map(([title, originalTitle, year], index) =>
  movie(1000 + index, title, originalTitle, year, posterFor(title, originalTitle, year, index), traitBank[index % traitBank.length], "свежая рекомендация"),
);

function movie(id: number, title: string, originalTitle: string, year: string, poster: string, traits: string[], mood: string): Movie {
  return {
    id,
    title,
    originalTitle,
    year,
    poster,
    traits,
    mood,
    description: `${title} — фильм, который помогает точнее понять вкус по жанру, настроению и темпу.`,
  };
}

function key(movie: Pick<Movie, "originalTitle">) {
  return movie.originalTitle.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function cryptoRandom() {
  if (typeof window !== "undefined" && window.crypto) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0] / 4294967295;
  }

  return Math.random();
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => cryptoRandom() - 0.5);
}

function buildPairs() {
  const ids = shuffle(surveyMovies.map((movie) => movie.id));
  return Array.from({ length: 20 }, (_, round) => {
    const left = ids[(round * 2) % ids.length];
    const right = ids[(round * 2 + 7) % ids.length];
    return [left, left === right ? ids[(round * 2 + 9) % ids.length] : right];
  });
}

function pickRecommendations() {
  const surveyKeys = new Set(surveyMovies.map(key));
  const recent = getRecent();
  const cleanPool = recommendationMovies.filter((movie) => !surveyKeys.has(key(movie)));
  const unseen = cleanPool.filter((movie) => !recent.has(key(movie)));
  const source = unseen.length >= 5 ? unseen : cleanPool;
  const selected = shuffle(source).slice(0, 5);
  saveRecent(selected);
  return selected;
}

function getRecent() {
  if (typeof window === "undefined") return new Set<string>();

  try {
    return new Set<string>(JSON.parse(localStorage.getItem("movieTasteRecent:v1") ?? "[]"));
  } catch {
    return new Set<string>();
  }
}

function saveRecent(movies: Movie[]) {
  if (typeof window === "undefined") return;

  const next = [...movies.map(key), ...Array.from(getRecent())].slice(0, 80);
  localStorage.setItem("movieTasteRecent:v1", JSON.stringify(next));
}

function topTraits(taste: Record<string, number>) {
  return Object.entries(taste)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([trait]) => trait);
}

function posterFor(title: string, originalTitle: string, year: string, index: number) {
  const palettes = [["#17223b", "#2a6f97", "#f2c14e"], ["#141414", "#4a1f24", "#d9a441"], ["#17594a", "#d39c2f", "#f3e8c8"], ["#5d2a42", "#c05a7a", "#f3d6c6"]];
  const [a, b, c] = palettes[index % palettes.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${a}"/><stop offset=".62" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient></defs><rect width="500" height="750" fill="url(#g)"/><rect x="34" y="34" width="432" height="682" rx="18" fill="rgba(0,0,0,.2)" stroke="rgba(255,255,255,.28)"/><text x="58" y="100" fill="rgba(255,255,255,.75)" font-family="Arial" font-size="24" font-weight="700">${year}</text><text x="58" y="345" textLength="384" lengthAdjust="spacingAndGlyphs" fill="white" font-family="Arial" font-size="42" font-weight="800">${escapeSvg(title)}</text><text x="58" y="405" textLength="384" lengthAdjust="spacingAndGlyphs" fill="rgba(255,255,255,.7)" font-family="Arial" font-size="23" font-weight="600">${escapeSvg(originalTitle)}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeSvg(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export default function Home() {
  const [round, setRound] = useState(0);
  const [taste, setTaste] = useState<Record<string, number>>({});
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [seed, setSeed] = useState(0);
  const pairs = useMemo(() => buildPairs(), [seed]);
  const moviesById = useMemo(() => new Map(surveyMovies.map((movie) => [movie.id, movie])), []);
  const currentPair = pairs[round]?.map((id) => moviesById.get(id)!);
  const finished = round >= pairs.length;

  function choose(movie: Movie) {
    const nextTaste = { ...taste };
    movie.traits.forEach((trait) => {
      nextTaste[trait] = (nextTaste[trait] ?? 0) + 1;
    });
    setTaste(nextTaste);

    if (round + 1 >= pairs.length) {
      setRecommendations(pickRecommendations());
    }

    setRound(round + 1);
  }

  function reset() {
    setRound(0);
    setTaste({});
    setRecommendations([]);
    setSeed(Date.now());
  }

  if (finished) {
    return <Result recommendations={recommendations} traits={topTraits(taste)} onReset={reset} onShuffle={() => setRecommendations(pickRecommendations())} />;
  }

  return (
    <main className="min-h-screen bg-[#f3f0e8] px-4 py-5 text-[#141414] sm:px-6">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col gap-5">
        <header className="flex items-center justify-between gap-4 border-b border-black/10 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#586052]">Movie Taste Lab</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-4xl">Выбери фильм. Мы поймем вкус.</h1>
          </div>
          <div className="rounded-full bg-[#141414] px-4 py-2 text-sm font-medium text-white">{round + 1} / {pairs.length}</div>
        </header>

        <div className="h-2 overflow-hidden rounded-full bg-black/10">
          <div className="h-full rounded-full bg-[#cf4d35] transition-all" style={{ width: `${Math.round((round / pairs.length) * 100)}%` }} />
        </div>

        <div className="grid flex-1 items-center gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-6">
          <Choice movie={currentPair[0]} side="левый" onChoose={choose} />
          <span className="justify-self-center rounded-full border border-black/15 bg-white/60 px-4 py-2 text-sm font-semibold">или</span>
          <Choice movie={currentPair[1]} side="правый" onChoose={choose} />
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 py-4 text-sm text-[#66665d]">
          <span>20 быстрых выборов. В конце — 5 фильмов из отдельного списка.</span>
          <button className="rounded-full border border-black/15 px-4 py-2 font-medium hover:bg-white" onClick={reset}>начать заново</button>
        </footer>
      </section>
    </main>
  );
}

function Choice({ movie, side, onChoose }: { movie: Movie; side: string; onChoose: (movie: Movie) => void }) {
  return (
    <button className="group grid min-h-[560px] overflow-hidden rounded-[8px] bg-[#1b1b1b] text-left text-white shadow-[0_22px_70px_rgba(35,35,28,0.22)] transition hover:-translate-y-1" onClick={() => onChoose(movie)}>
      <div className="relative min-h-[360px]">
        <img alt="" className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-[1.03]" src={movie.poster} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-black">{side}</span>
      </div>
      <div className="grid gap-4 p-5">
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-2xl font-semibold leading-tight">{movie.title}</h2>
            <span className="text-sm text-white/65">{movie.year}</span>
          </div>
          <p className="mt-1 text-sm text-white/48">{movie.originalTitle}</p>
          <p className="mt-3 text-base leading-6 text-white/78">{movie.description}</p>
        </div>
        <p className="text-sm font-medium text-[#f1c36d]">{movie.mood}</p>
      </div>
    </button>
  );
}

function Result({ recommendations, traits, onReset, onShuffle }: { recommendations: Movie[]; traits: string[]; onReset: () => void; onShuffle: () => void }) {
  const [main] = recommendations;

  return (
    <main className="min-h-screen bg-[#f3f0e8] px-4 py-8 text-[#141414] sm:px-6">
      <section className="mx-auto grid min-h-screen max-w-6xl items-center gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="overflow-hidden rounded-[8px] bg-[#181818] shadow-[0_26px_90px_rgba(35,35,28,0.24)]">
          {main && <img alt="" className="h-[620px] w-full object-cover" src={main.poster} />}
        </div>
        <div className="grid gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#cf4d35]">5 новых рекомендаций</p>
            <h1 className="mt-2 text-4xl font-semibold leading-tight sm:text-6xl">{main?.title ?? "Подборка готова"}</h1>
          </div>
          <p className="max-w-2xl text-xl leading-8 text-[#25251f]">Судя по выборам, тебе ближе: <strong>{traits.join(", ") || "сильная история"}</strong>. Рекомендации берутся из отдельного списка и не повторяют фильмы опроса.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {recommendations.map((movie, index) => (
              <article className="grid grid-cols-[72px_1fr] gap-3 rounded-[8px] border border-black/10 bg-white/45 p-3" key={movie.id}>
                <img alt="" className="h-24 w-[72px] rounded-[6px] object-cover" src={movie.poster} />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#cf4d35]">#{index + 1}</p>
                  <h2 className="mt-1 font-semibold">{movie.title}</h2>
                  <p className="mt-1 text-xs text-[#78786d]">{movie.originalTitle}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-full bg-[#141414] px-6 py-3 font-semibold text-white hover:bg-[#cf4d35]" onClick={onShuffle}>перемешать рекомендации</button>
            <button className="rounded-full border border-black/15 px-6 py-3 font-semibold hover:bg-white" onClick={onReset}>пройти ещё раз</button>
          </div>
        </div>
      </section>
    </main>
  );
}
