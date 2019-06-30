import { AnyAction } from 'redux';
import { createBlueprint, OpsBlueprint, OpsBlueprintFn } from 'redux-ops';

function fetchMovies(genre: string, page?: number): AnyAction {
  return {
    type: movieFetcher.START,
    payload: { genre, page },
  };
}

function didFetchMovies(movies: object): AnyAction {
  return {
    type: movieFetcher.SUCCESS,
    payload: { movies },
  };
}

interface MovieFetcherOp extends OpsBlueprint {
  readonly start: OpsBlueprintFn<typeof fetchMovies>;
  readonly success: OpsBlueprintFn<typeof didFetchMovies>;
}

export const movieFetcher = createBlueprint<MovieFetcherOp>('FETCH_MOVIES', {
  start: fetchMovies,
  success: didFetchMovies,
});
