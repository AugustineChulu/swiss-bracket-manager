import { useNavigate } from "react-router-dom";
import "../../css/layouts/views/Overview.css";
import TournamentPreviewCard from "../../components/TournamentPreviewCard/TournamentPreviewCard";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  getTournamentStatesID,
  SwissTournament,
} from "@/utils/models/Tournament";
import { useAppContext } from "@/AppContext";

export default function Overview() {
  const {
    tournaments,
    setTournaments,
    tournamentsStates,
    setTournamentsStates,
  } = useAppContext();
  // console.log(tournaments)
  useEffect(() => {
    const backfacingCard = document.querySelectorAll(
      ".tournament_preview_card > div:nth-child(1)"
    ) as NodeListOf<Element>;

    const getRotateYValue = (element: HTMLDivElement) => {
      const style = window.getComputedStyle(element);
      const transform = style.transform;

      if (transform && transform !== "none") {
        const values = transform.split("(")[1].split(")")[0].split(",");
        const a = parseFloat(values[0]);
        const b = parseFloat(values[1]);
        return Math.atan2(b, a) * (180 / Math.PI);
      }
      return 0; // Default rotation value if no transform is applied
    };

    const toggleButtonActivation = (card: Element) => {
      const buttons = card.querySelectorAll(
        "div:nth-child(1) button"
      ) as NodeListOf<Element>;
      const rotationY = getRotateYValue(card as HTMLDivElement);

      if (rotationY == 0) {
        buttons.forEach((button) => {
          if ((button as HTMLButtonElement).disabled)
            (button as HTMLButtonElement).disabled = false;
        });
      } else if (rotationY == 180) {
        buttons.forEach((button) => {
          if (!(button as HTMLButtonElement).disabled)
            (button as HTMLButtonElement).disabled = true;
        });
      }
    };

    backfacingCard.forEach((card) => {
      toggleButtonActivation(card);
      card.addEventListener("transitionend", () => {
        toggleButtonActivation(card);
      });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTournamentsArray = (
    updateSrc: string,
    srcArguments: {
      tournamentID: string;
    }
  ): SwissTournament[] => {
    if (updateSrc == "previewCard") {
      const filteredtournaments = tournaments.filter(
        (tournament) => tournament.id !== srcArguments.tournamentID
      );
      return filteredtournaments;
    }

    return tournaments;
  };

  const deleteTournament = (tournamentID: string) => {
    setTimeout(() => {
      setTournaments(updateTournamentsArray("previewCard", { tournamentID }));

      const filteredtournamentsStates = tournamentsStates.filter(
        (item) => item.id !== getTournamentStatesID(tournamentID)
      );
      setTournamentsStates(filteredtournamentsStates);
    }, 1000);
  };

  const eventHandlers = {
    deleteTournamentHandler: deleteTournament,
  };

  const navigate = useNavigate();

  const routeToTournamentCreation = () => {
    navigate(`/swiss-bracket-manager/tournament/create`);
  };

  return (
    // <div>div</div>
    <div className="content_page h-full">
      <div>
        <h3>Overview</h3>

        <div className="title_bar_btns_wrapper">
          {tournaments.length < 1 ? null : (
            <Button onClick={routeToTournamentCreation} id="rtt_title_bar">
              <i className="fa-solid fa-plus"></i>
              create tournament
            </Button>
          )}
        </div>
      </div>

      <div
        id="tournament_cards_wrapper"
        className={`${tournaments.length < 1 ? "" : "static_height py-6"}`}
      >
        {(() => {
          if (tournaments.length < 1) {
            return (
              <div className="self-center flex flex-col items-center text-center gap-y-4">
                <div className="text-2xl">
                  THEY'RE NO TOURNAMENTS TO DISPLAY
                </div>

                <Button onClick={routeToTournamentCreation}>
                  <i className="fa-solid fa-plus"></i>
                  create tournament
                </Button>
              </div>
            );
          } else {
            return tournaments.map((tournament, index) => (
              <TournamentPreviewCard
                key={index}
                tournament={tournament}
                eventHandlers={eventHandlers}
              />
            ));
          }
        })()}
      </div>
    </div>
  );
}
