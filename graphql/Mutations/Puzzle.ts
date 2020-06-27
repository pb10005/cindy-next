import gql from 'graphql-tag';

import { PUZZLE_SHARED_FRAGMENT } from '../Fragments/Puzzles';

export const ADD_PUZZLE_MUTATION = gql`
  mutation AddPuzzleMutation(
    $title: String!
    $yami: Int!
    $genre: Int!
    $content: String!
    $solution: String!
    $anonymous: Boolean!
    $grotesque: Boolean!
    $dazedOn: date!
  ) {
    insert_puzzle(
      objects: [
        {
          title: $title
          yami: $yami
          genre: $genre
          content: $content
          solution: $solution
          anonymous: $anonymous
          grotesque: $grotesque
          dazed_on: $dazedOn
        }
      ]
    ) {
      returning {
        ...PuzzleShared
        content
        solution
        memo
      }
    }
  }
  ${PUZZLE_SHARED_FRAGMENT}
`;

export const EDIT_SOLUTION_MUTATION = gql`
  mutation EditSolutionMutation($puzzleId: Int!, $solution: String!) {
    update_puzzle(
      _set: { solution: $solution }
      where: { id: { _eq: $puzzleId } }
    ) {
      returning {
        id
        solution
      }
    }
  }
`;

export const EDIT_MEMO_MUTATION = gql`
  mutation EditMemoMutation($puzzleId: Int!, $memo: String!) {
    update_puzzle(_set: { memo: $memo }, where: { id: { _eq: $puzzleId } }) {
      returning {
        id
        memo
      }
    }
  }
`;

export const UPDATE_PUZZLE_DAZED_ON_MUTATION = gql`
  mutation UpdatePuzzleDazedOnMutation($dazedOn: date, $puzzleId: Int!) {
    update_puzzle(
      _set: { dazed_on: $dazedOn }
      where: { id: { _eq: $puzzleId } }
    ) {
      returning {
        id
        dazed_on
      }
    }
  }
`;

export const UPDATE_PUZZLE_MUTATION = gql`
  mutation UpdatePuzzleMutation(
    $puzzleId: Int!
    $grotesque: Boolean
    $status: Int
    $yami: Int
  ) {
    update_puzzle(
      _set: { grotesque: $grotesque, status: $status, yami: $yami }
      where: { id: { _eq: $puzzleId } }
    ) {
      returning {
        id
        yami
        grotesque
        status
      }
    }
  }
`;
