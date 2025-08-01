import { avatarPath, defaultSeriesScores, defaultSeriesWon } from "../types/VariableDefinations";

export class Seed {
  id: number;
  name: string;
  initials: string;
  avatar: avatarPath;
  seriesScores: number[];
  seriesWon: number[];
  powerRanking: number;

  constructor(
    id: number,
    name: string,
    initials: string,
    avatar: avatarPath,
    rank: number
  ) {
    this.id = id;
    this.name = name;
    this.avatar = avatar;
    this.seriesScores = defaultSeriesScores;
    this.initials = initials;
    this.powerRanking = rank;
    this.seriesWon = defaultSeriesWon;
  }
}