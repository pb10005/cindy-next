import {
  UpdatePuzzleMutation,
  UpdatePuzzleMutationVariables,
} from 'graphql/Mutations/generated/UpdatePuzzleMutation';
import { PuzzleTypeWithSolution } from '../types';
import {
  UpdatePuzzleDazedOnMutation,
  UpdatePuzzleDazedOnMutationVariables,
} from 'graphql/Mutations/generated/UpdatePuzzleDazedOnMutation';
import { MutationFunction } from '@apollo/react-common';

export enum ControlPanelPanelType {
  SOLUTION_EDIT,
  MEMO_EDIT,
  HINT_ADD,
  PUZZLE_EDIT,
}

export type ControlPanelProps = {
  puzzle: PuzzleTypeWithSolution;
};

export type SetPanelToolbarProps = {
  currentPanel: ControlPanelPanelType;
  setCurrentPanel: (panel: ControlPanelPanelType) => void;
  status: number;
};

export type SolutionEditPanelProps = {
  puzzleId: number;
  solution: string;
  status: number;
  yami: number;
};

export type MemoEditPanelProps = {
  puzzleId: number;
  memo: string;
};

export type HintAddPanelProps = {
  puzzleId: number;
  yami: number;
};

export type PuzzleEditPanelProps = {
  updatePuzzle: MutationFunction<
    UpdatePuzzleMutation,
    UpdatePuzzleMutationVariables
  >;
  updatePuzzleDazedOn: MutationFunction<
    UpdatePuzzleDazedOnMutation,
    UpdatePuzzleDazedOnMutationVariables
  >;
  puzzleId: number;
  yami: number;
  genre: number;
  grotesque: boolean;
  status: number;
  dazed_on: string;
  show?: boolean;
};

export type ParticipantSelectorProps = {
  value: number | null;
  setValue: (value: number | null) => void;
};
