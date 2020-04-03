import { ReplayDialogueType, AddReplayModeType } from 'reducers/types';

export type KeywordWorkbenchProps = {
  id: number;
  setReplayDialogues: (data: Array<ReplayDialogueType>) => void;
  setKuromojiProgress: (percentage: number) => void;
  setCountFilterInput: (value: number) => void;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setSolution: (solution: string) => void;
  setPuzzleId: (puzzleId: number) => void;
  loadStorage: (id: number, init: () => Promise<any>) => void;
  saveStorage: () => void;
};

export type KeywordTreeNodeType = {
  name: string;
  children: Array<KeywordTreeNodeType>;
};

export type ResultPreviewProps = {
  keywordTree: KeywordTreeNodeType;
};

export type ChooseModeToolbarProps = {
  mode: AddReplayModeType;
  setMode: (mode: AddReplayModeType) => void;
};

export type ModeSelectPanelProps = {
  mode: AddReplayModeType;
};

export type KuromojiProgressProps = {
  progress: number;
};
