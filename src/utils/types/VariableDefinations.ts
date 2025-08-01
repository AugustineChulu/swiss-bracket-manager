import LinkerLine, { PathPropsMap, PointAnchor } from "linkerline";
import { Seed } from "../models/Seed";

export interface ChildComponentHandles {
  updateMessage: (newMessage: string) => void;
  clearSeriesScores: () => void;
}

export const bracketKeys = [
  "swissB1",
  "swissB2",
  "swissB3",
  "swissB4",
  "swissB5",
  "swissB6",
  "playoffsB1",
  "playoffsB2",
  "playoffsB3",
  "playoffsB4",
];

export const defaultSeriesScores = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

export const defaultSeriesWon = defaultSeriesScores;

const genericSeed = new Seed(0, "", "TBD", { pathID: "", url: "" }, 0);
genericSeed.seriesScores = defaultSeriesScores;
export const defaultSeed = genericSeed;

export type Series = { leftSeed: Seed | null; rightSeed: Seed | null };

export type SeriesBracketProps = {
  seriesID: number;
  subBracketTypes: string[];
  subBracketTheme: string[];
  subBracketScores: string[];
  seriesGames: Series[];
  onEditClick: (games: Series[]) => void;
};

export type editBracketEventListener = (
  games: { left_seed: string; right_seed: string }[],
  bracketName: string
) => void;

export type bracketContent = {
  subBrackets: (Series | Seed)[][];
};
export const defaultBracketContent: bracketContent = {
  subBrackets: [],
};

export type bracketEditorState = {
  bracketID: string;
  show: boolean;
  disabled: boolean;
};

export type linkerline = LinkerLine<
  PointAnchor,
  PointAnchor,
  "grid" | "straight"
>;

export const linkerLineDefaultProps = {
  endPlug: "behind",
  color: "#fff",
  pathType: "grid" as keyof PathPropsMap,
  minGridLength: 2,
  size: 3,
};

export type defaultOnClickFunc = (e: React.MouseEvent<HTMLElement>) => void;

export type tournamentEventHandlers = {
  clearBracketsHandler: defaultOnClickFunc;
  cycleViewsOnClickHandler: defaultOnClickFunc;
  processBracketDataHandler: (
    subBrackets: (Series | Seed)[][],
    nextBracketID: number
  ) => void;
  getBracketDataHandler: (key: string) => bracketContent | Seed;
  clearSeriesScoresHandler: (clearAll: boolean, bracketID: number) => void;
};

export type overviewEventHandlers = {
  deleteTournamentHandler: (id: string) => void;
};

export type avatarPath = { pathID: string; url: string };

export type manageAvatarEventHandlers = {
  selectAvatarHandler: (seedID: number, avatar: avatarPath) => void;
  removeAvatarHandler: (seedID: number) => void;
};
