import { AnyAction } from 'redux';
import {
  createBlueprint,
  createBlueprintActionTypes,
  OpBlueprint,
  OpBlueprintFn,
  opsUnique,
} from 'redux-ops';

const FETCH_MOVIES = 'FETCH_MOVIES';
const { SUCCESS } = createBlueprintActionTypes(FETCH_MOVIES);

function fetchMovies(genre: string, page?: number): AnyAction {
  return {
    type: FETCH_MOVIES,
    payload: { genre, page },
  };
}

function didFetchMovies(movies: object): AnyAction {
  return {
    type: SUCCESS,
    payload: { movies },
  };
}

interface MovieFetcherOp extends OpBlueprint {
  readonly start: OpBlueprintFn<typeof fetchMovies>;
  readonly success: OpBlueprintFn<typeof didFetchMovies>;
}

export const movieFetcher = opsUnique<MovieFetcherOp>(
  createBlueprint<MovieFetcherOp>(FETCH_MOVIES, {
    start: fetchMovies,
    success: didFetchMovies,
  })
);
