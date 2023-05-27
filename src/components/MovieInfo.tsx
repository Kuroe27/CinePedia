import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

interface Genre {
  id: number;
  name: string;
}
interface Cast {
  id: number;
  name: string;
  profile_path: string;
  character: string;
  known_for_department: string;
}
interface MovieProps {
  vote_average: number;
  release_date: string;
  poster_path: string;
  id: number;
  title: string;
  backdrop_path: string;
  overview: string;
  runtime: number;
  original_language: string;
  genres: Genre[];
  cast: Cast[];
}

const MovieInfo = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieProps | null>(null);
  const [movieLogo, setMovieLogo] = useState<string | null>(null);
  const [trailer, setTrailer] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState<boolean>(false);
  const [cast, setCast] = useState<Cast[]>([]);

  useEffect(() => {
    async function getMovie() {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=3fd2be6f0c70a2a598f084ddfb75487c&append_to_response=videos`
      );
      const data = await res.json();
      setMovie(data);
      setTrailer(data.videos.results[0]?.key || null);
    }

    async function getMovieLogo() {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/images?api_key=3fd2be6f0c70a2a598f084ddfb75487c`
      );
      const data = await res.json();
      setMovieLogo(data.logos[0]?.file_path || null);
    }

    getMovie();
    getMovieLogo();
  }, [id]);

  useEffect(() => {
    async function getCast() {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/credits?api_key=3fd2be6f0c70a2a598f084ddfb75487c`
      );
      const data = await res.json();
      setCast(data.cast || []);
    }
    getCast();
  }, []);
  function convertTime(time: number) {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    return `${hours}h ${minutes}m`;
  }
  if (!movie) return <div>Not Found</div>;
  console.log(cast);
  return (
    <div className="text-white texl-xl ">
      <div className="relative">
        <img
          src={"https://image.tmdb.org/t/p/w1280" + movie.backdrop_path}
          className="w-full h-[100vh] object-cover"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black to-[#00000059] "></div>

        <div className="w-full h-full details absolute top-0 flex items-center pl-10 pr-10">
          <div className="w-[50%] flex flex-col">
            <div className="w-[50%] ">
              {movieLogo && (
                <img
                  src={"https://image.tmdb.org/t/p/w1280" + movieLogo}
                  className="z-[70] x w-full h-full max-h-[15rem] bg-center mb-10  min-w-[30rem]"
                  alt=""
                />
              )}
            </div>
            <h1 className="text-white text-4xl font-medium mb-1">
              {movie.title}
            </h1>
            <p className="text-[#ffffffd0] text-lg  mb-5">
              {movie.release_date.substr(0, 4)} |{" "}
              {movie.genres.map((genre) => genre.name).join(", ")} |{" "}
              {convertTime(movie.runtime)}
            </p>

            <p className="text-[#ffffffc4] font-normal text-lg">
              {movie.overview}
            </p>

            {trailer && (
              <span className="text-white inline-block mt-5">
                <a
                  className="cursor-pointer  text-[#ffffff] bg-[#ffffff11] rounded-xl px-8 py-2   hover:bg-[#ffffff1f]"
                  onClick={() => setShowTrailer(true)}
                >
                  Watch Random Trailer
                </a>
              </span>
            )}
          </div>
          <div className="w-[60%]"></div>
        </div>
        {showTrailer && trailer && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-filter backdrop-grayscale z-50">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="mt-5 ">
                <button
                  className="text-lg text-white cursor-pointer "
                  onClick={() => setShowTrailer(false)}
                >
                  X
                </button>
                <iframe
                  width="1000"
                  height="600"
                  src={`https://www.youtube.com/embed/${trailer}`}
                  title="Trailer"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="Cast flex mt-3">
        {cast.map((casts) => (
          <div key={casts.id}>
            <div className="castContainer text-black mr-2">
              <div className="box w-36 h-44 ">
                <img
                  src={"https://image.tmdb.org/t/p/w1280" + casts.profile_path}
                  className="w-full h-full object-cover  "
                  alt=""
                />
              </div>
              <p> {casts.name}</p>
              <p>{casts.character}</p>
              <p>{casts.known_for_department}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieInfo;
