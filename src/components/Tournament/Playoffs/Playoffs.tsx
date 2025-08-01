import "./Playoffs.css";
import SeriesBracket from "../SeriesBracket/SeriesBracket";
import {
  bracketKeys,
  tournamentEventHandlers,
  linkerline,
  linkerLineDefaultProps,
  bracketContent,
} from "../../../utils/types/VariableDefinations";
import LinkerLine, { LinkerLineSocketGravity } from "linkerline";
import { forwardRef, useEffect, useRef } from "react";
import { rerenderLinkerLinesOnChange } from "../../../utils/models/UtilityFunctions";
import { SwissTournament } from "@/utils/models/Tournament";

const playOffsViewSocketPairs = [
  { start: "s7-p1", end: "s9-p1" },
  { start: "s7-p1", end: "s8-p1" },
  { start: "s7-p2", end: "s8-p1" },
  { start: "s7-p3", end: "s8-p2" },
  { start: "s7-p4", end: "s8-p2" },
  { start: "s7-p4", end: "s9-p2" },
  { start: "s8-p1", end: "s9-p2" },
  { start: "s8-p2", end: "s9-p1" },
  { start: "s9-p1", end: "s10-p1" },
  { start: "s9-p2", end: "s10-p1" },
];

const drawPlayOffLines = (): linkerline[] => {
  const lines: linkerline[] = [];

  playOffsViewSocketPairs.forEach((pair, index) => {
    const startEl = document.getElementById(pair.start);
    const endEl = document.getElementById(pair.end);

    if (!startEl || !endEl) {
      console.warn(
        `Skipping line: Elements not found: start=${pair.start}, end=${pair.end}`
      );
      return; // Skip this line if elements are missing
    }

    let yOffsetEnd: number = 50;
    let startPull = "auto" as LinkerLineSocketGravity;

    switch (index) {
      case 6:
      case 7:
        {
          if (index == 6) {
            yOffsetEnd = 40;
          } else if (index == 7) {
            yOffsetEnd = 80;
          }

          linkerLineDefaultProps.pathType = "straight";
        }
        break;
      default:
        linkerLineDefaultProps.pathType = "grid";
        break;
    }

    if (index == 0) {
      startPull = 330;
      yOffsetEnd = 40;
    } else if (index == 1) {
      yOffsetEnd = 40;
    } else if (index == 2) {
      yOffsetEnd = 82;
    } else if (index == 3) {
      yOffsetEnd = 40;
    } else if (index == 4) {
      yOffsetEnd = 80;
    } else if (index == 5) {
      startPull = 330;
      yOffsetEnd = 80;
    } else if (index == 8) {
      yOffsetEnd = 60;
    } else if (index == 9) {
      yOffsetEnd = 60;
    }

    const line = new LinkerLine({
      startSocket: "right",
      endSocket: "left",
      startSocketGravity: startPull,
      endPlug: linkerLineDefaultProps.endPlug,
      color: linkerLineDefaultProps.color,
      size: linkerLineDefaultProps.size,
      path: linkerLineDefaultProps.pathType,
      minGridLength: linkerLineDefaultProps.minGridLength,
      parent: document.getElementById("playoffs") as HTMLElement, // this is the new parent option
      start: LinkerLine.PointAnchor(startEl, { x: `100%`, y: `60%` }),
      end: LinkerLine.PointAnchor(endEl, { x: `0%`, y: `${yOffsetEnd}%` }),
    });

    line.position();
    lines.push(line);
  });

  return lines;
};

const Playoffs = forwardRef(
  (
    props: {
      eventHandlers: tournamentEventHandlers;
      activeTournament: SwissTournament;
    },
    ref
  ) => {
    const playoffLinesRef = useRef<linkerline[]>([]);
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        if (playoffLinesRef.current.length === 0) {
          // Draw lines only if they haven't been drawn
          playoffLinesRef.current = drawPlayOffLines();
        } else {
          // Just update their positions
          playoffLinesRef.current.forEach((line) => line.position());
        }
        rerenderLinkerLinesOnChange(
          playoffLinesRef.current,
          playOffsViewSocketPairs
        );
      }, 100);

      return () => clearTimeout(timeoutId);
    }, []);

    return (
      <div id="playoffs">
        <div id="bg_graphics">
          <div className="page_header">
            <h1>PLAYOFFS</h1>
            <h2>{props.activeTournament.name}</h2>
          </div>
        </div>
        <SeriesBracket
          activeTournament={props.activeTournament}
          bracketID={7}
          stage={"playoffs"}
          subBracketScores={[
            "QUALIFICATION FINAL",
            "ELIMINATION FINAL",
            "ELIMINATION FINAL",
            "QUALIFICATION FINAL",
          ]}
          subBracketTypes={["p1", "p2", "p3", "p4"]}
          subBracketTheme={["p1", "p2", "p3", "p4"]}
          subBracketContent={
            props.eventHandlers.getBracketDataHandler(
              bracketKeys[6]
            ) as bracketContent
          }
          eventHandlers={props.eventHandlers}
          ref={ref}
        />

        <SeriesBracket
          activeTournament={props.activeTournament}
          bracketID={8}
          stage={"playoffs"}
          subBracketScores={["SEMIFINAL", "SEMIFINAL"]}
          subBracketTypes={["p1", "p2"]}
          subBracketTheme={["p1", "p2"]}
          subBracketContent={
            props.eventHandlers.getBracketDataHandler(
              bracketKeys[7]
            ) as bracketContent
          }
          eventHandlers={props.eventHandlers}
          ref={ref}
        />

        <SeriesBracket
          activeTournament={props.activeTournament}
          bracketID={9}
          stage={"playoffs"}
          subBracketScores={["PLERIMINARY FINAL", "PLERIMINARY FINAL"]}
          subBracketTypes={["p1", "p2"]}
          subBracketTheme={["p1", "p2"]}
          subBracketContent={
            props.eventHandlers.getBracketDataHandler(
              bracketKeys[8]
            ) as bracketContent
          }
          eventHandlers={props.eventHandlers}
          ref={ref}
        />

        <SeriesBracket
          activeTournament={props.activeTournament}
          bracketID={10}
          stage={"playoffs"}
          subBracketScores={["GRAND FINAL"]}
          subBracketTypes={["p1"]}
          subBracketTheme={["p1"]}
          subBracketContent={
            props.eventHandlers.getBracketDataHandler(
              bracketKeys[9]
            ) as bracketContent
          }
          eventHandlers={props.eventHandlers}
          ref={ref}
        />
      </div>
    );
  }
);

export default Playoffs;
