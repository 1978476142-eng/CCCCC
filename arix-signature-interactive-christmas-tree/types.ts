
export interface Wish {
  text: string;
  sender: string;
  color: string;
  intensity: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  CELEBRATING = 'CELEBRATING'
}

export enum TreeMorphState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE'
}
