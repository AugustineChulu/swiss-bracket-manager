import "./SeriesBracket.css";
import { forwardRef, useImperativeHandle, useState } from "react";
import SeriesCard from "../SeriesCard/SeriesCard";
import {
  bracketContent,
  tournamentEventHandlers,
  Series,
} from "../../../utils/types/VariableDefinations";
import BracketEditor from "../BracketEditor/BracketEditor";
import { SwissTournament } from "@/utils/models/Tournament";
import { Seed } from "@/utils/models/Seed";
// import React from 'react';
// import { animateIcon } from '../../../utils/Functions';

const SeriesBracket = forwardRef(
  (
    props: {
      activeTournament: SwissTournament;
      bracketID: number;
      stage: string;
      subBracketTypes: string[];
      subBracketTheme: string[];
      subBracketScores: string[];
      subBracketContent: bracketContent;
      eventHandlers: tournamentEventHandlers;
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      clearSeriesScores() {},
    }));

    const generateNextBracket = () => {
      props.eventHandlers.processBracketDataHandler(
        props.subBracketContent.subBrackets,
        props.bracketID + 1
      );
    };

    const isSeries = (item: Series | Seed): item is Series => {
      return (
        item !== undefined &&
        (item as Series).rightSeed !== undefined &&
        (item as Series).leftSeed !== undefined
      );
    };

    const [isEditMode, setIsEditMode] = useState(false);

    const toggleEditMode = () => {
      const scoresInputs: NodeListOf<HTMLInputElement> =
        document.querySelectorAll(`input[name^="Brac${props.bracketID}"]`);
      setIsEditMode((prev) => !prev);

      if (isEditMode) {
        scoresInputs.forEach((input) => {
          (input as HTMLInputElement).disabled = true;
        });
      } else {
        scoresInputs.forEach((input) => {
          (input as HTMLInputElement).disabled = false;
        });
      }
      // animateIcon(e,'fa-shake');
    };

    const clearSeiriesFromBracket = () => {
      props.eventHandlers.clearSeriesScoresHandler(false, props.bracketID);
      // animateIcon(e,'fa-shake');
    };

    return (
      <div className={`bracket ${props.stage}`} tabIndex={0}>
        <BracketEditor
          bracketID={props.bracketID}
          toggleEditModeOnClick={toggleEditMode}
          clearSeriesScoresOnClick={clearSeiriesFromBracket}
          generateNextBracketOnClick={generateNextBracket}
        />

        {props.subBracketScores.map((score, index) => (
          <div
            key={index}
            id={`s${props.bracketID}-${props.subBracketTypes[index]}`}
            className={`${props.stage}_sub_bracket ${
              props.subBracketTheme[index]
            } ${isEditMode ? "edit_mode" : ""} series_cards_wrapper`}
          >
            <div>{score}</div>

            <div>
              {(() => {
                // console.log(props.subBracketContent)
                if (Array.isArray(props.subBracketContent.subBrackets[index])) {
                  if (isSeries(props.subBracketContent.subBrackets[index][0])) {
                    return props.subBracketContent.subBrackets[index].map(
                      (series, idx) => (
                        <SeriesCard
                          key={idx}
                          bracketID={props.bracketID}
                          sub_bracket={++index}
                          stage={props.stage}
                          left_seed={(series as Series).leftSeed}
                          right_seed={(series as Series).rightSeed}
                          seed_list={null}
                          // activeTournament={props.activeTournament}
                        />
                      )
                    );
                  } else {
                    return (
                      <SeriesCard
                        key={index}
                        bracketID={props.bracketID}
                        sub_bracket={index}
                        stage={""}
                        left_seed={null}
                        right_seed={null}
                        seed_list={
                          props.subBracketContent.subBrackets[index] as Seed[]
                        }
                        // activeTournament={props.activeTournament}
                      />
                    );
                  }
                }
              })()}
            </div>
          </div>
        ))}
      </div>
    );
  }
);

export default SeriesBracket;
