import gql from 'graphql-tag';

import { PUZZLE_SHARED_FRAGMENT } from '../Fragments/Puzzles';
import { DIALOGUE_SHARED_FRAGMENT } from '../Fragments/Dialogue';

export const PUZZLE_QUERY = gql`
  query PuzzleQuery($id: Int!) {
    sui_hei_puzzle_by_pk(id: $id) {
      ...PuzzleShared
      content
      solution
      memo
    }
  }
  ${PUZZLE_SHARED_FRAGMENT}
`;

export const PUZZLE_DIALOGUE_QUERY = gql`
  query PuzzleDialogueQuery($id: Int!) {
    sui_hei_dialogue(
      where: { sui_hei_puzzle: { id: { _eq: $id } } }
      order_by: { id: desc }
    ) {
      ...DialogueShared
    }
  }
  ${DIALOGUE_SHARED_FRAGMENT}
`;

export const PUZZLES_UNSOLVED_QUERY = gql`
  query PuzzlesUnsolvedQuery {
    sui_hei_puzzle(
      order_by: { modified: desc }
      where: { status: { _eq: 0 } }
    ) {
      ...PuzzleShared
      sui_hei_dialogues_aggregate {
        aggregate {
          count
          max {
            answeredtime
          }
        }
      }
    }
  }
  ${PUZZLE_SHARED_FRAGMENT}
`;

export const PUZZLE_SOLVED_QUERY = gql`
  query PuzzlesSolvedQuery($limit: Int, $offset: Int) {
    sui_hei_puzzle(
      order_by: { modified: desc }
      where: { status: { _neq: 0 } }
      limit: $limit
      offset: $offset
    ) @connection(key: "sui_hei_puzzle", filter: ["order_by", "where"]) {
      ...PuzzleShared
      sui_hei_stars_aggregate {
        aggregate {
          count
          sum {
            value
          }
        }
      }
      sui_hei_comments_aggregate {
        aggregate {
          count
        }
      }
      sui_hei_bookmarks_aggregate {
        aggregate {
          count
        }
      }
      sui_hei_dialogues_aggregate {
        aggregate {
          count
        }
      }
    }
  }
  ${PUZZLE_SHARED_FRAGMENT}
`;
