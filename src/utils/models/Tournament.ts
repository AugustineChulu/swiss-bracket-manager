import {
  bracketContent,
  bracketEditorState,
  bracketKeys,
  defaultSeed,
} from "../types/VariableDefinations";
import { Seed } from "./Seed";
import {
  initiateBracketEditorStates,
  initiateEmptyBrackets,
} from "./UtilityFunctions";

export class SwissTournament {
  id: string;
  name: string;
  game: string;
  image: string;
  initSwissSeeds: Seed[];
  brackets: {
    swissB1: bracketContent;
    swissB2: bracketContent;
    swissB3: bracketContent;
    swissB4: bracketContent;
    swissB5: bracketContent;
    swissB6: bracketContent;
    playoffsB1: bracketContent;
    playoffsB2: bracketContent;
    playoffsB3: bracketContent;
    playoffsB4: bracketContent;
  };
  winningSeed: Seed;

  constructor(
    id: string,
    name: string,
    game: string,
    url: string,
    seeds: Seed[]
  ) {
    this.id = id;
    this.name = name;
    this.game = game;
    this.image = url;
    this.initSwissSeeds = seeds;

    this.brackets = {
      swissB1: initiateEmptyBrackets(bracketKeys[0]),
      swissB2: initiateEmptyBrackets(bracketKeys[1]),
      swissB3: initiateEmptyBrackets(bracketKeys[2]),
      swissB4: initiateEmptyBrackets(bracketKeys[3]),
      swissB5: initiateEmptyBrackets(bracketKeys[4]),
      swissB6: initiateEmptyBrackets(bracketKeys[5]),
      playoffsB1: initiateEmptyBrackets(bracketKeys[6]),
      playoffsB2: initiateEmptyBrackets(bracketKeys[7]),
      playoffsB3: initiateEmptyBrackets(bracketKeys[8]),
      playoffsB4: initiateEmptyBrackets(bracketKeys[9]),
    };

    this.winningSeed = defaultSeed;
  }
}

export class SwissTournamentStates {
  id: string;
  states: {
    lastPage: number;
    bracketEditorStates: bracketEditorState[];
  };

  constructor(id: string) {
    this.id = id;
    this.states = {
      lastPage: 0,
      bracketEditorStates: initiateBracketEditorStates(),
    };
  }
}

export function getTournamentStatesID(tournament: string): string{
  return `${tournament}-states`;
}
