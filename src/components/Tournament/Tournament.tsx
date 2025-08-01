import "./Tournament.css";
import Playoffs from "./Playoffs/Playoffs";
import SwissStage1 from "./SwissTage1/SwissStage1";
// import BracketManager from "../../utils/models/BracketManager";
import {
  bracketContent,
  defaultBracketContent,
  defaultSeed,
  bracketKeys,
  defaultSeriesScores,
  ChildComponentHandles,
  Series,
} from "../../utils/types/VariableDefinations";
import { useEffect, useRef, useState } from "react";
import {
  cycleViews,
  getInputValue,
  initiateBracketEditorStates,
  initiateEmptyBrackets,
  seedsToSeries,
  seriesToSeeds,
  // seriesToSeeds,
} from "../../utils/models/UtilityFunctions";
import TopbarMenu from "./TopBarMenu/TopBarMenu";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import WinnersDisplay from "./WinnersDisplay/WinnersDisplay";
import { Seed } from "@/utils/models/Seed";
import {
  getTournamentStatesID,
  SwissTournament,
  SwissTournamentStates,
} from "@/utils/models/Tournament";
import BracketManager from "@/utils/models/BracketManager";
import { useAppContext } from "@/AppContext";
import confetti from "canvas-confetti";

const bracketManager = new BracketManager();

export default function Tournament() {
  const navigate = useNavigate();
  const {
    tournaments,
    setTournaments,
    tournamentsStates,
    setTournamentsStates,
  } = useAppContext();
  const params = useParams<{ tournamentID: string }>();
  const activeTournament = tournaments.find((tournament) => {
    return tournament.id === params.tournamentID;
  });

  let activeTournamentState: SwissTournamentStates | undefined;
  if (activeTournament) {
    activeTournamentState = tournamentsStates.find((tournamentState) => {
      return tournamentState.id === getTournamentStatesID(activeTournament.id);
    });
  }

  const childRef = useRef<ChildComponentHandles>(null);
  const [isWindowFocused, setIsWindowFocused] = useState<boolean>(true);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleBlur = () => {
      // console.log("Window lost focus!");
      setIsWindowFocused(false);
    };

    const handleFocus = () => {
      // console.log("Window gained focus!");
      setIsWindowFocused(true);
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    const goldColors = [
      "#FFD700", // Gold
      "#DAA520", // Goldenrod
      "#B8860B", // DarkGoldenrod
      "#FFBF00", // A lighter gold
      "#CCCC00", // Olive Gold
    ];

    const defaults = {
      origin: { y: 0 },
      particleCount: 8,
      spread: 180,
      startVelocity: 20,
      ticks: 550,
      gravity: 0.7,
      decay: 0.9,
      scalar: 2.5,
      colors: goldColors,
    };

    const createRainBurst = (x: number) => {
      confetti({
        ...defaults,
        shapes: ["square"],
        origin: { x: x, y: -0.2 },
        angle: 90 + (Math.random() * 20 - 10),
      });
    };

    // --- Interval Logic ---
    // This logic will run whenever its dependencies change, creating a fresh interval.
    const shouldConfettiBeActive =
      activeTournament?.winningSeed.id !== 0 &&
      activeTournamentState?.states.lastPage === 2 &&
      isWindowFocused;

    if (shouldConfettiBeActive) {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }

      // console.log("Starting interval. isWindowFocused:", isWindowFocused);
      intervalIdRef.current = setInterval(() => {
        // console.log("Interval running. isWindowFocused:", isWindowFocused);
        createRainBurst(0.2);
        createRainBurst(0.5);
        createRainBurst(0.8);
      }, 2850);
    } else {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
        // console.log("Confetti interval stopped due to conditions not met");
      }
    }

    return () => {
      // console.log(
      //   "Cleaning up: Removing event listeners and clearing interval."
      // );
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);

      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [
    activeTournament?.winningSeed.id,
    activeTournamentState?.states.lastPage,
    isWindowFocused,
  ]);

  let currentBracketData: bracketContent = defaultBracketContent;

  const setPrelimFinal = (
    qualFinal: Series,
    semiFinal: Series,
    finalID: "final1" | "final2"
  ): Series => {
    const prelimSeries: Series = {
      leftSeed: defaultSeed,
      rightSeed: defaultSeed,
    };

    // Get IDs from semiFinal for quick lookup
    const semiFinalSeedIds = new Set<number>();
    semiFinalSeedIds.add((semiFinal.leftSeed as Seed).id);
    semiFinalSeedIds.add((semiFinal.rightSeed as Seed).id);

    let nonAdvancingSeed: Seed | null = null;

    // Check which seed from qualFinal is NOT in semiFinal
    if (!semiFinalSeedIds.has((qualFinal.leftSeed as Seed).id)) {
      nonAdvancingSeed = qualFinal.leftSeed;
    } else if (!semiFinalSeedIds.has((qualFinal.rightSeed as Seed).id)) {
      nonAdvancingSeed = qualFinal.rightSeed;
    }

    if (finalID === "final1") {
      prelimSeries.leftSeed = nonAdvancingSeed;
    } else if (finalID === "final2") {
      prelimSeries.rightSeed = nonAdvancingSeed;
    }

    return prelimSeries;
  };

  const updateTournamentsArray = (
    updateSrc: "brackets" | "view",
    srcArguments: {
      bracketID: number;
      generatedContent: bracketContent;
      page: number;
    }
  ): SwissTournament[] => {
    return tournaments.map((tournament) => {
      if (tournament.id === params.tournamentID) {
        if (updateSrc == "brackets") {
          // console.log(srcArguments.generatedContent);
          // ///////////////////////////////////////////////////////////////////////
          let modifiedSeeds: Seed[] = [];
          srcArguments.generatedContent.subBrackets.forEach(
            (subBracket, index) => {
              // console.log(subBracket);
              // console.log("bracket", srcArguments.bracketID);
              if (srcArguments.bracketID === 4) {
                if (index === 0 || index === 3) {
                  modifiedSeeds = [...modifiedSeeds, ...(subBracket as Seed[])];
                } else if (index === 1 || index === 2) {
                  modifiedSeeds = [
                    ...modifiedSeeds,
                    ...seriesToSeeds(subBracket as Series[]),
                  ];
                }
              } else if (srcArguments.bracketID === 5) {
                if (index === 0 || index === 2) {
                  modifiedSeeds = [...modifiedSeeds, ...(subBracket as Seed[])];
                } else if (index === 1) {
                  modifiedSeeds = [
                    ...modifiedSeeds,
                    ...seriesToSeeds(subBracket as Series[]),
                  ];
                }
              } else if (srcArguments.bracketID === 6) {
                modifiedSeeds = [...modifiedSeeds, ...(subBracket as Seed[])];
              } else if (srcArguments.bracketID === 9) {
                if (index === 0) {
                  modifiedSeeds.push(
                    (subBracket[0] as Series).rightSeed as Seed
                  );
                } else if (index == 1) {
                  modifiedSeeds.push(
                    (subBracket[0] as Series).leftSeed as Seed
                  );
                } else {
                  modifiedSeeds = [
                    ...modifiedSeeds,
                    ...seriesToSeeds(subBracket as Series[]),
                  ];
                }
              } else if (
                srcArguments.bracketID != 0 &&
                srcArguments.bracketID != 7
              ) {
                modifiedSeeds = [
                  ...modifiedSeeds,
                  ...seriesToSeeds(subBracket as Series[]),
                ];
              }
            }
          );

          const modifiedSeedsMap = new Map<number, Seed>();
          modifiedSeeds.forEach((seed) => {
            modifiedSeedsMap.set(seed.id, seed);
          });

          if (srcArguments.bracketID != 0) {
            tournament.initSwissSeeds = tournament.initSwissSeeds.map(
              (seed) => {
                const updatedSeed = modifiedSeedsMap.get(seed.id);
                if (updatedSeed) {
                  return updatedSeed;
                } else {
                  return seed;
                }
              }
            );
          }

          // console.log(`modded seeds: ${modifiedSeeds.length}`);
          // console.log(modifiedSeeds);

          switch (srcArguments.bracketID) {
            case 0:
            case 1:
              {
                // console.log('cleared', srcArguments.generatedContent)
                tournament.winningSeed = defaultSeed;
                tournament.brackets.swissB1 = srcArguments.generatedContent;
                tournament.brackets.swissB2 = initiateEmptyBrackets(
                  bracketKeys[1]
                );
                tournament.brackets.swissB3 = initiateEmptyBrackets(
                  bracketKeys[2]
                );
                tournament.brackets.swissB4 = initiateEmptyBrackets(
                  bracketKeys[3]
                );
                tournament.brackets.swissB5 = initiateEmptyBrackets(
                  bracketKeys[4]
                );
                tournament.brackets.swissB6 = initiateEmptyBrackets(
                  bracketKeys[5]
                );
                tournament.brackets.playoffsB1 = initiateEmptyBrackets(
                  bracketKeys[6]
                );
                tournament.brackets.playoffsB2 = initiateEmptyBrackets(
                  bracketKeys[7]
                );
                tournament.brackets.playoffsB3 = initiateEmptyBrackets(
                  bracketKeys[8]
                );
                tournament.brackets.playoffsB4 = initiateEmptyBrackets(
                  bracketKeys[9]
                );
              }
              break;
            case 2:
              {
                // console.log('current update',currentBracketData);
                tournament.brackets.swissB1 = currentBracketData;
                tournament.brackets.swissB2 = srcArguments.generatedContent;
              }
              break;
            case 3:
              {
                tournament.brackets.swissB2 = currentBracketData;
                tournament.brackets.swissB3 = srcArguments.generatedContent;
              }
              break;
            case 4:
              {
                tournament.brackets.swissB3 = currentBracketData;
                tournament.brackets.swissB4 = srcArguments.generatedContent;
              }
              break;
            case 5:
              {
                tournament.brackets.swissB4 = currentBracketData;
                tournament.brackets.swissB5 = srcArguments.generatedContent;
              }
              break;
            case 6:
              {
                tournament.brackets.swissB5 = currentBracketData;
                tournament.brackets.swissB6 = srcArguments.generatedContent;
              }
              break;
            case 7:
              {
                // console.log(currentBracketData);
                // tournament.brackets.swissB6 = currentBracketData;
                tournament.brackets.playoffsB1 = srcArguments.generatedContent;
                // cycle to playoffs page
                cycleViews(1);
                updateTournamentsArray("view", {
                  bracketID: 0,
                  generatedContent: defaultBracketContent,
                  page: 1,
                });
              }
              break;
            case 8:
              {
                // remove last 2 subBrackets before tournament state update
                // as they were only needed for series score update
                srcArguments.generatedContent.subBrackets.splice(
                  srcArguments.generatedContent.subBrackets.length - 2
                );

                tournament.brackets.playoffsB1 = currentBracketData;
                tournament.brackets.playoffsB2 = srcArguments.generatedContent;

                const semiFinal1 = srcArguments.generatedContent
                  .subBrackets[0][0] as Series;
                const qualFinal1 = activeTournament?.brackets.playoffsB1
                  .subBrackets[0][0] as Series;

                const semiFinal2 = srcArguments.generatedContent
                  .subBrackets[1][0] as Series;
                const qualFinal2 = activeTournament?.brackets.playoffsB1
                  .subBrackets[3][0] as Series;

                const prelimFinal1 = setPrelimFinal(
                  qualFinal1,
                  semiFinal1,
                  "final1"
                );

                const prelimFinal2 = setPrelimFinal(
                  qualFinal2,
                  semiFinal2,
                  "final2"
                );

                tournament.brackets.playoffsB3.subBrackets = [
                  [prelimFinal1],
                  [prelimFinal2],
                ];
              }
              break;
            case 9:
              {
                // console.log(
                //   currentBracketData.subBrackets.splice(
                //     currentBracketData.subBrackets.length - 2
                //   )
                // );
                srcArguments.generatedContent.subBrackets.splice(
                  srcArguments.generatedContent.subBrackets.length - 1
                );

                tournament.brackets.playoffsB2 = {
                  subBrackets: currentBracketData.subBrackets.splice(
                    currentBracketData.subBrackets.length - 2
                  ),
                };

                tournament.brackets.playoffsB3 = srcArguments.generatedContent;
              }
              break;
            case 10:
              {
                // console.log(currentBracketData)
                srcArguments.generatedContent.subBrackets.splice(
                  srcArguments.generatedContent.subBrackets.length - 1
                );
                tournament.brackets.playoffsB3 = currentBracketData;
                tournament.brackets.playoffsB4 = srcArguments.generatedContent;
              }
              break;
            case 11:
              {
                // console.log(currentBracketData)
                tournament.brackets.playoffsB4 = currentBracketData;
                tournament.winningSeed = (
                  srcArguments.generatedContent.subBrackets as Series[][]
                )[0][0].leftSeed as Seed;
                // cycle to winners page
                cycleViews(2);
                updateTournamentsArray("view", {
                  bracketID: 0,
                  generatedContent: defaultBracketContent,
                  page: 2,
                });
              }
              break;
            default:
              console.log("bracket ID error, can not update tournament data!");
          }

          updateTournamentsStatesArray("brackets", {
            bracketID: srcArguments.bracketID,
            page: srcArguments.page,
          });
        } else if (updateSrc == "view") {
          updateTournamentsStatesArray("view", {
            bracketID: srcArguments.bracketID,
            page: srcArguments.page,
          });
        }

        return tournament;
        // console.log(clonedtournament.states.stageView)
      } else {
        return tournament;
      }
    });
  };

  const updateTournamentsStatesArray = (
    updateSrc: "brackets" | "view",
    srcArguments: {
      bracketID: number;
      page: number;
    }
  ) => {
    if (tournamentsStates) {
      const updatedTournamentsStates = tournamentsStates.map(
        (tournamentStates) => {
          if (
            activeTournament &&
            tournamentStates.id === `${activeTournament.id}-states`
          ) {
            if (updateSrc === "brackets") {
              if (srcArguments.bracketID > 1 && srcArguments.bracketID < 11) {
                let disableCounter = 0;
                tournamentStates.states.bracketEditorStates[
                  srcArguments.bracketID - 1
                ].show = true;
                tournamentStates.states.bracketEditorStates[
                  srcArguments.bracketID - 1
                ].disabled = false;
                for (
                  let x = 1;
                  x <= tournamentStates.states.bracketEditorStates.length;
                  x++
                ) {
                  if (
                    tournamentStates.states.bracketEditorStates[
                      tournamentStates.states.bracketEditorStates.length - x
                    ].show === true
                  )
                    disableCounter++;

                  if (disableCounter > 2)
                    tournamentStates.states.bracketEditorStates[
                      tournamentStates.states.bracketEditorStates.length - x
                    ].disabled = true;
                }
              } else if (srcArguments.bracketID == 1) {
                tournamentStates.states.bracketEditorStates =
                  initiateBracketEditorStates();
                // sets last page to initial page
                tournamentStates.states.lastPage = 0;
                cycleViews(0);
              }
            } else if (updateSrc === "view") {
              tournamentStates.states.lastPage = srcArguments.page;
            }

            return tournamentStates;
          }
          return tournamentStates;
        }
      );

      setTournamentsStates(updatedTournamentsStates);
    } else {
      toast(`error saving states for this tournament`);
    }
  };

  const cycleViewsOnclick = (e: React.MouseEvent<HTMLElement>) => {
    const direction = e.currentTarget.getAttribute("data-direction");

    let currentPage = activeTournamentState?.states.lastPage || 0;

    if (activeTournament) {
      if (
        (direction === "left" && currentPage > 0) ||
        (direction === "right" && currentPage < 2)
      ) {
        if (direction === "left") {
          cycleViews((currentPage -= 1));
        } else {
          cycleViews((currentPage += 1));
        }
      }

      updateTournamentsStatesArray("view", {
        bracketID: 0,
        page: currentPage,
      });
    }
  };

  useEffect(() => {
    if (activeTournament) {
      activeTournamentState?.states.bracketEditorStates.forEach(
        (bracketEditorState) => {
          const bracketEditorElement = document.getElementById(
            bracketEditorState.bracketID
          ) as HTMLDivElement;

          if (bracketEditorState.show) {
            bracketEditorElement.classList.remove("hide");
          } else {
            bracketEditorElement.classList.add("hide");
          }

          bracketEditorElement.childNodes.forEach((button) => {
            if (button.nodeType === Node.ELEMENT_NODE) {
              const elementButton = button as Element;
              if (!(elementButton.getAttribute("data-id") === "edit")) {
                (elementButton as HTMLButtonElement).disabled =
                  bracketEditorState.disabled;
              }
            }
          });
        }
      );

      // activeTournament.initSwissSeeds.forEach((seed) => {
      //   console.log(`${seed.initials} => ${seed.seriesScores}`);
      // });

      // console.log("new", activeTournament.brackets.swissB1);
      // console.log('\n');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournaments]);

  const getBracketData = (key: string): bracketContent | Seed => {
    if (activeTournament) {
      switch (key) {
        case bracketKeys[0]:
          return activeTournament.brackets.swissB1;
        case bracketKeys[1]:
          return activeTournament.brackets.swissB2;
        case bracketKeys[2]:
          return activeTournament.brackets.swissB3;
        case bracketKeys[3]:
          return activeTournament.brackets.swissB4;
        case bracketKeys[4]:
          return activeTournament.brackets.swissB5;
        case bracketKeys[5]:
          return activeTournament.brackets.swissB6;
        case bracketKeys[6]:
          return activeTournament.brackets.playoffsB1;
        case bracketKeys[7]:
          return activeTournament.brackets.playoffsB2;
        case bracketKeys[8]:
          return activeTournament.brackets.playoffsB3;
        case bracketKeys[9]:
          return activeTournament.brackets.playoffsB4;
        case "winning_seed":
          return activeTournament.winningSeed;
        default:
          return defaultBracketContent;
      }
    } else {
      return defaultBracketContent;
    }
  };

  // const handleCallChildFunction = () => {
  //   if (childRef.current) {
  //     // childRef.current.updateMessage("Hello from Parent!"); // Call another exposed function
  //     childRef.current.clearSeriesScores();
  //   }
  // };

  const clearSeriesScores = (clearAll: boolean, bracketID: number) => {
    const searchQuery = clearAll ? `"Brac"` : `"Brac${bracketID}"`;

    const scoresInputs: NodeListOf<HTMLInputElement> =
      document.querySelectorAll(`input[name^=${searchQuery}]`);

    scoresInputs.forEach((input) => {
      (input as HTMLInputElement).value = "";
    });
  };

  //helper function for clearing all bracket data in a tournament
  const clearBrackets = () => {
    generateNextBracket(defaultBracketContent, 1);
    clearSeriesScores(true, 0);
    // handleCallChildFunction();
  };

  const setImg = () => {
    const tournament_bg_img_wrapper = document.getElementById(
      "tournament_bg_img_wrapper"
    ) as HTMLDivElement;

    if (activeTournament) {
      if (activeTournament.image) {
        tournament_bg_img_wrapper.style.backgroundImage = `url(${activeTournament.image})`;
        tournament_bg_img_wrapper.classList.add("show_bg_img");
      } else {
        tournament_bg_img_wrapper.style.display = "none";
      }
    }
  };

  useEffect(() => {
    if (activeTournament) {
      // initialize bracket 1 data on mount if any series contains a default seed
      if (
        activeTournament.brackets.swissB1.subBrackets[0] &&
        activeTournament.brackets.swissB1.subBrackets[0].length > 0
      ) {
        for (const series of activeTournament.brackets.swissB1.subBrackets[0]) {
          const leftSeed = (series as Series).leftSeed;
          const rightSeed = (series as Series).rightSeed;
          if (leftSeed && rightSeed) {
            if (leftSeed.id === 0 || rightSeed.id === 0) {
              generateNextBracket(defaultBracketContent, 0);
              console.log("bracket1 initialised");
              break;
            }
          }
        }
      }

      // activeTournament.initSwissSeeds.forEach((seed) => {
      //   console.log(`${seed.initials} => ${seed.seriesScores}`);
      // });

      setTimeout(() => {
        setImg();
      }, 500);

      if (activeTournamentState) {
        cycleViews(activeTournamentState.states.lastPage);
      }
    } else {
      navigate("/swiss-bracket-manager/overview");
      toast("error loading tournament data!");
    }

    // Function to handle window losing focus
    // const handleBlur = () => {
    //   console.log("lost focus");
    //   setIsWindowFocused(false);
    // };

    // // Function to handle window gaining focus
    // const handleFocus = () => {
    //   console.log("gained focus");
    //   setIsWindowFocused(true);
    // };

    // window.addEventListener("blur", handleBlur);
    // window.addEventListener("focus", handleFocus);

    // Cleanup function: remove event listeners when component unmounts
    // return () => {
    //   window.removeEventListener("blur", handleBlur);
    //   window.removeEventListener("focus", handleFocus);
    //   // isWindowFocused.current = false;
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canGetValue = (bracketID: number, index: number): boolean => {
    if (bracketID === 4 && (index === 0 || index === 3)) {
      return false;
    }

    if (bracketID === 5 && (index === 0 || index === 2)) {
      return false;
    }

    if (bracketID === 6) {
      return false;
    }
    // If none of the conditions above are met, return true
    return true;
  };

  const processBracketData = (
    subBrackets: (Series | Seed)[][],
    nextBracketID: number
  ) => {
    const currentBracketID = nextBracketID - 1;
    const seriesScoresIndex = nextBracketID - 2;
    const updatedSubBracketContent = subBrackets.map((subBracket, index) => {
      return subBracket.map((seriesItem) => {
        const leftSeed = (seriesItem as Series).leftSeed;
        const rightSeed = (seriesItem as Series).rightSeed;

        if (canGetValue(currentBracketID, index)) {
          const leftInputVal = getInputValue(
            currentBracketID,
            leftSeed?.id as number
          );
          const rightInputVal = getInputValue(
            currentBracketID,
            rightSeed?.id as number
          );

          const newLeftSeriesScores = [...(leftSeed?.seriesScores || [])];
          newLeftSeriesScores[seriesScoresIndex] = leftInputVal;

          const newRightSeriesScores = [...(rightSeed?.seriesScores || [])];
          newRightSeriesScores[seriesScoresIndex] = rightInputVal;

          return {
            ...seriesItem,
            leftSeed: {
              ...leftSeed,
              seriesScores: newLeftSeriesScores,
            },
            rightSeed: {
              ...rightSeed,
              seriesScores: newRightSeriesScores,
            },
          };
        } else {
          return seriesItem;
        }
      });
    });

    // console.log(updatedSubBracketContent)
    generateNextBracket(
      { subBrackets: updatedSubBracketContent as Series[][] },
      nextBracketID
    );
  };

  const generateNextBracket = (
    prevBracketContent: bracketContent,
    bracketID: number
  ) => {
    if (activeTournament) {
      // custom bracket content for specific conditions
      if (bracketID === 0) {
        prevBracketContent = {
          subBrackets: [seedsToSeries(activeTournament.initSwissSeeds)],
        };
      } else if (bracketID === 1) {
        prevBracketContent = {
          subBrackets: [
            seedsToSeries(
              activeTournament.initSwissSeeds.map((seed) => {
                return {
                  ...seed,
                  seriesScores: defaultSeriesScores,
                };
              })
            ),
          ],
        };
      } else if (bracketID === 7) {
        const getUpdatedSeed = (subBracket: Seed[]): Seed[] => {
          return subBracket.map((seed) => {
            const updatedSeed = activeTournament.initSwissSeeds.find(
              (seedItem) => {
                return seedItem.id === (seed as Seed).id;
              }
            );
            return {
              ...seed,
              seriesScores: updatedSeed!.seriesScores,
            };
          });
        };
        prevBracketContent = {
          subBrackets: [
            ...[
              seedsToSeries(
                getUpdatedSeed(
                  activeTournament.brackets.swissB4.subBrackets[0] as Seed[]
                )
              ),
            ],
            ...[
              seedsToSeries(
                getUpdatedSeed(
                  activeTournament.brackets.swissB5.subBrackets[0] as Seed[]
                )
              ),
            ],
            ...[
              seedsToSeries(
                getUpdatedSeed(
                  activeTournament.brackets.swissB6.subBrackets[0] as Seed[]
                )
              ),
            ],
          ],
        };
      } else if (bracketID === 9) {
        prevBracketContent = {
          subBrackets: [
            ...activeTournament.brackets.playoffsB3.subBrackets,
            ...prevBracketContent.subBrackets,
          ],
        };
      }

      // activeTournament.initSwissSeeds.forEach((seed) => {
      //   console.log(
      //     `${seed.initials} scores: ${seed.seriesScores} bracket: ${bracketID}`
      //   );
      // });

      // console.log("current", prevBracketContent);
      // setCurrentBracketData(prevBracketContent);
      currentBracketData = prevBracketContent;

      const generatedContent = bracketManager.generateBracket(
        prevBracketContent,
        bracketID
      );

      setTournaments(
        updateTournamentsArray("brackets", {
          bracketID,
          generatedContent,
          page: 0,
        })
      );
    }
  };

  const eventHandlers = {
    clearBracketsHandler: clearBrackets,
    cycleViewsOnClickHandler: cycleViewsOnclick,
    processBracketDataHandler: processBracketData,
    getBracketDataHandler: getBracketData,
    clearSeriesScoresHandler: clearSeriesScores,
  };

  if (activeTournament) {
    return (
      <div id="content" className={`min-h-screen`}>
        <div id="tournament_bg_img_wrapper"></div>
        <TopbarMenu
          eventHandlers={eventHandlers}
          activeTournament={activeTournament}
          setIsWindowFocusedRef={setIsWindowFocused}
        />

        <div id="view_window">
          <div id="view_wrapper" className="loaded">
            <SwissStage1
              eventHandlers={eventHandlers}
              activeTournament={activeTournament}
              ref={childRef}
            />

            <Playoffs
              eventHandlers={eventHandlers}
              activeTournament={activeTournament}
              ref={childRef}
            />

            <WinnersDisplay
              eventHandlers={eventHandlers}
              activeTournament={activeTournament}
            />
          </div>
        </div>
      </div>
    );
  }
}
