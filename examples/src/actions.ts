import { AnyAction } from 'redux';
import {
  createBlueprint,
  createBlueprintActionTypes,
  OpsBlueprint,
  OpsBlueprintFn,
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

interface MovieFetcherOp extends OpsBlueprint {
  readonly start: OpsBlueprintFn<typeof fetchMovies>;
  readonly success: OpsBlueprintFn<typeof didFetchMovies>;
}

export const movieFetcher = createBlueprint<MovieFetcherOp>(FETCH_MOVIES, {
  start: fetchMovies,
  success: didFetchMovies,
});
