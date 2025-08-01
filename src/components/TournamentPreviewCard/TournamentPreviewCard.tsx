import { useNavigate } from "react-router-dom";
import {
  overviewEventHandlers,
} from "../../utils/types/VariableDefinations";
import "./TournamentPreviewCard.css";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { SwissTournament } from "@/utils/models/Tournament";

export default function TournamentPreviewCard(props: {
  tournament: SwissTournament;
  eventHandlers: overviewEventHandlers;
}) {
  const navigate = useNavigate();

  const deleteTournamentHandler = () => {
    props.eventHandlers.deleteTournamentHandler(props.tournament.id);
  };

  const routeToManager = () => {
    navigate(`/swiss-bracket-manager/tournament/manage/${props.tournament.id}`);
  };

  const routeToTournament = () => {
    navigate(`/swiss-bracket-manager/run/${props.tournament.id}`);
  };

  return (
    <div className="tournament_preview_card" onDoubleClick={routeToTournament}>
      <div id="top_card">
        <img
          alt={`${props.tournament.name} picture`}
          src={`${props.tournament.image}`}
        ></img>
        <div id="action_btns_wrapper">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                title="delete tournament"
                variant="destructive"
                size="icon"
                className="size-12"
              >
                <i className="fa-solid fa-trash-can"></i>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  deleting
                  <span className="font-bold"> {props.tournament.name} </span>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant="outline">Cancel</Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    variant="destructive"
                    onClick={() => deleteTournamentHandler()}
                  >
                    Continue
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            title="manage tournament"
            size="icon"
            onClick={routeToManager}
            className="size-12"
          >
            <i className="fa-solid fa-file-pen fa-lg"></i>
          </Button>

          <Button
            title="run tournament"
            size="icon"
            onClick={routeToTournament}
            className="size-12"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </Button>
        </div>
      </div>
      <div id="bottom_card">
        <h2 className="text-xl">{props.tournament.name}</h2>
        <p>{props.tournament.game}</p>
      </div>
    </div>
  );
}
