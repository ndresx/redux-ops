import { AnyAction } from 'redux';
import { OpBlueprint, OpBlueprintFn } from './typedefs';

export interface MovieFetcherOp extends OpBlueprint {
  readonly start: OpBlueprintFn<typeof fetchMovies>;
  readonly success: OpBlueprintFn<typeof didFetchMovies>;
}

export const movies = [
  { id: 1, name: 'The Dark Knight' },
  { id: 2, name: 'Jurassic World' },
  { id: 3, name: 'Avatar' },
];

export const FETCH_MOVIES = 'FETCH_MOVIES';

export function fetchMovies(genre: string, page?: number): AnyAction {
  return {
    type: FETCH_MOVIES,
    payload: { genre, page },
  };
}

export function didFetchMovies(movies: object): AnyAction {
  return {
    type: `${FETCH_MOVIES}_SUCCESS_CUSTOM`,
    payload: { movies },
  };
}
