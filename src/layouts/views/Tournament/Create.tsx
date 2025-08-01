import { useNavigate } from "react-router-dom";
import SeedPreviewCard from "../../../components/SeedPreviewCard/SeedPreviewCard";
import "../../../css/layouts/views/Tournament/Create.css";
import { getImg, setBgVisibility } from "@/utils/models/UtilityFunctions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getTournamentStatesID,
  SwissTournament,
  SwissTournamentStates,
} from "@/utils/models/Tournament";
import { Seed } from "@/utils/models/Seed";
import { useAppContext } from "@/AppContext";
import { useState } from "react";
import {
  avatarPath,
  manageAvatarEventHandlers,
} from "@/utils/types/VariableDefinations";

export default function Create() {
  const {
    tournaments,
    setTournaments,
    tournamentsStates,
    setTournamentsStates,
    avatarPaths,
  } = useAppContext();
  const navigate = useNavigate();

  const generateInintialSeeds = (): Seed[] => {
    const initSeeds: Seed[] = [];
    for (let x = 1; x <= 16; x++) {
      initSeeds.push(new Seed(x, "", "", { pathID: "", url: "" }, x));
    }
    return initSeeds;
  };

  const [initialSeeds, setInitialSeeds] = useState<Seed[]>(
    generateInintialSeeds()
  );

  let selectedAvatars: string[] = [];

  const allAvatars: avatarPath[] = avatarPaths;

  const [availableAvatars, setAvailableAvatars] = useState<avatarPath[]>([
    ...allAvatars,
  ]);

  const setSeedAvatar = (
    seedID: number,
    avatar: avatarPath,
    avatarsCollection: avatarPath[]
  ): avatarPath[] => {
    selectedAvatars = [];
    // console.log("selected avatar", avatar.pathID);

    setInitialSeeds(
      initialSeeds.map((seed) => {
        if (seed.id === seedID) {
          seed.avatar.pathID = avatar.pathID;
          seed.avatar.url = avatar.url;
        }
        if (seed.avatar.pathID != "") {
          selectedAvatars.push(seed.avatar.pathID);
        }
        return seed;
      })
    );

    const selectedAvatarsSet = new Set(selectedAvatars);

    return avatarsCollection.filter(
      (avatar) => !selectedAvatarsSet.has(avatar.pathID)
    );
  };

  const removeAvatar = (seedID: number) => {
    const updatedSeeds = setSeedAvatar(
      seedID,
      { pathID: "", url: "" },
      allAvatars
    );
    setAvailableAvatars(updatedSeeds);
  };

  const selectAvatar = (seedID: number, avatar: avatarPath) => {
    const updatedSeeds = setSeedAvatar(seedID, avatar, allAvatars);
    setAvailableAvatars(updatedSeeds);
  };

  const eventHandlers: manageAvatarEventHandlers = {
    selectAvatarHandler: selectAvatar,
    removeAvatarHandler: removeAvatar,
  };

  const routeToOverview = () => {
    navigate(`/swiss-bracket-manager/overview`);
  };

  let showPreview: boolean = true;
  let backgroundPicture: string = "";

  const previewBg = () => {
    if (showPreview && backgroundPicture != "") {
      setBgVisibility("show");
    } else {
      setBgVisibility("hide");
    }
  };

  const setImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const bg_img_wrapper = document.getElementById(
      "bg_img_wrapper"
    ) as HTMLDivElement;
    backgroundPicture = (await getImg(e.target)) as string;
    bg_img_wrapper.style.backgroundImage = `url(${backgroundPicture})`;
    previewBg();
  };

  const updateTournamentsArray = (
    id: string,
    name: string,
    game: string,
    seeds: Seed[]
  ): SwissTournament[] => {
    const clonedArray = [...tournaments];

    clonedArray.push(
      new SwissTournament(id, name, game, backgroundPicture, seeds)
    );
    return clonedArray;
  };

  const updateTournamentsStatesArray = (
    tournamentStatesID: string
  ): SwissTournamentStates[] => {
    let tempArray: SwissTournamentStates[] = [];
    if (tournamentsStates.length === 0) {
      tempArray.push(new SwissTournamentStates(tournamentStatesID));
    } else if (tournamentsStates) {
      tempArray = [
        ...tournamentsStates,
        new SwissTournamentStates(tournamentStatesID),
      ];
    }
    // console.log(`created tournament states ${tournamentStatesID}`);
    return tempArray;
  };

  const createNewTournament = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form: FormData = new FormData(e.target as HTMLFormElement);
    const formJSON = JSON.parse(JSON.stringify(Object.fromEntries(form)));

    let tournamentID = "st1";
    if (tournaments.length > 0) {
      const lastID = tournaments[tournaments.length - 1].id;
      const postfix = parseInt(lastID.slice(2)) + 1;
      tournamentID = "st" + postfix;
    }

    const updatedSeeds = initialSeeds.map((seed) => {
      return {
        ...seed,
        initials: formJSON[`seed${seed.id}_initials`],
        name: formJSON[`seed${seed.id}_name`],
      };
    });

    // console.log(updatedSeeds);

    setTournaments(
      updateTournamentsArray(
        tournamentID,
        formJSON["tournament_title"],
        formJSON["game_title"],
        updatedSeeds
      )
    );

    setTournamentsStates(
      updateTournamentsStatesArray(getTournamentStatesID(tournamentID))
    );

    setTimeout(() => {
      navigate("/swiss-bracket-manager/overview");
      toast(`${formJSON["tournament_title"]} tournament has been created.`);
    }, 500);
  };

  return (
    <div id="create_view_img_bg" className="content_page">
      <div>
        <h3>New Tournament</h3>

        <div className="title_bar_btns_wrapper"></div>
      </div>

      <div className="py-3 pr-2">
        <Card>
          <form id="new_tournament_form" onSubmit={createNewTournament}>
            <Card className="border-none rounded-none p-0">
              <CardHeader className="grow flex-1 min-w-md break-words">
                <CardTitle className="font-light">
                  <h2>Tournament Information</h2>
                </CardTitle>

                <CardDescription>
                  <p>
                    Welcome to the Tournament Setup page! Here you can give your
                    tournament a name, choose the game or sport. Use the
                    description field to share highlights or rules, and don't
                    forget to upload an image to make your event stand out. Once
                    you've filled in all the required fields, click “Create” to
                    bring your competition to life!
                  </p>
                </CardDescription>
              </CardHeader>

              <CardContent className="grow flex flex-col gap-y-4">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="tournament_title">
                    <h2>Tournament Title</h2>
                  </Label>
                  <Input
                    type="text"
                    id="tournament_title"
                    name="tournament_title"
                    placeholder="tournament"
                    required
                  />
                </div>

                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="game_title">
                    <h2>Game Title</h2>
                  </Label>
                  <Input
                    type="text"
                    id="game_title"
                    name="game_title"
                    placeholder="Game"
                    required
                  />
                </div>

                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="bg_img">
                    <h2>Background Picture</h2>
                  </Label>
                  <Input
                    id="bg_img"
                    name="bg_img"
                    type="file"
                    onChange={setImg}
                    accept="image/jpeg, image/png, image/webp"
                  />
                </div>

                <div className="flex items-center space-x-2 mt-3">
                  <Switch
                    id="preview_toggle"
                    name="preview_toggle"
                    defaultChecked
                    onCheckedChange={(value) => {
                      showPreview = value;
                      previewBg();
                    }}
                  />
                  <Label htmlFor="preview_toggle">
                    <h2>Preview Background</h2>
                  </Label>
                </div>
              </CardContent>
            </Card>

            <div>
              {(() => {
                return initialSeeds.map((seed, index) => (
                  <SeedPreviewCard
                    key={index}
                    seed={seed}
                    avatars={availableAvatars}
                    eventHandlers={eventHandlers}
                  />
                ));
              })()}
            </div>

            <div>
              <div>
                <Button title="create" type="submit">
                  <i className="fa-solid fa-check"></i>
                  CREATE
                </Button>
                <Button
                  title="discard"
                  variant="destructive"
                  onClick={routeToOverview}
                >
                  <i className="fa-solid fa-xmark"></i>
                  DISCARD
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
