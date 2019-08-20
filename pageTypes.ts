import { IntlShape } from 'react-intl';
import { QueryResult } from 'react-apollo';
import { ApolloError } from 'apollo-client';
import * as globalReducer from 'reducers/global';

import {
  PuzzlesSolvedQuery,
  PuzzlesSolvedQueryVariables,
} from 'graphql/Queries/generated/PuzzlesSolvedQuery';
import { PuzzlesUnsolvedLiveQuery } from 'graphql/LiveQueries/generated/PuzzlesUnsolvedLiveQuery';
import {
  sui_hei_puzzle_order_by,
  sui_hei_tag_order_by,
} from 'generated/globalTypes';

export type UserPageProps = {
  userId: number;
};

export type PuzzlesSolvedRendererProps = QueryResult<
  PuzzlesSolvedQuery,
  PuzzlesSolvedQueryVariables
>;

export type PuzzlesUnsolvedRendererProps = {
  loading: boolean;
  data?: PuzzlesUnsolvedLiveQuery | undefined;
  error?: ApolloError | undefined;
};

export type SearchVariablesStates = {
  title: null | string;
  content: null | string;
  solution: null | string;
  userNickname: null | string;
  genre: null | number;
  yami: null | number;
  orderBy: Array<sui_hei_puzzle_order_by>;
};

export type RankingProps = {};
export type RankingContext = {
  intl: IntlShape;
};

export type PuzzleProps = {
  puzzleId: number;
};

export type AddReplayProps = {
  puzzleId: number;
};

export type EULAProps = {
  language: typeof globalReducer.initialState.language;
};

export type TagsVariablesStates = {
  name: null | string;
  orderBy: Array<sui_hei_tag_order_by>;
};
