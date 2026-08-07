"use client";

import { useEffect, useMemo, useState } from "react";

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

type MovieSeed = [
  title: string,
  originalTitle: string,
  year: string,
  traits: string[],
  mood: string,
];

type Question = [Movie, Movie];

const rounds = 20;
const recommendationsCount = 5;
const recentQuestionKey = "movieTasteRecentQuestions:v4";
const recentRecommendationKey = "movieTasteRecentRecommendations:v4";

const surveySeeds: MovieSeed[] = [
  ["Касабланка", "Casablanca", "1942", ["romance", "classic", "drama"], "вечная романтика"],
  ["Психо", "Psycho", "1960", ["horror", "thriller", "classic"], "ледяное напряжение"],
  ["2001 год: Космическая одиссея", "2001: A Space Odyssey", "1968", ["sci-fi", "visual", "slow"], "космическая загадка"],
  ["Крёстный отец", "The Godfather", "1972", ["crime", "drama", "epic"], "семейная власть"],
  ["Таксист", "Taxi Driver", "1976", ["drama", "psychological", "dark"], "городское одиночество"],
  ["Чужой", "Alien", "1979", ["sci-fi", "horror", "thriller"], "космический ужас"],
  ["Сияние", "The Shining", "1980", ["horror", "psychological", "slow"], "безумие в отеле"],
  ["Бегущий по лезвию", "Blade Runner", "1982", ["sci-fi", "noir", "visual"], "неоновая тоска"],
  ["Назад в будущее", "Back to the Future", "1985", ["sci-fi", "comedy", "warm"], "лёгкое приключение"],
  ["Принцесса-невеста", "The Princess Bride", "1987", ["adventure", "comedy", "romance"], "сказочная ирония"],
  ["Крепкий орешек", "Die Hard", "1988", ["action", "thriller", "high-energy"], "рождественский экшен"],
  ["Славные парни", "Goodfellas", "1990", ["crime", "drama", "high-energy"], "криминальный подъём"],
  ["Молчание ягнят", "The Silence of the Lambs", "1991", ["thriller", "crime", "psychological"], "умный страх"],
  ["Терминатор 2", "Terminator 2: Judgment Day", "1991", ["sci-fi", "action", "emotional"], "железная защита"],
  ["День сурка", "Groundhog Day", "1993", ["comedy", "fantasy", "warm"], "петля перемен"],
  ["Побег из Шоушенка", "The Shawshank Redemption", "1994", ["drama", "hopeful", "slow"], "тихая надежда"],
  ["Криминальное чтиво", "Pulp Fiction", "1994", ["crime", "comedy", "dialogue"], "криминальный ритм"],
  ["Семь", "Se7en", "1995", ["crime", "thriller", "dark"], "мрачная охота"],
  ["Фарго", "Fargo", "1996", ["crime", "comedy", "dark"], "снежный абсурд"],
  ["Матрица", "The Matrix", "1999", ["sci-fi", "action", "mind-bending"], "холодный драйв"],
  ["Бойцовский клуб", "Fight Club", "1999", ["psychological", "dark", "twist"], "злая идентичность"],
  ["Амели", "Amelie", "2001", ["romance", "quirky", "warm"], "уютная магия"],
  ["Властелин колец: Братство кольца", "The Lord of the Rings: The Fellowship of the Ring", "2001", ["fantasy", "epic", "adventure"], "большой путь"],
  ["Унесённые призраками", "Spirited Away", "2001", ["animation", "fantasy", "poetic"], "волшебное взросление"],
  ["Поймай меня, если сможешь", "Catch Me If You Can", "2002", ["crime", "comedy", "slick"], "обаятельная афера"],
  ["Олдбой", "Oldboy", "2003", ["thriller", "dark", "twist"], "жестокая загадка"],
  ["Вечное сияние чистого разума", "Eternal Sunshine of the Spotless Mind", "2004", ["romance", "sci-fi", "bittersweet"], "нежная боль"],
  ["Престиж", "The Prestige", "2006", ["mystery", "twist", "psychological"], "элегантная одержимость"],
  ["Дитя человеческое", "Children of Men", "2006", ["sci-fi", "drama", "dark"], "потерянное будущее"],
  ["Старикам тут не место", "No Country for Old Men", "2007", ["crime", "thriller", "dark"], "немая угроза"],
  ["ВАЛЛ-И", "WALL-E", "2008", ["animation", "sci-fi", "warm"], "робот с сердцем"],
  ["Тёмный рыцарь", "The Dark Knight", "2008", ["action", "crime", "dark"], "город под давлением"],
  ["Бесславные ублюдки", "Inglourious Basterds", "2009", ["war", "dialogue", "stylized"], "кино мести"],
  ["Начало", "Inception", "2010", ["sci-fi", "action", "mind-bending"], "сонный лабиринт"],
  ["Драйв", "Drive", "2011", ["crime", "visual", "quiet"], "молчаливый неон"],
  ["Джанго освобождённый", "Django Unchained", "2012", ["western", "action", "stylized"], "яркая месть"],
  ["Она", "Her", "2013", ["romance", "sci-fi", "emotional"], "нежное будущее"],
  ["Гравитация", "Gravity", "2013", ["sci-fi", "thriller", "visual"], "тишина космоса"],
  ["Отель Гранд Будапешт", "The Grand Budapest Hotel", "2014", ["comedy", "stylized", "warm"], "элегантная комедия"],
  ["Одержимость", "Whiplash", "2014", ["drama", "music", "intense"], "нервная амбиция"],
  ["Безумный Макс: Дорога ярости", "Mad Max: Fury Road", "2015", ["action", "visual", "high-energy"], "чистая погоня"],
  ["Марсианин", "The Martian", "2015", ["sci-fi", "adventure", "optimistic"], "наука выживания"],
  ["Ла-Ла Ленд", "La La Land", "2016", ["romance", "music", "bittersweet"], "яркая грусть"],
  ["Прибытие", "Arrival", "2016", ["sci-fi", "emotional", "slow"], "тихое чудо"],
  ["Прочь", "Get Out", "2017", ["horror", "social", "thriller"], "социальный кошмар"],
  ["Дюнкерк", "Dunkirk", "2017", ["war", "thriller", "intense"], "время и страх"],
  ["Человек-паук: Через вселенные", "Spider-Man: Into the Spider-Verse", "2018", ["animation", "action", "warm"], "кинетическая радость"],
  ["Паразиты", "Parasite", "2019", ["thriller", "social", "dark"], "классовое напряжение"],
  ["Достать ножи", "Knives Out", "2019", ["mystery", "comedy", "twist"], "детективная игра"],
  ["Дюна", "Dune", "2021", ["sci-fi", "epic", "visual"], "пустынный масштаб"],
  ["Топ Ган: Мэверик", "Top Gun: Maverick", "2022", ["action", "visual", "emotional"], "воздушный драйв"],
  ["Всё везде и сразу", "Everything Everywhere All at Once", "2022", ["sci-fi", "comedy", "emotional"], "абсурдный катарсис"],
  ["Оппенгеймер", "Oppenheimer", "2023", ["drama", "historical", "intense"], "интеллект и вина"],
  ["Барби", "Barbie", "2023", ["comedy", "social", "stylized"], "розовая сатира"],
  ["Дюна: Часть вторая", "Dune: Part Two", "2024", ["sci-fi", "epic", "high-stakes"], "песчаная судьба"],
];

const recommendationSeeds: MovieSeed[] = [
  ["Сансет бульвар", "Sunset Boulevard", "1950", ["classic", "drama", "dark"], "старая слава"],
  ["12 разгневанных мужчин", "12 Angry Men", "1957", ["drama", "dialogue", "classic"], "спор о правде"],
  ["На север через северо-запад", "North by Northwest", "1959", ["thriller", "adventure", "classic"], "элегантная погоня"],
  ["Хороший, плохой, злой", "The Good, the Bad and the Ugly", "1966", ["western", "epic", "stylized"], "пыльная дуэль"],
  ["Китайский квартал", "Chinatown", "1974", ["crime", "mystery", "noir"], "солнечный нуар"],
  ["Рокки", "Rocky", "1976", ["drama", "sport", "hopeful"], "бой за себя"],
  ["Звёздные войны", "Star Wars", "1977", ["sci-fi", "adventure", "epic"], "космическая сказка"],
  ["Охотники за привидениями", "Ghostbusters", "1984", ["comedy", "fantasy", "high-energy"], "городская фантазия"],
  ["Гремлины", "Gremlins", "1984", ["comedy", "horror", "quirky"], "хаос после полуночи"],
  ["Завтрак у Тиффани", "Breakfast at Tiffany's", "1961", ["romance", "classic", "stylized"], "городская лёгкость"],
  ["Кто подставил кролика Роджера", "Who Framed Roger Rabbit", "1988", ["comedy", "animation", "mystery"], "мультяшный нуар"],
  ["Мой сосед Тоторо", "My Neighbor Totoro", "1988", ["animation", "family", "warm"], "мягкое чудо"],
  ["Общество мёртвых поэтов", "Dead Poets Society", "1989", ["drama", "emotional", "inspiring"], "голос свободы"],
  ["Красотка", "Pretty Woman", "1990", ["romance", "comedy", "warm"], "глянцевая сказка"],
  ["Эдвард руки-ножницы", "Edward Scissorhands", "1990", ["fantasy", "romance", "bittersweet"], "странная нежность"],
  ["Парк Юрского периода", "Jurassic Park", "1993", ["adventure", "sci-fi", "visual"], "чудо и опасность"],
  ["Король Лев", "The Lion King", "1994", ["animation", "family", "epic"], "круг жизни"],
  ["Перед рассветом", "Before Sunrise", "1995", ["romance", "dialogue", "quiet"], "ночной разговор"],
  ["История игрушек", "Toy Story", "1995", ["animation", "comedy", "warm"], "игрушечная дружба"],
  ["Титаник", "Titanic", "1997", ["romance", "drama", "epic"], "большая любовь"],
  ["Шоу Трумана", "The Truman Show", "1998", ["comedy", "social", "thoughtful"], "мягкое пробуждение"],
  ["Спасти рядового Райана", "Saving Private Ryan", "1998", ["war", "drama", "intense"], "тяжёлая миссия"],
  ["Шестое чувство", "The Sixth Sense", "1999", ["thriller", "twist", "quiet"], "тихая тайна"],
  ["Магнолия", "Magnolia", "1999", ["drama", "emotional", "ensemble"], "переплетение судеб"],
  ["Гладиатор", "Gladiator", "2000", ["action", "drama", "epic"], "честь и месть"],
  ["Помни", "Memento", "2000", ["thriller", "mind-bending", "twist"], "сломанная память"],
  ["Шрек", "Shrek", "2001", ["animation", "comedy", "fantasy"], "перевёрнутая сказка"],
  ["Город Бога", "City of God", "2002", ["crime", "drama", "social"], "улица без выхода"],
  ["Пианист", "The Pianist", "2002", ["drama", "historical", "emotional"], "выживание в тишине"],
  ["Убить Билла", "Kill Bill", "2003", ["action", "stylized", "revenge"], "жёлтая месть"],
  ["Перед закатом", "Before Sunset", "2004", ["romance", "dialogue", "bittersweet"], "время и разговор"],
  ["Отель Руанда", "Hotel Rwanda", "2004", ["drama", "historical", "high-stakes"], "выбор совести"],
  ["Малышка на миллион", "Million Dollar Baby", "2004", ["drama", "sport", "emotional"], "тяжёлая мечта"],
  ["V значит вендетта", "V for Vendetta", "2005", ["action", "social", "stylized"], "маска сопротивления"],
  ["Лабиринт Фавна", "Pan's Labyrinth", "2006", ["fantasy", "dark", "poetic"], "сказка во тьме"],
  ["Жизнь других", "The Lives of Others", "2006", ["drama", "social", "quiet"], "тихое наблюдение"],
  ["Нефть", "There Will Be Blood", "2007", ["drama", "psychological", "epic"], "жадная мощь"],
  ["Зодиак", "Zodiac", "2007", ["crime", "mystery", "slow"], "навязчивое расследование"],
  ["Искупление", "Atonement", "2007", ["romance", "drama", "bittersweet"], "ошибка навсегда"],
  ["Миллионер из трущоб", "Slumdog Millionaire", "2008", ["drama", "romance", "high-energy"], "судьба и память"],
  ["Гран Торино", "Gran Torino", "2008", ["drama", "social", "quiet"], "жёсткая нежность"],
  ["Аватар", "Avatar", "2009", ["sci-fi", "adventure", "visual"], "чужой мир"],
  ["Район №9", "District 9", "2009", ["sci-fi", "social", "action"], "грязная фантастика"],
  ["Чёрный лебедь", "Black Swan", "2010", ["drama", "psychological", "intense"], "идеальная трещина"],
  ["Король говорит!", "The King's Speech", "2010", ["drama", "historical", "warm"], "голос ответственности"],
  ["1+1", "The Intouchables", "2011", ["comedy", "drama", "warm"], "человеческое тепло"],
  ["Артист", "The Artist", "2011", ["romance", "comedy", "stylized"], "немое очарование"],
  ["Операция Арго", "Argo", "2012", ["thriller", "historical", "slick"], "побег под видом кино"],
  ["Жизнь Пи", "Life of Pi", "2012", ["adventure", "visual", "poetic"], "море веры"],
  ["12 лет рабства", "12 Years a Slave", "2013", ["drama", "historical", "dark"], "невыносимая правда"],
  ["Отрочество", "Boyhood", "2014", ["drama", "family", "quiet"], "жизнь без рывка"],
  ["Стрингер", "Nightcrawler", "2014", ["thriller", "crime", "dark"], "ночной хищник"],
  ["Бердмэн", "Birdman", "2014", ["drama", "comedy", "stylized"], "эго на сцене"],
  ["Комната", "Room", "2015", ["drama", "emotional", "intense"], "мир после стены"],
  ["В центре внимания", "Spotlight", "2015", ["drama", "social", "dialogue"], "журналистская правда"],
  ["Зверополис", "Zootopia", "2016", ["animation", "comedy", "social"], "умная анимация"],
  ["Манчестер у моря", "Manchester by the Sea", "2016", ["drama", "emotional", "quiet"], "невозможное горе"],
  ["Капитан Фантастик", "Captain Fantastic", "2016", ["drama", "family", "quirky"], "дикая семья"],
  ["Логан", "Logan", "2017", ["action", "drama", "dark"], "усталый герой"],
  ["Форма воды", "The Shape of Water", "2017", ["romance", "fantasy", "stylized"], "необычная нежность"],
  ["Три билборда", "Three Billboards Outside Ebbing, Missouri", "2017", ["drama", "crime", "dialogue"], "ярость и боль"],
  ["Зови меня своим именем", "Call Me by Your Name", "2017", ["romance", "drama", "bittersweet"], "летняя память"],
  ["Первому игроку приготовиться", "Ready Player One", "2018", ["sci-fi", "adventure", "high-energy"], "игровой побег"],
  ["Рома", "Roma", "2018", ["drama", "quiet", "poetic"], "память дома"],
  ["Фаворитка", "The Favourite", "2018", ["comedy", "drama", "dark"], "ядовитый двор"],
  ["Джокер", "Joker", "2019", ["drama", "psychological", "dark"], "городская ярость"],
  ["1917", "1917", "2019", ["war", "thriller", "visual"], "один путь"],
  ["Кролик Джоджо", "Jojo Rabbit", "2019", ["comedy", "war", "warm"], "смех против страха"],
  ["Душа", "Soul", "2020", ["animation", "emotional", "thoughtful"], "смысл момента"],
  ["Звук металла", "Sound of Metal", "2019", ["drama", "emotional", "quiet"], "тишина внутри"],
  ["Минари", "Minari", "2020", ["drama", "family", "warm"], "корни семьи"],
  ["Ещё по одной", "Another Round", "2020", ["drama", "comedy", "bittersweet"], "опасная лёгкость"],
  ["Отец", "The Father", "2020", ["drama", "psychological", "emotional"], "ломающаяся память"],
  ["CODA", "CODA", "2021", ["drama", "family", "optimistic"], "голос семьи"],
  ["Власть пса", "The Power of the Dog", "2021", ["drama", "psychological", "slow"], "тихая жестокость"],
  ["Лакричная пицца", "Licorice Pizza", "2021", ["comedy", "romance", "quirky"], "хаотичная юность"],
  ["Тар", "Tar", "2022", ["drama", "psychological", "dialogue"], "падение контроля"],
  ["Банши Инишерина", "The Banshees of Inisherin", "2022", ["drama", "comedy", "dark"], "смешная пустота"],
  ["Фабельманы", "The Fabelmans", "2022", ["drama", "family", "warm"], "семья и кино"],
  ["Убийцы цветочной луны", "Killers of the Flower Moon", "2023", ["crime", "drama", "historical"], "тихое зло"],
  ["Анатомия падения", "Anatomy of a Fall", "2023", ["drama", "mystery", "dialogue"], "суд над близостью"],
  ["Зона интересов", "The Zone of Interest", "2023", ["drama", "historical", "dark"], "обыденность ужаса"],
  ["Прошлые жизни", "Past Lives", "2023", ["romance", "drama", "quiet"], "непрожитая жизнь"],
  ["Бедные-несчастные", "Poor Things", "2023", ["comedy", "fantasy", "quirky"], "странное пробуждение"],
  ["Гражданская война", "Civil War", "2024", ["thriller", "war", "intense"], "страна на разломе"],
  ["Падение империи", "The Fall Guy", "2024", ["action", "comedy", "romance"], "трюковая лёгкость"],
  ["Претенденты", "Challengers", "2024", ["drama", "romance", "sport"], "теннисное напряжение"],
  ["Фуриоса", "Furiosa", "2024", ["action", "visual", "epic"], "пустынная ярость"],
  ["Робот по имени Чаппи", "Chappie", "2015", ["sci-fi", "action", "quirky"], "робот и улица"],
  ["Скотт Пилигрим против всех", "Scott Pilgrim vs. the World", "2010", ["comedy", "action", "stylized"], "игровая любовь"],
  ["Ведьма", "The Witch", "2015", ["horror", "historical", "slow"], "лесной страх"],
  ["Реинкарнация", "Hereditary", "2018", ["horror", "psychological", "dark"], "семейный кошмар"],
  ["Солнцестояние", "Midsommar", "2019", ["horror", "drama", "visual"], "светлый ужас"],
  ["Маяк", "The Lighthouse", "2019", ["drama", "psychological", "dark"], "морское безумие"],
  ["Аннигиляция", "Annihilation", "2018", ["sci-fi", "horror", "visual"], "зона мутации"],
  ["Луна 2112", "Moon", "2009", ["sci-fi", "quiet", "psychological"], "одинокая станция"],
  ["Патерсон", "Paterson", "2016", ["drama", "quiet", "poetic"], "будничная поэзия"],
  ["Секреты Лос-Анджелеса", "L.A. Confidential", "1997", ["crime", "noir", "mystery"], "глянцевый нуар"],
];

const surveyMovies = buildMovies(surveySeeds, 1);
const recommendationMovies = buildMovies(recommendationSeeds, 1001);

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [round, setRound] = useState(0);
  const [taste, setTaste] = useState<Record<string, number>>({});
  const [recommendations, setRecommendations] = useState<Movie[]>([]);

  const currentPair = questions[round];
  const finished = questions.length > 0 && round >= questions.length;
  const progress = questions.length ? Math.round((round / questions.length) * 100) : 0;
  const traits = useMemo(() => topTraits(taste), [taste]);

  useEffect(() => {
    setQuestions(createQuestionSet());
  }, []);

  function choose(movie: Movie) {
    const nextTaste = { ...taste };
    movie.traits.forEach((trait) => {
      nextTaste[trait] = (nextTaste[trait] ?? 0) + 1;
    });

    setTaste(nextTaste);

    if (round + 1 >= questions.length) {
      setRecommendations(pickRandomRecommendations());
    }

    setRound((current) => current + 1);
  }

  function reset() {
    setRound(0);
    setTaste({});
    setRecommendations([]);
    setQuestions(createQuestionSet());
  }

  function shuffleRecommendations() {
    setRecommendations(pickRandomRecommendations());
  }

  if (!currentPair && !finished) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f3f0e8] px-5 text-center text-[#141414]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#cf4d35]">
            Movie Taste Lab
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Собираю случайный опрос</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f0e8] text-[#141414]">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 border-b border-black/10 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#586052]">
              Movie Taste Lab
            </p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-4xl">
              Выбери фильм. Мы поймем вкус.
            </h1>
          </div>
          <div className="rounded-full bg-[#141414] px-4 py-2 text-sm font-medium text-white">
            {finished ? "Готово" : `${round + 1} / ${rounds}`}
          </div>
        </header>

        {!finished ? (
          <div className="grid flex-1 content-center gap-5 py-6">
            <div className="h-2 overflow-hidden rounded-full bg-black/10">
              <div
                className="h-full rounded-full bg-[#cf4d35] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="grid gap-1 rounded-[8px] border border-black/10 bg-white/45 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#cf4d35]">
                чистый рандом
              </p>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-xl font-semibold">Новая случайная сетка</h2>
                <p className="max-w-2xl text-sm leading-6 text-[#55554d]">
                  В каждом запуске берём 40 разных фильмов из новой базы и
                  собираем 20 пар без повторов внутри опроса.
                </p>
              </div>
            </div>

            <div className="grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-6">
              <MovieChoice movie={currentPair[0]} side="left" onChoose={choose} />
              <div className="flex items-center justify-center">
                <span className="rounded-full border border-black/15 bg-white/60 px-4 py-2 text-sm font-semibold">
                  или
                </span>
              </div>
              <MovieChoice movie={currentPair[1]} side="right" onChoose={choose} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[#4a4a42]">
              <span>Кликай по фильму, который сейчас выбрал бы быстрее.</span>
              <button
                className="rounded-full border border-black/15 px-4 py-2 font-medium transition hover:bg-white"
                onClick={reset}
                type="button"
              >
                новый случайный опрос
              </button>
            </div>
          </div>
        ) : (
          <Result
            onReset={reset}
            onShuffle={shuffleRecommendations}
            recommendations={recommendations}
            traits={traits}
          />
        )}

        <footer className="border-t border-black/10 py-4 text-xs text-[#66665d]">
          База пересобрана с нуля. Опрос и рекомендации используют разные
          списки, а недавние показы запоминаются только в браузере.
        </footer>
      </section>
    </main>
  );
}

function MovieChoice({
  movie,
  onChoose,
  side,
}: {
  movie: Movie;
  onChoose: (movie: Movie) => void;
  side: "left" | "right";
}) {
  return (
    <button
      aria-label={`Выбрать ${movie.title}`}
      className="group grid min-h-[560px] overflow-hidden rounded-[8px] bg-[#1b1b1b] text-left text-white shadow-[0_22px_70px_rgba(35,35,28,0.22)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(35,35,28,0.28)] focus:outline-none focus:ring-4 focus:ring-[#cf4d35]/35"
      onClick={() => onChoose(movie)}
      type="button"
    >
      <div className="relative min-h-[360px]">
        <img
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          src={movie.poster}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-black">
          {side === "left" ? "левый" : "правый"}
        </div>
      </div>
      <div className="grid content-between gap-5 p-5">
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="break-words text-2xl font-semibold leading-tight">
              {movie.title}
            </h2>
            <span className="text-sm text-white/65">{movie.year}</span>
          </div>
          <p className="mt-1 text-sm text-white/48">{movie.originalTitle}</p>
          <p className="mt-3 text-base leading-6 text-white/78">{movie.description}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-[#f1c36d]">{movie.mood}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {movie.traits.slice(0, 3).map((trait) => (
              <span
                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/78"
                key={trait}
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}

function Result({
  onReset,
  onShuffle,
  recommendations,
  traits,
}: {
  onReset: () => void;
  onShuffle: () => void;
  recommendations: Movie[];
  traits: string[];
}) {
  const [mainRecommendation] = recommendations;

  if (!mainRecommendation) {
    return (
      <div className="grid flex-1 place-items-center py-16 text-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#cf4d35]">
            подбираем
          </p>
          <h2 className="mt-2 text-3xl font-semibold">Собираю свежую пятёрку</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="grid flex-1 items-center gap-6 py-8 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="overflow-hidden rounded-[8px] bg-[#181818] shadow-[0_26px_90px_rgba(35,35,28,0.24)]">
        <img
          alt=""
          className="h-[620px] w-full object-cover"
          src={mainRecommendation.poster}
        />
      </div>

      <section className="grid gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#cf4d35]">
            5 новых рекомендаций
          </p>
          <h2 className="mt-2 text-4xl font-semibold leading-tight sm:text-6xl">
            {mainRecommendation.title}
          </h2>
          <p className="mt-3 text-lg text-[#4a4a42]">
            {mainRecommendation.year}
          </p>
        </div>

        <p className="max-w-2xl text-xl leading-8 text-[#25251f]">
          Вкус по выборам:{" "}
          <strong>{traits.join(", ") || "сильная история"}</strong>. Итоговая
          пятёрка берётся чистым рандомом из отдельной базы рекомендаций и не
          использует фильмы из опроса.
        </p>

        <div className="grid gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#586052]">
            полный список
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {recommendations.map((movie, index) => (
              <div
                className="grid grid-cols-[72px_1fr] gap-3 rounded-[8px] border border-black/10 bg-white/45 p-3"
                key={movie.id}
              >
                <img
                  alt=""
                  className="h-24 w-[72px] rounded-[6px] object-cover"
                  src={movie.poster}
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#cf4d35]">
                    #{index + 1}
                  </p>
                  <h3 className="mt-1 font-semibold">{movie.title}</h3>
                  <p className="mt-1 text-xs text-[#78786d]">
                    {movie.originalTitle}
                  </p>
                  <p className="mt-1 text-sm text-[#5b5b51]">{movie.mood}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-full bg-[#141414] px-6 py-3 font-semibold text-white transition hover:bg-[#cf4d35]"
            onClick={onShuffle}
            type="button"
          >
            новая случайная пятёрка
          </button>
          <button
            className="rounded-full border border-black/15 px-6 py-3 font-semibold transition hover:bg-white"
            onClick={onReset}
            type="button"
          >
            новый случайный опрос
          </button>
        </div>
      </section>
    </div>
  );
}

function buildMovies(seeds: MovieSeed[], startId: number) {
  return seeds.map(([title, originalTitle, year, traits, mood], index) => ({
    id: startId + index,
    title,
    originalTitle,
    year,
    poster: makePoster(title, originalTitle, year, traits, index),
    description: `${title} — ${describeTraits(traits)}.`,
    traits,
    mood,
  }));
}

function createQuestionSet() {
  const recentKeys = readRecent(recentQuestionKey);
  const fresh = surveyMovies.filter((movie) => !recentKeys.has(movieKey(movie)));
  const source = fresh.length >= rounds * 2 ? fresh : surveyMovies;
  const selected = shuffle(source).slice(0, rounds * 2);
  const questions: Question[] = [];

  for (let index = 0; index < rounds; index += 1) {
    questions.push([selected[index * 2], selected[index * 2 + 1]]);
  }

  remember(recentQuestionKey, selected, 100);
  return questions;
}

function pickRandomRecommendations() {
  const surveyKeys = new Set(surveyMovies.map(movieKey));
  const cleanPool = recommendationMovies.filter(
    (movie) => !surveyKeys.has(movieKey(movie)),
  );
  const recentKeys = readRecent(recentRecommendationKey);
  const fresh = cleanPool.filter((movie) => !recentKeys.has(movieKey(movie)));
  const source = fresh.length >= recommendationsCount ? fresh : cleanPool;
  const selected = shuffle(source).slice(0, recommendationsCount);

  remember(recentRecommendationKey, selected, 100);
  return selected;
}

function shuffle<T>(items: T[]) {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(randomFloat() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
}

function randomFloat() {
  if (typeof window !== "undefined" && window.crypto) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0] / 4294967296;
  }

  return Math.random();
}

function readRecent(storageKey: string) {
  if (typeof window === "undefined") {
    return new Set<string>();
  }

  try {
    return new Set<string>(JSON.parse(window.localStorage.getItem(storageKey) ?? "[]"));
  } catch {
    return new Set<string>();
  }
}

function remember(storageKey: string, movies: Movie[], limit: number) {
  if (typeof window === "undefined") {
    return;
  }

  const next = [...movies.map(movieKey), ...Array.from(readRecent(storageKey))].slice(
    0,
    limit,
  );
  window.localStorage.setItem(storageKey, JSON.stringify(next));
}

function topTraits(taste: Record<string, number>) {
  return Object.entries(taste)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([trait]) => trait);
}

function movieKey(movie: Pick<Movie, "originalTitle">) {
  return movie.originalTitle.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function describeTraits(traits: string[]) {
  const labels: Record<string, string> = {
    action: "динамичный фильм с сильным темпом",
    adventure: "приключение с ощущением пути",
    animation: "анимационная история с ярким визуальным языком",
    bittersweet: "история с тёплой, но грустной нотой",
    classic: "классика кино с узнаваемым стилем",
    comedy: "фильм с юмором и лёгкостью",
    crime: "криминальная история с напряжением",
    dark: "мрачная история с плотной атмосферой",
    dialogue: "кино, где важны разговоры и характеры",
    drama: "драма с человеческим конфликтом",
    emotional: "эмоциональная история с сильным откликом",
    epic: "масштабная история с большим размахом",
    family: "тёплая история о близких",
    fantasy: "фантазия с необычным миром",
    historical: "история на фоне реальных эпох",
    horror: "фильм с тревогой и страхом",
    mystery: "загадка, которую хочется распутать",
    noir: "мрачный стиль с тайной и моральной серостью",
    optimistic: "кино с надеждой и светлым импульсом",
    psychological: "психологическое напряжение и внутренний конфликт",
    quiet: "сдержанный фильм без лишнего шума",
    romance: "история о любви и близости",
    "sci-fi": "фантастика с идеей и визуальным миром",
    slow: "медленное кино с атмосферой",
    social: "история с социальным подтекстом",
    sport: "драма соревнования и характера",
    stylized: "стильное кино с яркой формой",
    thriller: "напряжённый фильм с риском",
    twist: "история с поворотами",
    visual: "визуально сильное кино",
    war: "военная история с высокой ставкой",
    western: "жанровый вестерн с дуэльной энергией",
  };

  return labels[traits[0]] ?? "фильм с выразительным настроением";
}

function makePoster(
  title: string,
  originalTitle: string,
  year: string,
  traits: string[],
  index: number,
) {
  const [colorA, colorB, colorC] = pickPosterPalette(traits, index);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${colorA}"/>
        <stop offset="58%" stop-color="${colorB}"/>
        <stop offset="100%" stop-color="${colorC}"/>
      </linearGradient>
    </defs>
    <rect width="500" height="750" fill="url(#bg)"/>
    <rect x="34" y="34" width="432" height="682" rx="18" fill="rgba(0,0,0,0.18)" stroke="rgba(255,255,255,0.28)" stroke-width="2"/>
    <circle cx="390" cy="128" r="58" fill="rgba(255,255,255,0.16)"/>
    <circle cx="112" cy="610" r="86" fill="rgba(255,255,255,0.10)"/>
    <text x="58" y="96" fill="rgba(255,255,255,0.72)" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" letter-spacing="4">${escapeSvg(year)}</text>
    <text x="58" y="340" textLength="384" lengthAdjust="spacingAndGlyphs" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="800">${escapeSvg(title)}</text>
    <text x="58" y="404" textLength="384" lengthAdjust="spacingAndGlyphs" fill="rgba(255,255,255,0.72)" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="600">${escapeSvg(originalTitle)}</text>
    <text x="58" y="650" fill="rgba(255,255,255,0.8)" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" letter-spacing="3">${escapeSvg(traits[0].toUpperCase())}</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function pickPosterPalette(traits: string[], index: number) {
  if (traits.includes("sci-fi")) return ["#17223b", "#2a6f97", "#f2c14e"];
  if (traits.includes("crime")) return ["#141414", "#4a1f24", "#d9a441"];
  if (traits.includes("romance")) return ["#5d2a42", "#c05a7a", "#f3d6c6"];
  if (traits.includes("comedy")) return ["#17594a", "#d39c2f", "#f3e8c8"];
  if (traits.includes("horror")) return ["#120f16", "#4c0f18", "#d8d2c4"];
  if (traits.includes("animation")) return ["#243b6b", "#2fb6a3", "#ffd166"];
  if (traits.includes("war")) return ["#263128", "#686b4f", "#d7c29a"];

  const palettes = [
    ["#1d2635", "#586052", "#cf4d35"],
    ["#25312f", "#7f4f24", "#e7c16b"],
    ["#2f2634", "#526d82", "#d4a373"],
  ];

  return palettes[index % palettes.length];
}

function escapeSvg(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
