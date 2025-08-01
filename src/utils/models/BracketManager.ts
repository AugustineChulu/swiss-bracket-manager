import { seedsToSeries, seriesToSeeds } from "./UtilityFunctions";
import {
  bracketContent,
  defaultBracketContent,
  defaultSeed,
  Series,
} from "../types/VariableDefinations";
import { Seed } from "./Seed";

export default class BracketManager {
  // Helper function to sort seeds by given algorithm
  private sortSeedsByAccumulatedScores(series: Series[]): Seed[] {
    const seedList: Seed[] = seriesToSeeds(series);

    return seedList.sort((a, b) => {
      const sumA = a.seriesScores.reduce((acc, score) => acc + score, 0);
      const sumB = b.seriesScores.reduce((acc, score) => acc + score, 0);

      if (sumA === sumB) {
        // If sums are equal, sort by powerRanking
        return a.powerRanking - b.powerRanking;
      }
      // Otherwise, sort by seriesScores sum (descending)
      return sumB - sumA;
    });
  }

  private sortSeedsByPowerRankingAscending(series: Series[]): Seed[] {
    const seedList: Seed[] = seriesToSeeds(series);
    // The .sort() method sorts the array in place and returns a reference to the same array.
    seedList.sort((a, b) => {
      // For ascending order, return a.powerRanking - b.powerRanking
      // If a's powerRanking is smaller, a comes first.
      return a.powerRanking - b.powerRanking;
    });

    return seedList; // Returning the modified array
  }

  // Helper function to generate series matchups
  private createSeriesMatchups(seeds: Seed[]): Series[] {
    const newSeries: Series[] = [];

    // Sort seeds by seriesScores total, then by powerRanking if scores are equal
    seeds.sort((a, b) => {
      const aScoreSum = a.seriesScores.reduce((sum, score) => sum + score, 0);
      const bScoreSum = b.seriesScores.reduce((sum, score) => sum + score, 0);
      return aScoreSum - bScoreSum || a.powerRanking - b.powerRanking;
    });

    // Create series by pairing from ends towards the middle to avoid similar score matchups
    let left = 0;
    let right = seeds.length - 1;

    while (left < right) {
      const leftSeed = seeds[left];
      const rightSeed = seeds[right];

      newSeries.push({ leftSeed, rightSeed });

      left++;
      right--;
    }

    return newSeries;
  }

  // Helper function to generate initial bracket content at each stage
  private generateInitialBracket(
    seriesArray: bracketContent,
    bracketID: number
  ): bracketContent {
    const subBracketsArray: (Series | Seed)[][] = [];

    if (bracketID == 0 || bracketID == 1) {
      const initSeries: Series[] = [];
      const initSeeds =
        bracketID === 0
          ? this.sortSeedsByPowerRankingAscending(
              seriesArray.subBrackets[0] as Series[]
            )
          : this.sortSeedsByAccumulatedScores(
              seriesArray.subBrackets[0] as Series[]
            );

      const y = initSeeds.length - 1;
      for (let x = 0; x < initSeeds.length / 2; x++) {
        initSeries.push({
          leftSeed: initSeeds[x],
          rightSeed: initSeeds[y - x],
        });
        // console.log('seed: ', sortedSeeds[x], 'scores: ', sortedSeeds[x].seriesScores)
      }

      subBracketsArray.push(initSeries);
    } else if (bracketID == 7) {
      // const sortedSeeds = this.sortSeedsByAccumulatedScores(seriesArray);
      const qualFinalSeeds = this.sortSeedsByAccumulatedScores(
        seriesArray.subBrackets[0] as Series[]
      );
      const tiebreakerSeeds = this.sortSeedsByAccumulatedScores(
        seriesArray.subBrackets[1] as Series[]
      );
      const elimFinalSeeds = this.sortSeedsByAccumulatedScores(
        seriesArray.subBrackets[2] as Series[]
      );

      let index = tiebreakerSeeds.findIndex((seed) => seed.id === 0);
      if (index > -1) {
        tiebreakerSeeds.splice(index, 1);
      }
      index = elimFinalSeeds.findIndex((seed) => seed.id === 0);
      if (index > -1) {
        elimFinalSeeds.splice(index, 1);
      }

      // console.log(qualFinalSeeds, tiebreakerSeeds, elimFinalSeeds);
      // const remainingSeeds = [...sortedSeeds];
      const qualificationFinal1: Series[] = [
        { leftSeed: defaultSeed, rightSeed: defaultSeed },
      ];
      const qualificationFinal2: Series[] = [
        { leftSeed: defaultSeed, rightSeed: defaultSeed },
      ];
      const eliminationFinal1: Series[] = [
        { leftSeed: defaultSeed, rightSeed: defaultSeed },
      ];
      const eliminationFinal2: Series[] = [
        { leftSeed: defaultSeed, rightSeed: defaultSeed },
      ];

      qualificationFinal1[0].leftSeed = qualFinalSeeds[0];
      qualificationFinal1[0].rightSeed = tiebreakerSeeds[2];

      eliminationFinal1[0].leftSeed = tiebreakerSeeds[0];
      eliminationFinal1[0].rightSeed = elimFinalSeeds[2];

      eliminationFinal2[0].leftSeed = elimFinalSeeds[0];
      eliminationFinal2[0].rightSeed = elimFinalSeeds[1];

      qualificationFinal2[0].leftSeed = qualFinalSeeds[1];
      qualificationFinal2[0].rightSeed = tiebreakerSeeds[1];

      subBracketsArray.push(
        qualificationFinal1,
        eliminationFinal1,
        eliminationFinal2,
        qualificationFinal2
      );
    }

    // console.log(subBracketsArray);
    return {
      subBrackets: subBracketsArray,
    };
  }

  generateBracket(
    currentBracketContent: bracketContent,
    nextBracketNumber: number
  ): bracketContent {
    //var for accessing the series score for the series within current bracket
    const seriesScoresIndex = nextBracketNumber - 2;
    // currentBracketContent.proceedingBracketSeeds.forEach((seed) => {
    //   console.log(
    //     `${seed.initials} scores: ${seed.seriesScores} bracket: ${seriesScoresIndex + 1}`
    //   );
    // });

    // const consoleIndex = (nextBracketNumber == 0 || nextBracketNumber == 1) ? 1 : nextBracketNumber - 1;
    // console.log(nextBracketNumber)
    // console.log(
    //   `\nbracket: ${consoleIndex}`
    // )
    // currentBracketContent.subBrackets.forEach(
    //   (subBracket, index) => {
    //     if (consoleIndex === 4) {
    //       if (index === 1 || index === 2) {
    //         // console.log(subBracket);
    //         subBracket.forEach((series) =>{
    //           console.log(`${(series as Series).leftSeed?.initials} | ${(series as Series).leftSeed?.seriesScores[seriesScoresIndex]} : ${(series as Series).rightSeed?.seriesScores[seriesScoresIndex]} | ${(series as Series).rightSeed?.initials}`);
    //         })
    //       }
    //     } else if (consoleIndex === 5) {
    //       if (index === 1) {
    //       subBracket.forEach((series) =>{
    //           console.log(`${(series as Series).leftSeed?.initials} | ${(series as Series).leftSeed?.seriesScores[consoleIndex -1]} : ${(series as Series).rightSeed?.seriesScores[consoleIndex -1]} | ${(series as Series).rightSeed?.initials}`);
    //         })
    //       }
    //     } else if (
    //       consoleIndex != 6
    //     ) {
    //       subBracket.forEach((series) =>{
    //           console.log(`${(series as Series).leftSeed?.initials} | ${(series as Series).leftSeed?.seriesScores[consoleIndex -1]} : ${(series as Series).rightSeed?.seriesScores[consoleIndex -1]} | ${(series as Series).rightSeed?.initials}`);
    //         })
    //     }
    //   }
    // );console.log('\n');

    switch (nextBracketNumber) {
      case 0:
      case 1: {
        return this.generateInitialBracket(
          currentBracketContent,
          nextBracketNumber
        );
      }
      case 2: {
        // Arrays to hold the new series for winners and losers
        let winnerSeries: Series[] = [];
        let loserSeries: Series[] = [];

        // Array to collect winners and losers for matching
        const winners: Seed[] = [];
        const losers: Seed[] = [];

        // Step 1: Determine winners and losers of each series
        currentBracketContent.subBrackets.forEach((subBracket) => {
          subBracket.forEach((series) => {
            const leftSeed = (series as Series).leftSeed;
            const rightSeed = (series as Series).rightSeed;

            if (leftSeed != null && rightSeed != null) {
              // Extract games won by each seed for this series in the current bracket
              const leftSeriesScore = leftSeed.seriesScores[seriesScoresIndex];
              const rightSeriesScore =
                rightSeed.seriesScores[seriesScoresIndex];

              // console.log(`${leftSeed.initials} | ${leftSeriesScore} : ${rightSeriesScore} | ${rightSeed.initials} => bracket: ${seriesScoresIndex + 1}`);

              if (leftSeriesScore >= rightSeriesScore) {
                winners.push(leftSeed);
                losers.push(rightSeed);
                leftSeed.seriesWon[seriesScoresIndex] = 1;
                rightSeed.seriesWon[seriesScoresIndex] = 0;
              } else {
                winners.push(rightSeed);
                losers.push(leftSeed);
                leftSeed.seriesWon[seriesScoresIndex] = 0;
                rightSeed.seriesWon[seriesScoresIndex] = 1;
              }
            }
          });
        });

        // Step 2: Generate series for winners and losers using the helper function
        winnerSeries = this.createSeriesMatchups(winners);
        loserSeries = this.createSeriesMatchups(losers);

        return {
          subBrackets: [winnerSeries, loserSeries],
        };
      }
      case 3: {
        // Arrays to hold the new series for winners and losers
        let winnerSeries: Series[] = [];
        let intermediateSeries: Series[] = [];
        let loserSeries: Series[] = [];

        // Array to collect winners and losers for matching
        const winners: Seed[] = [];
        const intermediate: Seed[] = [];
        const losers: Seed[] = [];

        // Step 1: Determine winners and losers of each series
        currentBracketContent.subBrackets.forEach((subBracket, index) => {
          subBracket.forEach((series) => {
            const leftSeed = (series as Series).leftSeed;
            const rightSeed = (series as Series).rightSeed;

            if (leftSeed != null && rightSeed != null) {
              // Extract games won by each seed for this series in the current bracket
              const leftSeriesScore = leftSeed.seriesScores[seriesScoresIndex];
              const rightSeriesScore =
                rightSeed.seriesScores[seriesScoresIndex];

              if (index === 0) {
                if (leftSeriesScore >= rightSeriesScore) {
                  winners.push(leftSeed);
                  intermediate.push(rightSeed);
                  leftSeed.seriesWon[seriesScoresIndex] = 1;
                  rightSeed.seriesWon[seriesScoresIndex] = 0;
                } else {
                  winners.push(rightSeed);
                  intermediate.push(leftSeed);
                  leftSeed.seriesWon[seriesScoresIndex] = 0;
                  rightSeed.seriesWon[seriesScoresIndex] = 1;
                }
              } else if (index === 1) {
                if (leftSeriesScore >= rightSeriesScore) {
                  intermediate.push(leftSeed);
                  losers.push(rightSeed);
                  leftSeed.seriesWon[seriesScoresIndex] = 1;
                  rightSeed.seriesWon[seriesScoresIndex] = 0;
                } else {
                  intermediate.push(rightSeed);
                  losers.push(leftSeed);
                  leftSeed.seriesWon[seriesScoresIndex] = 0;
                  rightSeed.seriesWon[seriesScoresIndex] = 1;
                }
              }
            }
          });
        });

        // Step 2: Generate series for winners and losers using the helper function
        winnerSeries = this.createSeriesMatchups(winners);
        intermediateSeries = this.createSeriesMatchups(intermediate);
        loserSeries = this.createSeriesMatchups(losers);

        return {
          subBrackets: [winnerSeries, intermediateSeries, loserSeries],
        };
      }
      case 4: {
        // let sortedSeeds: Seed[] = [];
        // currentBracketContent.subBrackets.forEach((subBracket) =>{
        //   sortedSeeds = [...this.sortSeedsByAccumulatedScores(subBracket as Series[])];
        // })

        // Arrays to hold the new series for winners and losers
        let intermediateSeries1: Series[] = [];
        let intermediateSeries2: Series[] = [];

        // Array to collect winners and losers for matching
        const qualifiedSeeds: Seed[] = [];
        const intermediate1: Seed[] = [];
        const intermediate2: Seed[] = [];
        const eliminatedSeeds: Seed[] = [];

        // Step 1: Determine winners and losers of each series
        currentBracketContent.subBrackets.forEach((subBracket, index) => {
          subBracket.forEach((series) => {
            const leftSeed = (series as Series).leftSeed;
            const rightSeed = (series as Series).rightSeed;

            if (leftSeed != null && rightSeed != null) {
              // Extract games won by each seed for this series in the current bracket
              const leftSeriesScore = leftSeed.seriesScores[seriesScoresIndex];
              const rightSeriesScore =
                rightSeed.seriesScores[seriesScoresIndex];

              if (index === 0) {
                if (leftSeriesScore >= rightSeriesScore) {
                  qualifiedSeeds.push(leftSeed);
                  intermediate1.push(rightSeed);
                  leftSeed.seriesWon[seriesScoresIndex] = 1;
                  rightSeed.seriesWon[seriesScoresIndex] = 0;
                } else {
                  qualifiedSeeds.push(rightSeed);
                  intermediate1.push(leftSeed);
                  leftSeed.seriesWon[seriesScoresIndex] = 0;
                  rightSeed.seriesWon[seriesScoresIndex] = 1;
                }
              } else if (index === 1) {
                if (leftSeriesScore >= rightSeriesScore) {
                  intermediate1.push(leftSeed);
                  intermediate2.push(rightSeed);
                  leftSeed.seriesWon[seriesScoresIndex] = 1;
                  rightSeed.seriesWon[seriesScoresIndex] = 0;
                } else {
                  intermediate1.push(rightSeed);
                  intermediate2.push(leftSeed);
                  leftSeed.seriesWon[seriesScoresIndex] = 0;
                  rightSeed.seriesWon[seriesScoresIndex] = 1;
                }
              } else if (index === 2) {
                if (leftSeriesScore >= rightSeriesScore) {
                  intermediate2.push(leftSeed);
                  eliminatedSeeds.push(rightSeed);
                  leftSeed.seriesWon[seriesScoresIndex] = 1;
                  rightSeed.seriesWon[seriesScoresIndex] = 0;
                } else {
                  intermediate2.push(rightSeed);
                  eliminatedSeeds.push(leftSeed);
                  leftSeed.seriesWon[seriesScoresIndex] = 0;
                  rightSeed.seriesWon[seriesScoresIndex] = 1;
                }
              }
            }
          });
        });

        // Step 2: Generate series for winners and losers using the helper function
        intermediateSeries1 = this.createSeriesMatchups(intermediate1);
        intermediateSeries2 = this.createSeriesMatchups(intermediate2);

        return {
          subBrackets: [
            qualifiedSeeds,
            intermediateSeries1,
            intermediateSeries2,
            eliminatedSeeds,
          ],
        };
      }
      case 5: {
        // let sortedSeeds: Seed[] = [];
        // currentBracketContent.subBrackets.forEach((subBracket, index) => {
        //   if (index === 1 || index === 2) {
        //     sortedSeeds = [...this.sortSeedsByAccumulatedScores(subBracket as Series[])];
        //   }
        // });
        // Arrays to hold the new series for winners and losers
        let intermediateSeries: Series[] = [];

        // Array to collect winners and losers for matching
        const tiebreakerSeeds: Seed[] = [];
        const intermediateSeeds: Seed[] = [];
        const eliminatedSeeds: Seed[] = [];

        // Step 1: Determine winners and losers of each series
        currentBracketContent.subBrackets.forEach((subBracket, index) => {
          if (index === 1 || index === 2) {
            subBracket.forEach((series) => {
              const leftSeed = (series as Series).leftSeed;
              const rightSeed = (series as Series).rightSeed;

              if (leftSeed != null && rightSeed != null) {
                // Extract games won by each seed for this series in the current bracket
                const leftSeriesScore =
                  leftSeed.seriesScores[seriesScoresIndex];
                const rightSeriesScore =
                  rightSeed.seriesScores[seriesScoresIndex];

                if (index === 1) {
                  if (leftSeriesScore >= rightSeriesScore) {
                    tiebreakerSeeds.push(leftSeed);
                    intermediateSeeds.push(rightSeed);
                    leftSeed.seriesWon[seriesScoresIndex] = 1;
                    rightSeed.seriesWon[seriesScoresIndex] = 0;
                  } else {
                    tiebreakerSeeds.push(rightSeed);
                    intermediateSeeds.push(leftSeed);
                    leftSeed.seriesWon[seriesScoresIndex] = 0;
                    rightSeed.seriesWon[seriesScoresIndex] = 1;
                  }
                } else if (index === 2) {
                  if (leftSeriesScore >= rightSeriesScore) {
                    intermediateSeeds.push(leftSeed);
                    eliminatedSeeds.push(rightSeed);
                    leftSeed.seriesWon[seriesScoresIndex] = 1;
                    rightSeed.seriesWon[seriesScoresIndex] = 0;
                  } else {
                    intermediateSeeds.push(rightSeed);
                    eliminatedSeeds.push(leftSeed);
                    leftSeed.seriesWon[seriesScoresIndex] = 0;
                    rightSeed.seriesWon[seriesScoresIndex] = 1;
                  }
                }
              }
            });
          }
        });

        // Step 2: Generate series for winners and losers using the helper function
        intermediateSeries = this.createSeriesMatchups(intermediateSeeds);

        return {
          subBrackets: [tiebreakerSeeds, intermediateSeries, eliminatedSeeds],
        };
      }
      case 6: {
        // Array to collect winners and losers for matching
        const qualifiedSeeds: Seed[] = [];
        const eliminatedSeeds: Seed[] = [];

        // Step 1: Determine winners and losers of each series
        currentBracketContent.subBrackets.forEach((subBracket, index) => {
          if (index === 1) {
            subBracket.forEach((series) => {
              const leftSeed = (series as Series).leftSeed;
              const rightSeed = (series as Series).rightSeed;

              if (leftSeed != null && rightSeed != null) {
                // Extract games won by each seed for this series in the current bracket
                const leftSeriesScore =
                  leftSeed.seriesScores[seriesScoresIndex];
                const rightSeriesScore =
                  rightSeed.seriesScores[seriesScoresIndex];

                if (index === 1) {
                  if (leftSeriesScore >= rightSeriesScore) {
                    qualifiedSeeds.push(leftSeed);
                    eliminatedSeeds.push(rightSeed);
                    leftSeed.seriesWon[seriesScoresIndex] = 1;
                    rightSeed.seriesWon[seriesScoresIndex] = 0;
                  } else {
                    qualifiedSeeds.push(rightSeed);
                    eliminatedSeeds.push(leftSeed);
                    leftSeed.seriesWon[seriesScoresIndex] = 0;
                    rightSeed.seriesWon[seriesScoresIndex] = 1;
                  }
                }
              }
            });
          }
        });

        return {
          subBrackets: [qualifiedSeeds, eliminatedSeeds],
        };
      }
      case 7: {
        return this.generateInitialBracket(
          currentBracketContent,
          nextBracketNumber
        );
      }
      case 8: {
        const semiFinal1: Series[] = [
          { leftSeed: defaultSeed, rightSeed: defaultSeed },
        ];
        const semiFinal2: Series[] = [
          { leftSeed: defaultSeed, rightSeed: defaultSeed },
        ];

        // const semiFinal1Seeds: Seed[] = [];
        // const semiFinal2Seeds: Seed[] = [];
        const prelimFinal1Seeds: Seed[] = [];
        const prelimFinal2Seeds: Seed[] = [];
        const eliminatedSeeds: Seed[] = [];

        // Step 1: Determine winners and losers of each series
        currentBracketContent.subBrackets.forEach((subBracket, index) => {
          subBracket.forEach((series) => {
            const leftSeed = (series as Series).leftSeed;
            const rightSeed = (series as Series).rightSeed;

            if (leftSeed != null && rightSeed != null) {
              // Extract games won by each seed for this series in the current bracket
              const leftSeriesScore = leftSeed.seriesScores[seriesScoresIndex];
              const rightSeriesScore =
                rightSeed.seriesScores[seriesScoresIndex];

              // console.log(`${leftSeed.initials} | ${leftSeriesScore} : ${rightSeriesScore} | ${rightSeed.initials} => bracket: ${seriesScoresIndex + 1}`);

              if (index === 0) {
                if (leftSeriesScore >= rightSeriesScore) {
                  prelimFinal1Seeds.push(leftSeed);
                  semiFinal1[0].leftSeed = rightSeed;
                  // semiFinal1Seeds.push(rightSeed);
                  leftSeed.seriesWon[seriesScoresIndex] = 1;
                  rightSeed.seriesWon[seriesScoresIndex] = 0;
                } else {
                  prelimFinal1Seeds.push(rightSeed);
                  semiFinal1[0].leftSeed = leftSeed;
                  // semiFinal1Seeds.push(leftSeed);
                  leftSeed.seriesWon[seriesScoresIndex] = 0;
                  rightSeed.seriesWon[seriesScoresIndex] = 1;
                }
              } else if (index === 1) {
                if (leftSeriesScore >= rightSeriesScore) {
                  semiFinal1[0].rightSeed = leftSeed;
                  // semiFinal1Seeds.push(leftSeed);
                  eliminatedSeeds.push(rightSeed);
                  leftSeed.seriesWon[seriesScoresIndex] = 1;
                  rightSeed.seriesWon[seriesScoresIndex] = 0;
                } else {
                  semiFinal1[0].rightSeed = rightSeed;
                  // semiFinal1Seeds.push(rightSeed);
                  eliminatedSeeds.push(leftSeed);
                  leftSeed.seriesWon[seriesScoresIndex] = 0;
                  rightSeed.seriesWon[seriesScoresIndex] = 1;
                }
              } else if (index === 2) {
                if (leftSeriesScore >= rightSeriesScore) {
                  semiFinal2[0].leftSeed = leftSeed;
                  // semiFinal2Seeds.push(leftSeed);
                  eliminatedSeeds.push(rightSeed);
                  leftSeed.seriesWon[seriesScoresIndex] = 1;
                  rightSeed.seriesWon[seriesScoresIndex] = 0;
                } else {
                  semiFinal2[0].leftSeed = rightSeed;
                  // semiFinal2Seeds.push(rightSeed);
                  eliminatedSeeds.push(leftSeed);
                  leftSeed.seriesWon[seriesScoresIndex] = 0;
                  rightSeed.seriesWon[seriesScoresIndex] = 1;
                }
              } else if (index === 3) {
                if (leftSeriesScore >= rightSeriesScore) {
                  prelimFinal2Seeds.push(leftSeed);
                  semiFinal2[0].rightSeed = rightSeed;
                  // semiFinal2Seeds.push(rightSeed);
                  leftSeed.seriesWon[seriesScoresIndex] = 1;
                  rightSeed.seriesWon[seriesScoresIndex] = 0;
                } else {
                  prelimFinal2Seeds.push(rightSeed);
                  semiFinal2[0].rightSeed = leftSeed;
                  // semiFinal2Seeds.push(leftSeed);
                  leftSeed.seriesWon[seriesScoresIndex] = 0;
                  rightSeed.seriesWon[seriesScoresIndex] = 1;
                }
              }
            }
          });
        });

        const elimPairSeries = seedsToSeries(eliminatedSeeds);
        const prelimPairSeries = seedsToSeries([
          prelimFinal1Seeds[0],
          prelimFinal2Seeds[0],
        ]);

        // semiFinal1 = this.createSeriesMatchups(semiFinal1Seeds);
        // semiFinal2 = this.createSeriesMatchups(semiFinal2Seeds);

        return {
          subBrackets: [
            semiFinal1,
            semiFinal2,
            elimPairSeries,
            prelimPairSeries,
          ],
        };
      }
      case 9: {
        // let sortedSeeds: Seed[] = [];
        // currentBracketContent.subBrackets.forEach((subBracket) => {
        //   sortedSeeds = [...this.sortSeedsByAccumulatedScores(subBracket as Series[])];
        // });
        const semiFinal1: Series[] = [
          {
            leftSeed: defaultSeed,
            rightSeed: defaultSeed,
          },
        ];

        const semiFinal2: Series[] = [
          {
            leftSeed: defaultSeed,
            rightSeed: defaultSeed,
          },
        ];
        const eliminatedSeeds: Seed[] = [];

        // Step 1: Determine winners and losers of each series
        currentBracketContent.subBrackets.forEach((subBracket, index) => {
          subBracket.forEach((series) => {
            const leftSeed = (series as Series).leftSeed;
            const rightSeed = (series as Series).rightSeed;

            if (leftSeed != null && rightSeed != null) {
              // Extract games won by each seed for this series in the current bracket
              const leftSeriesScore = leftSeed.seriesScores[seriesScoresIndex];
              const rightSeriesScore =
                rightSeed.seriesScores[seriesScoresIndex];

              if (index === 0) {
                semiFinal1[0].leftSeed = leftSeed;
              } else if (index === 1) {
                semiFinal2[0].rightSeed = rightSeed;
              } else if (index === 2) {
                if (leftSeriesScore >= rightSeriesScore) {
                  semiFinal2[0].leftSeed = leftSeed;
                  eliminatedSeeds.push(rightSeed);
                  leftSeed.seriesWon[seriesScoresIndex] = 1;
                  rightSeed.seriesWon[seriesScoresIndex] = 0;
                } else {
                  semiFinal2[0].leftSeed = rightSeed;
                  eliminatedSeeds.push(leftSeed);
                  leftSeed.seriesWon[seriesScoresIndex] = 0;
                  rightSeed.seriesWon[seriesScoresIndex] = 1;
                }
              } else if (index === 3) {
                if (leftSeriesScore >= rightSeriesScore) {
                  semiFinal1[0].rightSeed = leftSeed;
                  eliminatedSeeds.push(rightSeed);
                  leftSeed.seriesWon[seriesScoresIndex] = 1;
                  rightSeed.seriesWon[seriesScoresIndex] = 0;
                } else {
                  semiFinal1[0].rightSeed = rightSeed;
                  eliminatedSeeds.push(leftSeed);
                  leftSeed.seriesWon[seriesScoresIndex] = 0;
                  rightSeed.seriesWon[seriesScoresIndex] = 1;
                }
              }
            }
          });
        });

        const elimPairSeries = seedsToSeries(eliminatedSeeds);

        return {
          subBrackets: [semiFinal1, semiFinal2, elimPairSeries],
        };
      }
      case 10: {
        const grandFinalSeeds: Seed[] = [];
        const eliminatedSeeds: Seed[] = [];

        // Step 1: Determine winners and losers of each series
        currentBracketContent.subBrackets.forEach((subBracket, index) => {
          subBracket.forEach((series) => {
            const leftSeed = (series as Series).leftSeed;
            const rightSeed = (series as Series).rightSeed;

            if (leftSeed != null && rightSeed != null) {
              // Extract games won by each seed for this series in the current bracket
              const leftSeriesScore = leftSeed.seriesScores[seriesScoresIndex];
              const rightSeriesScore =
                rightSeed.seriesScores[seriesScoresIndex];

              if (index === 0) {
                if (leftSeriesScore >= rightSeriesScore) {
                  grandFinalSeeds.push(leftSeed);
                  eliminatedSeeds.push(rightSeed);
                  leftSeed.seriesWon[seriesScoresIndex] = 1;
                  rightSeed.seriesWon[seriesScoresIndex] = 0;
                } else {
                  grandFinalSeeds.push(rightSeed);
                  eliminatedSeeds.push(leftSeed);
                  leftSeed.seriesWon[seriesScoresIndex] = 0;
                  rightSeed.seriesWon[seriesScoresIndex] = 1;
                }
              } else if (index === 1) {
                if (leftSeriesScore >= rightSeriesScore) {
                  grandFinalSeeds.push(leftSeed);
                  eliminatedSeeds.push(rightSeed);
                  leftSeed.seriesWon[seriesScoresIndex] = 1;
                  rightSeed.seriesWon[seriesScoresIndex] = 0;
                } else {
                  grandFinalSeeds.push(rightSeed);
                  eliminatedSeeds.push(leftSeed);
                  leftSeed.seriesWon[seriesScoresIndex] = 0;
                  rightSeed.seriesWon[seriesScoresIndex] = 1;
                }
              }
            }
          });
        });

        const elimPairSeries = seedsToSeries(eliminatedSeeds);

        const grandFinal: Series[] = [
          {
            leftSeed: grandFinalSeeds[0],
            rightSeed: grandFinalSeeds[1],
          },
        ];

        return {
          subBrackets: [grandFinal, elimPairSeries],
        };
      }
      case 11: {
        let winningSeed: Seed = defaultSeed;
        let losingSeed: Seed = defaultSeed;

        // Step 1: Determine winners and losers of each series
        currentBracketContent.subBrackets.forEach((subBracket, index) => {
          subBracket.forEach((series) => {
            const leftSeed = (series as Series).leftSeed;
            const rightSeed = (series as Series).rightSeed;

            if (leftSeed != null && rightSeed != null) {
              // Extract games won by each seed for this series in the current bracket
              const leftSeriesScore = leftSeed.seriesScores[seriesScoresIndex];
              const rightSeriesScore =
                rightSeed.seriesScores[seriesScoresIndex];

              if (index === 0) {
                if (leftSeriesScore >= rightSeriesScore) {
                  winningSeed = leftSeed;
                  losingSeed = rightSeed;
                  leftSeed.seriesWon[seriesScoresIndex] = 1;
                  rightSeed.seriesWon[seriesScoresIndex] = 0;
                } else {
                  winningSeed = rightSeed;
                  losingSeed = leftSeed;
                  leftSeed.seriesWon[seriesScoresIndex] = 0;
                  rightSeed.seriesWon[seriesScoresIndex] = 1;
                }
              }
            }
          });
        });

        const grandFinalWinner: Series[] = [
          {
            leftSeed: winningSeed,
            rightSeed: losingSeed,
          },
        ];

        return {
          subBrackets: [grandFinalWinner],
        };
      }
      default: {
        console.log(
          "could not generate content for bracket number: ",
          nextBracketNumber
        );
        return defaultBracketContent;
      }
    }
  }
}
