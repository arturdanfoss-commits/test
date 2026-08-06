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
  { id: 1, title: "Начало", originalTitle: "Inception", year: "2010", poster: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg", description: "Sci-fi ограбление со снами, загадками и высоким темпом.", traits: ["sci-fi", "mind-bending", "high-stakes", "slick"], mood: "умный драйв" },
  { id: 2, title: "Отель «Гранд Будапешт»", originalTitle: "The Grand Budapest Hotel", year: "2014", poster: "https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg", description: "Точная, смешная и яркая история с авторским стилем.", traits: ["comedy", "stylized", "warm", "quirky"], mood: "элегантное озорство" },
  { id: 3, title: "Паразиты", originalTitle: "Parasite", year: "2019", poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", description: "Социальный триллер, который постоянно меняет форму.", traits: ["thriller", "social", "dark", "twist"], mood: "контролируемое напряжение" },
  { id: 4, title: "Безумный Макс: Дорога ярости", originalTitle: "Mad Max: Fury Road", year: "2015", poster: "https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg", description: "Чистое кино-погоня: громко, физично, яростно.", traits: ["action", "high-stakes", "visual", "intense"], mood: "полный газ" },
  { id: 5, title: "Прибытие", originalTitle: "Arrival", year: "2016", poster: "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg", description: "Тихая история контакта, языка, времени и потери.", traits: ["sci-fi", "emotional", "slow-burn", "thoughtful"], mood: "меланхоличное чудо" },
  { id: 6, title: "Ла-Ла Ленд", originalTitle: "La La Land", year: "2016", poster: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg", description: "Романтический мюзикл про амбиции, любовь и несовпадение.", traits: ["romance", "music", "bittersweet", "stylized"], mood: "яркая грусть" },
  { id: 7, title: "Прочь", originalTitle: "Get Out", year: "2017", poster: "https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg", description: "Социальный хоррор с ясной идеей и тревожным послевкусием.", traits: ["horror", "social", "thriller", "dark"], mood: "неловкая тревога" },
  { id: 8, title: "Достать ножи", originalTitle: "Knives Out", year: "2019", poster: "https://image.tmdb.org/t/p/w500/pThyQovXQrw2m0s9x82twj48Jq4.jpg", description: "Игривый детектив с острыми диалогами и поворотами.", traits: ["mystery", "comedy", "twist", "slick"], mood: "умное веселье" },
  { id: 9, title: "Тёмный рыцарь", originalTitle: "The Dark Knight", year: "2008", poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", description: "Криминальная эпопея в форме супергеройского блокбастера.", traits: ["action", "crime", "dark", "high-stakes"], mood: "большое давление" },
  { id: 10, title: "Она", originalTitle: "Her", year: "2013", poster: "https://image.tmdb.org/t/p/w500/eCOtqtfvn7mxGl6nfmq4b1exJRc.jpg", description: "Мягкая футуристичная романтика об одиночестве и связи.", traits: ["romance", "sci-fi", "emotional", "quiet"], mood: "нежное будущее" },
  { id: 11, title: "Одержимость", originalTitle: "Whiplash", year: "2014", poster: "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg", description: "Драма под давлением про амбиции, талант и одержимость.", traits: ["drama", "music", "intense", "psychological"], mood: "нервная энергия" },
  { id: 12, title: "Человек-паук: Через вселенные", originalTitle: "Spider-Man: Into the Spider-Verse", year: "2018", poster: "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg", description: "Взрывная анимационная супергероика с сердцем и ритмом.", traits: ["animation", "action", "warm", "visual"], mood: "кинетическая радость" },
  { id: 13, title: "Социальная сеть", originalTitle: "The Social Network", year: "2010", poster: "https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg", description: "Холодная быстрая драма про амбиции, статус и предательство.", traits: ["drama", "social", "slick", "dialogue"], mood: "острая амбиция" },
  { id: 14, title: "Интерстеллар", originalTitle: "Interstellar", year: "2014", poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", description: "Большая космическая драма про выживание, семью и время.", traits: ["sci-fi", "emotional", "epic", "visual"], mood: "космическая эмоция" },
  { id: 15, title: "Игра на понижение", originalTitle: "The Big Short", year: "2015", poster: "https://image.tmdb.org/t/p/w500/scVEaJEwP8zUix8vgmMoJJ9Nq0w.jpg", description: "Злая и смешная история финансового обвала.", traits: ["comedy", "social", "dialogue", "slick"], mood: "умное возмущение" },
  { id: 16, title: "Служанка", originalTitle: "The Handmaiden", year: "2016", poster: "https://image.tmdb.org/t/p/w500/dLlH4aNHdnmf62umnInL8xPlPzw.jpg", description: "Элегантный, чувственный и твистовый триллер.", traits: ["thriller", "romance", "twist", "stylized"], mood: "опасная элегантность" },
  { id: 17, title: "Приключения Паддингтона 2", originalTitle: "Paddington 2", year: "2017", poster: "https://image.tmdb.org/t/p/w500/1OJ9vkD5xPt3skC6KguyXAgagRZ.jpg", description: "Тёплая семейная комедия с настоящей эмоциональной отдачей.", traits: ["comedy", "warm", "family", "optimistic"], mood: "чистый комфорт" },
  { id: 18, title: "Из машины", originalTitle: "Ex Machina", year: "2014", poster: "https://image.tmdb.org/t/p/w500/btbRB7BrD887j5NrvjxceRDmaot.jpg", description: "Минималистичный sci-fi триллер про власть, интеллект и контроль.", traits: ["sci-fi", "psychological", "thriller", "quiet"], mood: "холодное подозрение" },
  { id: 19, title: "Волк с Уолл-стрит", originalTitle: "The Wolf of Wall Street", year: "2013", poster: "https://image.tmdb.org/t/p/w500/34m2tygAYBGqA9MXKhRDtzYd4MR.jpg", description: "Громкий, хаотичный и комичный взлёт и падение.", traits: ["comedy", "crime", "excess", "high-energy"], mood: "дикий аппетит" },
  { id: 20, title: "Лунный свет", originalTitle: "Moonlight", year: "2016", poster: "https://image.tmdb.org/t/p/w500/4911T5FbJ9eD2Faz5Z8cT3SUhU6.jpg", description: "Интимная драма взросления, рассказанная с тишиной и точностью.", traits: ["drama", "emotional", "quiet", "poetic"], mood: "мягкая боль" },
  { id: 21, title: "Дюна", originalTitle: "Dune", year: "2021", poster: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg", description: "Масштабный sci-fi миф с политикой, пророчеством и пустыней.", traits: ["sci-fi", "epic", "visual", "slow-burn"], mood: "пустынное величие" },
  { id: 22, title: "Исчезнувшая", originalTitle: "Gone Girl", year: "2014", poster: "https://image.tmdb.org/t/p/w500/qymaJhucquUwjpb8oiqynMeXnID.jpg", description: "Жестокий глянцевый триллер об отношениях и манипуляции.", traits: ["thriller", "psychological", "twist", "dark"], mood: "ядовитый глянец" },
  { id: 23, title: "Всё везде и сразу", originalTitle: "Everything Everywhere All at Once", year: "2022", poster: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg", description: "Хаотичная мультивселенная с комедией и искренним ядром.", traits: ["sci-fi", "comedy", "emotional", "quirky"], mood: "абсурдный катарсис" },
  { id: 24, title: "Пленницы", originalTitle: "Prisoners", year: "2013", poster: "https://image.tmdb.org/t/p/w500/uhviyknTT5cEQXbn6vWIqfM4vGm.jpg", description: "Мрачный криминальный триллер о страхе, отчаянии и морали.", traits: ["crime", "thriller", "dark", "slow-burn"], mood: "мрачная концентрация" },
];

const recommendationMovies: Movie[] = [
  { id: 101, title: "Бегущий по лезвию 2049", originalTitle: "Blade Runner 2049", year: "2017", poster: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg", description: "Большая, медленная и визуально мощная sci-fi драма о памяти и идентичности.", traits: ["sci-fi", "visual", "slow-burn", "psychological"], mood: "неоновая меланхолия" },
  { id: 102, title: "Матрица", originalTitle: "The Matrix", year: "1999", poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", description: "Культовый sci-fi экшен про реальность, контроль и пробуждение.", traits: ["sci-fi", "action", "mind-bending", "slick"], mood: "холодный драйв" },
  { id: 103, title: "Остров проклятых", originalTitle: "Shutter Island", year: "2010", poster: "https://image.tmdb.org/t/p/w500/kve20tXwUZpu4GUX8l6X7Z4jmL6.jpg", description: "Мрачный психологический триллер, где реальность постоянно ускользает.", traits: ["thriller", "psychological", "dark", "twist"], mood: "тревожная загадка" },
  { id: 104, title: "Престиж", originalTitle: "The Prestige", year: "2006", poster: "https://image.tmdb.org/t/p/w500/bdN3gXuIZYaJP7ftKK2sU0nPtEA.jpg", description: "История соперничества, одержимости и идеально собранного финального поворота.", traits: ["mystery", "twist", "psychological", "slick"], mood: "элегантная одержимость" },
  { id: 105, title: "Амели", originalTitle: "Amelie", year: "2001", poster: "https://image.tmdb.org/t/p/w500/oTKduWL2tpIKEmkAqF4mFEAWAsv.jpg", description: "Тёплая, странная и очень визуальная романтическая история.", traits: ["romance", "warm", "quirky", "stylized"], mood: "уютная магия" },
  { id: 106, title: "Вечное сияние чистого разума", originalTitle: "Eternal Sunshine of the Spotless Mind", year: "2004", poster: "https://image.tmdb.org/t/p/w500/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg", description: "Романтическая sci-fi драма о памяти, любви и болезненном выборе.", traits: ["romance", "sci-fi", "emotional", "bittersweet"], mood: "нежная боль" },
  { id: 107, title: "Старикам тут не место", originalTitle: "No Country for Old Men", year: "2007", poster: "https://image.tmdb.org/t/p/w500/bj1v6YKF8yHqA489VFfnQvOJpnc.jpg", description: "Сухой, напряжённый криминальный триллер про случай, страх и насилие.", traits: ["crime", "thriller", "dark", "slow-burn"], mood: "немая угроза" },
  { id: 108, title: "Драйв", originalTitle: "Drive", year: "2011", poster: "https://image.tmdb.org/t/p/w500/602vevIURmpDfzbnv5Ubi6wIkQm.jpg", description: "Стильный криминальный неон-нуар с редкими словами и резкими вспышками насилия.", traits: ["crime", "slick", "visual", "quiet"], mood: "молчаливый неон" },
  { id: 109, title: "Унесённые призраками", originalTitle: "Spirited Away", year: "2001", poster: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg", description: "Анимационная сказка о взрослении, страхе и чудесном мире рядом с нами.", traits: ["animation", "warm", "visual", "poetic"], mood: "волшебное взросление" },
  { id: 110, title: "Шоу Трумана", originalTitle: "The Truman Show", year: "1998", poster: "https://image.tmdb.org/t/p/w500/vuza0WqY239yBXOadKlGwJsZJFE.jpg", description: "Светлая, умная история о человеке, который начинает сомневаться в своей реальности.", traits: ["comedy", "social", "thoughtful", "warm"], mood: "мягкое пробуждение" },
  { id: 111, title: "Схватка", originalTitle: "Heat", year: "1995", poster: "https://image.tmdb.org/t/p/w500/umSVjVdbVwtx5ryCA2QXL44Durm.jpg", description: "Большая криминальная драма про профессионалов по разные стороны закона.", traits: ["crime", "drama", "high-stakes", "slick"], mood: "стальная концентрация" },
  { id: 112, title: "Брачная история", originalTitle: "Marriage Story", year: "2019", poster: "https://image.tmdb.org/t/p/w500/pZekG6xabTmZxjmYw10wN84Hp8d.jpg", description: "Интимная драма о любви, разрыве и попытке остаться людьми.", traits: ["drama", "emotional", "dialogue", "quiet"], mood: "честная близость" },
];

const pairIds = [[1,2],[3,4],[5,6],[7,8],[9,10],[11,12],[13,14],[15,16],[17,18],[19,20],[21,22],[23,24],[1,5],[4,12],[3,22],[6,10],[8,15],[14,21],[11,19],[17,20]];
const byId = new Map(surveyMovies.map((movie) => [movie.id, movie]));
const discoveryRounds = 12;

function scoreMovie(movie: Movie, taste: Record<string, number>) {
  return movie.traits.reduce((score, trait) => score + (taste[trait] ?? 0), 0);
}

function topTraits(taste: Record<string, number>) {
  return Object.entries(taste).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([trait]) => trait);
}

export default function Home() {
  const [round, setRound] = useState(0);
  const [taste, setTaste] = useState<Record<string, number>>({});
  const finished = round >= pairIds.length;
  const currentPair = pairIds[round]?.map((id) => byId.get(id)!);
  const progress = Math.round((round / pairIds.length) * 100);
  const phase = round < discoveryRounds
    ? { eyebrow: "этап 1", title: "Разведка вкуса", note: "Показываем разные типы фильмов, чтобы быстро понять направление." }
    : { eyebrow: "этап 2", title: "Уточняющий раунд", note: "Фильмы могут возвращаться в новых парах: так мы проверяем, что для тебя сильнее." };
  const recommendations = useMemo(() => recommendationMovies.map((movie) => ({ movie, score: scoreMovie(movie, taste) })).sort((a, b) => b.score - a.score).slice(0, 5).map(({ movie }) => movie), [taste]);

  function choose(movie: Movie) {
    setTaste((current) => {
      const next = { ...current };
      movie.traits.forEach((trait) => { next[trait] = (next[trait] ?? 0) + 1; });
      return next;
    });
    setRound((current) => current + 1);
  }

  function reset() {
    setRound(0);
    setTaste({});
  }

  return (
    <main className="min-h-screen bg-[#f3f0e8] text-[#141414]">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 border-b border-black/10 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#586052]">Movie Taste Lab</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-4xl">Выбери фильм. Мы поймем вкус.</h1>
          </div>
          <div className="rounded-full bg-[#141414] px-4 py-2 text-sm font-medium text-white">{finished ? "Готово" : `${round + 1} / ${pairIds.length}`}</div>
        </header>

        {!finished && currentPair ? (
          <div className="grid flex-1 content-center gap-5 py-6">
            <div className="h-2 overflow-hidden rounded-full bg-black/10"><div className="h-full rounded-full bg-[#cf4d35] transition-all duration-300" style={{ width: `${progress}%` }} /></div>
            <div className="grid gap-1 rounded-[8px] border border-black/10 bg-white/45 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#cf4d35]">{phase.eyebrow}</p>
              <div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="text-xl font-semibold">{phase.title}</h2><p className="max-w-2xl text-sm leading-6 text-[#55554d]">{phase.note}</p></div>
            </div>
            <div className="grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-6">
              <MovieChoice movie={currentPair[0]} side="left" onChoose={choose} />
              <div className="flex items-center justify-center"><span className="rounded-full border border-black/15 bg-white/60 px-4 py-2 text-sm font-semibold">или</span></div>
              <MovieChoice movie={currentPair[1]} side="right" onChoose={choose} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[#4a4a42]"><span>Кликай по фильму, который сейчас выбрал бы быстрее.</span><button className="rounded-full border border-black/15 px-4 py-2 font-medium transition hover:bg-white" onClick={reset} type="button">начать заново</button></div>
          </div>
        ) : (
          <Result onReset={reset} recommendations={recommendations} traits={topTraits(taste)} />
        )}

        <footer className="border-t border-black/10 py-4 text-xs text-[#66665d]">Постеры загружаются с TMDB image CDN. Это прототип для проверки механики, не финальная база фильмов.</footer>
      </section>
    </main>
  );
}

function MovieChoice({ movie, onChoose, side }: { movie: Movie; onChoose: (movie: Movie) => void; side: "left" | "right" }) {
  return (
    <button aria-label={`Выбрать ${movie.title}`} className="group grid min-h-[560px] overflow-hidden rounded-[8px] bg-[#1b1b1b] text-left text-white shadow-[0_22px_70px_rgba(35,35,28,0.22)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(35,35,28,0.28)] focus:outline-none focus:ring-4 focus:ring-[#cf4d35]/35" onClick={() => onChoose(movie)} type="button">
      <div className="relative min-h-[360px]"><img alt="" className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" src={movie.poster} /><div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" /><div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-black">{side === "left" ? "левый" : "правый"}</div></div>
      <div className="grid content-between gap-5 p-5">
        <div><div className="flex items-baseline justify-between gap-3"><h2 className="break-words text-2xl font-semibold leading-tight">{movie.title}</h2><span className="text-sm text-white/65">{movie.year}</span></div><p className="mt-1 text-sm text-white/48">{movie.originalTitle}</p><p className="mt-3 text-base leading-6 text-white/78">{movie.description}</p></div>
        <div><p className="text-sm font-medium text-[#f1c36d]">{movie.mood}</p><div className="mt-3 flex flex-wrap gap-2">{movie.traits.slice(0, 3).map((trait) => <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/78" key={trait}>{trait}</span>)}</div></div>
      </div>
    </button>
  );
}

function Result({ onReset, recommendations, traits }: { onReset: () => void; recommendations: Movie[]; traits: string[] }) {
  const mainRecommendation = recommendations[0]!;
  return (
    <div className="grid flex-1 items-center gap-6 py-8 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="overflow-hidden rounded-[8px] bg-[#181818] shadow-[0_26px_90px_rgba(35,35,28,0.24)]"><img alt="" className="h-[620px] w-full object-cover" src={mainRecommendation.poster} /></div>
      <section className="grid gap-6">
        <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#cf4d35]">5 новых рекомендаций</p><h2 className="mt-2 text-4xl font-semibold leading-tight sm:text-6xl">{mainRecommendation.title}</h2><p className="mt-3 text-lg text-[#4a4a42]">{mainRecommendation.year}</p></div>
        <p className="max-w-2xl text-xl leading-8 text-[#25251f]">Судя по выборам, тебе ближе фильмы с признаками <strong>{traits.join(", ") || "сильная история"}</strong>. Первый вариант в подборке должен попасть точнее всего. Эти фильмы не показывались в опросе: {mainRecommendation.description}</p>
        <div className="grid gap-3"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#586052]">полный список</p><div className="grid gap-3 sm:grid-cols-2">{recommendations.map((movie, index) => <div className="grid grid-cols-[72px_1fr] gap-3 rounded-[8px] border border-black/10 bg-white/45 p-3" key={movie.id}><img alt="" className="h-24 w-[72px] rounded-[6px] object-cover" src={movie.poster} /><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#cf4d35]">#{index + 1}</p><h3 className="mt-1 font-semibold">{movie.title}</h3><p className="mt-1 text-xs text-[#78786d]">{movie.originalTitle}</p><p className="mt-1 text-sm text-[#5b5b51]">{movie.mood}</p></div></div>)}</div></div>
        <button className="w-fit rounded-full bg-[#141414] px-6 py-3 font-semibold text-white transition hover:bg-[#cf4d35]" onClick={onReset} type="button">пройти ещё раз</button>
      </section>
    </div>
  );
}
