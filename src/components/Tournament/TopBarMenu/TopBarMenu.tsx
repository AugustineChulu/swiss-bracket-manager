import "./TopbarMenu.css";
import {
  tournamentEventHandlers,
} from "../../../utils/types/VariableDefinations";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SwissTournament } from "@/utils/models/Tournament";
import { Dispatch, SetStateAction } from "react";

export default function TopbarMenu(props: {
  eventHandlers: tournamentEventHandlers;
  activeTournament: SwissTournament;
  setIsWindowFocusedRef: Dispatch<SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();

  const route = (destination: "overview" | "tournamentManager") =>{
    props.setIsWindowFocusedRef(false);

    let url: string = "";
    if(destination === "overview")
      url = `/swiss-bracket-manager/overview`;
    else if(destination === "tournamentManager")
      url = `/swiss-bracket-manager/tournament/manage/${props.activeTournament.id}`;

    navigate(url);
  }

  return (
    <div id="app_opts_wrapper">
      <Button title="leave tournament" size="icon" onDoubleClick={()=> route("overview")}>
        <i className="fa-solid fa-arrow-right-from-bracket fa-flip-horizontal"></i>
      </Button>

      <div tabIndex={0} id="tournament_opts_wrapper" className="rounded-full">
        <Button
          title="manage tournament"
          size="icon"
          className="size-12"
          onDoubleClick={()=> route("tournamentManager")}
        >
          <i className="fa-solid fa-file-pen fa-lg"></i>
        </Button>

        <div id="quick_opts_wrapper">
          <Button
            title="(double click) reset tournament progress"
            size="icon"
            onDoubleClick={props.eventHandlers.clearBracketsHandler}
            variant="destructive"
          >
            <i className="fa-solid fa-broom"></i>
          </Button>
        </div>
      </div>

      <div id="stage_cycle_btns" className="rounded-full">
        <Button
          title="previous"
          onClick={props.eventHandlers.cycleViewsOnClickHandler}
          data-direction="left"
          size="icon"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </Button>

        <Button
          title="next"
          onClick={props.eventHandlers.cycleViewsOnClickHandler}
          data-direction="right"
          size="icon"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </Button>
      </div>
    </div>
  );
}
