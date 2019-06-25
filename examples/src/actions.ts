import { AnyAction } from 'redux';
import { blueprint, OpBlueprint, OpBlueprintFn } from 'redux-ops';

function requestFetchMovies(genre: string, page?: number): AnyAction {
  return {
    type: 'FETCH_MOVIES',
    payload: { genre, page },
  };
}

function didFetchMovies(movies: object): AnyAction {
  return {
    type: 'FETCH_MOVIES_SUCCESS',
    payload: { movies },
  };
}

const FETCH_MOVIES_TYPE = 'FETCH_MOVIES';

interface MovieFetcherOp extends OpBlueprint {
  readonly start: OpBlueprintFn<typeof requestFetchMovies>;
  readonly success: OpBlueprintFn<typeof didFetchMovies>;
}

function movieFetcherOp() {
  return blueprint<MovieFetcherOp>(FETCH_MOVIES_TYPE, {
    start: requestFetchMovies,
    success: didFetchMovies,
  });
}

export const movieFetcher = movieFetcherOp();
