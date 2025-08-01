import { Seed } from "@/utils/models/Seed";
import {
  SwissTournament,
} from "@/utils/models/Tournament";
import { tournamentEventHandlers } from "@/utils/types/VariableDefinations";
import "./WinnersDisplay.css";

export default function WinnersDisplay(props: {
  eventHandlers: tournamentEventHandlers;
  activeTournament: SwissTournament;
}) {

  const winner: Seed = props.eventHandlers.getBracketDataHandler(
    "winning_seed"
  ) as Seed;
  
  return (
    <div>
      <div id="winner_details_wrapper">
        {winner.avatar.pathID != "" ? (
          <img
            alt={`${winner.name} avatar`}
            src={winner.avatar.url}
            className="winner_avatar"
          />
        ) : null}
        <div className="winner_name">
          {winner.name == "" ? "TBD" : winner.name}
        </div>
        <div className="champions_title">CHAMPIONS</div>
      </div>
    </div>
  );
}
