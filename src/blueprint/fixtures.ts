import { AnyAction } from 'redux';

export const movies = [
  { id: 1, name: 'The Dark Knight' },
  { id: 2, name: 'Jurassic World' },
  { id: 3, name: 'Avatar' },
];

export const FETCH_MOVIES = 'FETCH_MOVIES';

export function requestFetchMovies(genre: string, page?: number): AnyAction {
  return {
    type: FETCH_MOVIES,
    payload: { genre, page },
  };
}

export function didFetchMovies(movies: object): AnyAction {
  return {
    type: `${FETCH_MOVIES}_SUCCESS`,
    payload: { movies },
  };
}
