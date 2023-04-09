// MovieContainer.tsx
import Movie from "./Movie";

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

export interface MovieProps extends Movie {
  vote_average: number;
  release_date: string;
}

type HandleOpenModal = (movie: MovieProps) => void;

interface MovieContainerProps {
  movies: MovieProps[];
  handleOpenModal?: HandleOpenModal;
}

const MovieContainer = ({
  movies = [],
  handleOpenModal = () => {},
}: MovieContainerProps) => {
  if (movies.length === 0) {
    return <p>No movies to show</p>;
  }

  return (
    <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md p-2">
      {movies.map((movie) => (
        <Movie movie={movie} key={movie.id} handleOpenModal={handleOpenModal} />
      ))}
    </div>
  );
};

export default MovieContainer;
