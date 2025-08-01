import "./SwissStage1.css";
import SeriesBracket from "../SeriesBracket/SeriesBracket";
import {
  bracketKeys,
  tournamentEventHandlers,
  linkerline,
  linkerLineDefaultProps,
  bracketContent,
} from "../../../utils/types/VariableDefinations";
import LinkerLine from "linkerline";
import { forwardRef, useEffect, useRef } from "react";
import { rerenderLinkerLinesOnChange } from "../../../utils/models/UtilityFunctions";
import { SwissTournament } from "@/utils/models/Tournament";

const subBracketType: string[] = [
  "init",
  "win",
  "lose",
  "inter-win",
  "inter-lose",
  "tiebreaker",
  "elim",
];
const subBracketTheme: string[] = [
  "initial",
  "intermediate",
  "qualifier",
  "elimination",
];

const swissViewSocketPairs = [
  { start: "s1-init", end: "s2-win" },
  { start: "s1-init", end: "s2-lose" },
  { start: "s2-win", end: "s3-win" },
  { start: "s2-win", end: "s3-inter-win" },
  { start: "s2-lose", end: "s3-inter-win" },
  { start: "s2-lose", end: "s3-lose" },
  { start: "s3-win", end: "s4-win" },
  { start: "s3-win", end: "s4-inter-win" },
  { start: "s3-inter-win", end: "s4-inter-win" },
  { start: "s3-inter-win", end: "s4-inter-lose" },
  { start: "s3-lose", end: "s4-inter-lose" },
  { start: "s3-lose", end: "s4-elim" },
  { start: "s4-inter-win", end: "s5-tiebreaker" },
  { start: "s4-inter-win", end: "s5-inter-win" },
  { start: "s4-inter-lose", end: "s5-inter-win" },
  { start: "s4-inter-lose", end: "s5-elim" },
  { start: "s5-inter-win", end: "s6-win" },
  { start: "s5-inter-win", end: "s6-elim" },
];

const drawSwissLines = (): linkerline[] => {
  const lines: linkerline[] = [];

  swissViewSocketPairs.forEach((pair, index) => {
    const startEl = document.getElementById(pair.start);
    const endEl = document.getElementById(pair.end);

    if (!startEl || !endEl) {
      console.warn(
        `Skipping line: Elements not found: start=${pair.start}, end=${pair.end}`
      );
      return; // Skip this line if elements are missing
    }

    let yOffsetStart = 50;
    let yOffsetEnd = 50;

    switch (index) {
      case 6:
      case 11:
      case 12:
      case 15:
      case 16:
      case 17:
        {
          if (index == 6) {
            yOffsetStart = 25;
            yOffsetEnd = 69;
          } else if (index == 11) {
            yOffsetStart = 75;
            yOffsetEnd = 31;
          } else if (index == 12) {
            yOffsetStart = 32;
            yOffsetEnd = 69;
          } else if (index == 15) {
            yOffsetStart = 68;
            yOffsetEnd = 31;
          } else if (index == 16) {
            yOffsetStart = 24;
          } else if (index == 17) {
            yOffsetStart = 76;
          }

          linkerLineDefaultProps.pathType = "straight";
        }
        break;
      default:
        linkerLineDefaultProps.pathType = "grid";
        break;
    }

    const line = new LinkerLine({
      startSocket: "right",
      endSocket: "left",
      endPlug: linkerLineDefaultProps.endPlug,
      color: linkerLineDefaultProps.color,
      size: linkerLineDefaultProps.size,
      path: linkerLineDefaultProps.pathType,
      minGridLength: linkerLineDefaultProps.minGridLength,
      parent: document.getElementById("stage1") as HTMLElement,
      start: LinkerLine.PointAnchor(startEl, {
        x: `100%`,
        y: `${yOffsetStart}%`,
      }),
      end: LinkerLine.PointAnchor(endEl, { x: `0%`, y: `${yOffsetEnd}%` }),
    });

    line.position();
    lines.push(line);
  });

  return lines;
};

const SwissStage1 = forwardRef(
  (
    props: {
      eventHandlers: tournamentEventHandlers;
      activeTournament: SwissTournament;
    },
    ref
  ) => {
    const swissLinesRef = useRef<linkerline[]>([]);
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        if (swissLinesRef.current.length === 0) {
          // Draw lines only if they haven't been drawn
          swissLinesRef.current = drawSwissLines();
        } else {
          // Just update their positions
          swissLinesRef.current.forEach((line) => line.position());
        }
        rerenderLinkerLinesOnChange(
          swissLinesRef.current,
          swissViewSocketPairs
        );
      }, 100);

      return () => clearTimeout(timeoutId);
    }, []);

    return (
      <div id="stage1">
        <div id="bg_graphics">
          <div className="page_header">
            <h1>SWISS BRACKET</h1>
            <h2>{props.activeTournament.name}</h2>
          </div>
        </div>
        <SeriesBracket
          activeTournament={props.activeTournament}
          bracketID={1}
          stage={"swiss"}
          subBracketScores={["0 - 0"]}
          subBracketTypes={[subBracketType[0]]}
          subBracketTheme={[subBracketTheme[0]]}
          subBracketContent={
            props.eventHandlers.getBracketDataHandler(
              bracketKeys[0]
            ) as bracketContent
          }
          eventHandlers={props.eventHandlers}
          ref={ref}
        />

        <SeriesBracket
          activeTournament={props.activeTournament}
          bracketID={2}
          stage={"swiss"}
          subBracketScores={["1 - 0", "0 - 1"]}
          subBracketTypes={[subBracketType[1], subBracketType[2]]}
          subBracketTheme={[subBracketTheme[1], subBracketTheme[1]]}
          subBracketContent={
            props.eventHandlers.getBracketDataHandler(
              bracketKeys[1]
            ) as bracketContent
          }
          eventHandlers={props.eventHandlers}
          ref={ref}
        />

        <SeriesBracket
          activeTournament={props.activeTournament}
          bracketID={3}
          stage={"swiss"}
          subBracketScores={["2 - 0", "1 - 1", "0 - 2"]}
          subBracketTypes={[
            subBracketType[1],
            subBracketType[3],
            subBracketType[2],
          ]}
          subBracketTheme={[
            subBracketTheme[2],
            subBracketTheme[1],
            subBracketTheme[3],
          ]}
          subBracketContent={
            props.eventHandlers.getBracketDataHandler(
              bracketKeys[2]
            ) as bracketContent
          }
          eventHandlers={props.eventHandlers}
          ref={ref}
        />

        <SeriesBracket
          activeTournament={props.activeTournament}
          bracketID={4}
          stage={"swiss"}
          subBracketScores={["QUALIFIED", "2 - 1", "1 - 2", "ELIMINATED"]}
          subBracketTypes={[
            subBracketType[1],
            subBracketType[3],
            subBracketType[4],
            subBracketType[6],
          ]}
          subBracketTheme={[
            subBracketTheme[2],
            subBracketTheme[2],
            subBracketTheme[3],
            subBracketTheme[3],
          ]}
          subBracketContent={
            props.eventHandlers.getBracketDataHandler(
              bracketKeys[3]
            ) as bracketContent
          }
          eventHandlers={props.eventHandlers}
          ref={ref}
        />

        <SeriesBracket
          activeTournament={props.activeTournament}
          bracketID={5}
          stage={"swiss"}
          subBracketScores={["TIEBREAKERS", "2 - 2", "ELIMINATED"]}
          subBracketTypes={[
            subBracketType[5],
            subBracketType[3],
            subBracketType[6],
          ]}
          subBracketTheme={[
            subBracketTheme[1],
            subBracketTheme[1],
            subBracketTheme[3],
          ]}
          subBracketContent={
            props.eventHandlers.getBracketDataHandler(
              bracketKeys[4]
            ) as bracketContent
          }
          eventHandlers={props.eventHandlers}
          ref={ref}
        />

        <SeriesBracket
          activeTournament={props.activeTournament}
          bracketID={6}
          stage={"swiss"}
          subBracketScores={["QUALIFIED", "ELIMINATED"]}
          subBracketTypes={[subBracketType[1], subBracketType[6]]}
          subBracketTheme={[subBracketTheme[2], subBracketTheme[3]]}
          subBracketContent={
            props.eventHandlers.getBracketDataHandler(
              bracketKeys[5]
            ) as bracketContent
          }
          eventHandlers={props.eventHandlers}
          ref={ref}
        />
      </div>
    );
  }
);

export default SwissStage1;
