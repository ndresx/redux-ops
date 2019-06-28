import { AnyAction } from 'redux';
import { createBlueprint, OpBlueprint, OpBlueprintFn } from 'redux-ops';

const FETCH_MOVIES = 'FETCH_MOVIES';

function requestFetchMovies(genre: string, page?: number): AnyAction {
  return {
    type: FETCH_MOVIES,
    payload: { genre, page },
  };
}

function didFetchMovies(movies: object): AnyAction {
  return {
    type: movieFetcher.actionTypes.SUCCESS,
    payload: { movies },
  };
}

interface MovieFetcherOp extends OpBlueprint {
  readonly start: OpBlueprintFn<typeof requestFetchMovies>;
  readonly success: OpBlueprintFn<typeof didFetchMovies>;
}

export const movieFetcher = createBlueprint<MovieFetcherOp>(FETCH_MOVIES, {
  start: requestFetchMovies,
  success: didFetchMovies,
});
