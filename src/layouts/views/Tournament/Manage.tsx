import { Button } from "@/components/ui/button";
import "../../../css/layouts/views/Tournament/Manage.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import SeedPreviewCard from "@/components/SeedPreviewCard/SeedPreviewCard";
import { getImg, setBgVisibility } from "@/utils/models/UtilityFunctions";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { Seed } from "@/utils/models/Seed";
import {
  getTournamentStatesID,
  SwissTournament,
  SwissTournamentStates,
} from "@/utils/models/Tournament";
import { useAppContext } from "@/AppContext";
import {
  avatarPath,
  manageAvatarEventHandlers,
} from "@/utils/types/VariableDefinations";

export default function Manage() {
  const {
    tournaments,
    setTournaments,
    tournamentsStates,
    setTournamentsStates,
    avatarPaths,
  } = useAppContext();
  const params = useParams<{ tournamentID: string }>();

  const activeTournament = tournaments.find(
    (tournament) => tournament.id === params.tournamentID
  );

  const [swissSeeds, setSwissSeeds] = useState<Seed[]>(
    activeTournament?.initSwissSeeds as Seed[]
  );

  let selectedAvatars: string[] = [];

  const allAvatars: avatarPath[] = avatarPaths;

  const initAvailableAvatars = (
    avatarsCollection: avatarPath[]
  ): avatarPath[] => {
    selectedAvatars = [];

    activeTournament?.initSwissSeeds.forEach((seed) => {
      if (seed.avatar.pathID != "") {
        selectedAvatars.push(seed.avatar.pathID);
      }
    });

    const selectedAvatarsSet = new Set(selectedAvatars);

    return avatarsCollection.filter(
      (avatar) => !selectedAvatarsSet.has(avatar.pathID)
    );
  };

  const [availableAvatars, setAvailableAvatars] = useState<avatarPath[]>(
    initAvailableAvatars(allAvatars)
  );

  const setSeedAvatar = (
    seedID: number,
    avatar: avatarPath,
    avatarsCollection: avatarPath[]
  ): avatarPath[] => {
    selectedAvatars = [];
    // console.log("selected avatar", avatar.pathID);

    setSwissSeeds(
      swissSeeds.map((seed) => {
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

  const deleteTournament = (id: string) => {
    const filteredtournaments = tournaments.filter(
      (tournament) => tournament.id !== id
    );

    let filteredtournamentsStates: SwissTournamentStates[] = [];
    if (activeTournament) {
      filteredtournamentsStates = tournamentsStates.filter(
        (item) => item.id !== getTournamentStatesID(activeTournament?.id)
      );
    }

    navigate("/swiss-bracket-manager/overview");
    setTimeout(() => {
      setTournaments(filteredtournaments);
      setTournamentsStates(filteredtournamentsStates);
      toast(`${activeTournament?.name} has been deleted.`);
    }, 500);
  };

  const navigate = useNavigate();
  const routeToTournament = () => {
    navigate(`/swiss-bracket-manager/run/${params.tournamentID}`);
  };

  const [tournamentName, setTournamentName] = useState(activeTournament?.name);
  const [tournamentGame, setTournamentGame] = useState(activeTournament?.game);

  let showPreview: boolean = true;
  let backgroundPicture: string = activeTournament?.image as string;

  const previewBg = () => {
    if (showPreview && backgroundPicture != "") {
      setBgVisibility("show");
    } else {
      setBgVisibility("hide");
    }
  };

  const setImg = async (e: React.ChangeEvent<HTMLInputElement> | null) => {
    const bg_img_wrapper = document.getElementById(
      "bg_img_wrapper"
    ) as HTMLDivElement;
    if (e) {
      backgroundPicture = (await getImg(e.target)) as string;
    }

    bg_img_wrapper.style.backgroundImage = `url(${backgroundPicture})`;
    previewBg();
  };

  const updateSeedsArray = (
    seeds: Seed[],
    updatedSeedsForm: Record<string, unknown>
  ): Seed[] => {
    return seeds.map((seed, index) => {
      if (seed.id === index + 1) {
        seed.name = updatedSeedsForm[`seed${index + 1}_name`] as string;
        seed.initials = updatedSeedsForm[`seed${index + 1}_initials`] as string;
      }

      return seed;
    });
  };

  let isUpdateSuccessful: boolean = false;
  const updateTournamentsArray = (
    tournaments: SwissTournament[],
    id: string,
    name: string,
    game: string,
    image: string,
    seeds: Seed[],
    src: "info" | "participants"
  ): SwissTournament[] => {
    return tournaments.map((tournament) => {
      if (tournament.id === id) {
        if (src === "info") {
          isUpdateSuccessful = true;
          return {
            ...tournament,
            name: name,
            game: game,
            image: image,
          };
        } else if (src === "participants") {
          isUpdateSuccessful = true;
          return {
            ...tournament,
            initPlayoffSeeds: seeds,
          };
        }
      }
      return tournament;
    });
  };

  const updateTournamentData = (
    e: React.FormEvent<HTMLFormElement>,
    src: "info" | "participants"
  ) => {
    e.preventDefault();

    const form: FormData = new FormData(e.target as HTMLFormElement);
    const formJSON = JSON.parse(JSON.stringify(Object.fromEntries(form)));

    if (src == "info") {
      setTournaments(
        updateTournamentsArray(
          tournaments,
          activeTournament!.id,
          formJSON["tournament_title"],
          formJSON["game_title"],
          backgroundPicture,
          activeTournament!.initSwissSeeds,
          src
        )
      );
    } else if (src == "participants") {
      setTournaments(
        updateTournamentsArray(
          tournaments,
          activeTournament!.id,
          activeTournament!.name,
          activeTournament!.game,
          activeTournament!.image,
          updateSeedsArray(activeTournament!.initSwissSeeds, formJSON),
          src
        )
      );
    }

    setTimeout(() => {
      if (isUpdateSuccessful) {
        if (src == "info") {
          toast("tournament information has been updated.");
        } else if (src == "participants") {
          toast("the tournament participants have been updated.");
        }
      } else {
        toast("error updating tournament data.");
      }
      isUpdateSuccessful = false;
    }, 250);
  };

  useEffect(() => {
    if (activeTournament) {
      setTimeout(() => {
        setImg(null);
      }, 500);
    } else {
      toast("error loading tournament data!");
      navigate("/swiss-bracket-manager/overview");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (activeTournament) {
    return (
      <div className="content_page">
        <div>
          <h3>
            <span className="font-light">Manage Tournament: &ensp;</span>
            {activeTournament.name}
          </h3>

          <div className="title_bar_btns_wrapper">
            <div className="flex items-center space-x-2">
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
            <Button onClick={routeToTournament}>
              view brackets
              <i className="fa-solid fa-paper-plane"></i>
            </Button>
          </div>
        </div>

        <div>
          <Tabs defaultValue="information" id="manager_tabs" className="py-3">
            <TabsList id="tab_titles">
              <TabsTrigger value="information">
                <i className="fa-solid fa-puzzle-piece"></i>
                Information
              </TabsTrigger>
              <TabsTrigger value="participants">
                <i className="fa-solid fa-people-group"></i>
                Participants
              </TabsTrigger>
              <TabsTrigger value="actions">
                <i className="fa-solid fa-hand-pointer"></i>
                Actions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="information" className="tab_content">
              <Card>
                <form
                  id="edit_tournament_info_form"
                  onSubmit={(e) => {
                    updateTournamentData(e, "info");
                  }}
                >
                  <div>
                    <CardHeader className="grow flex-1 min-w-md break-words">
                      <CardTitle className="font-light">
                        <h2>Tournament Information</h2>
                      </CardTitle>

                      <CardDescription>
                        <p>
                          The Tournament Management section allows you to easily
                          oversee and control different aspects of your
                          tournament like managing participants and editing
                          tournament details, everything is accessible in one
                          place. Make real-time adjustments, and ensure your
                          tournament runs smoothly from start to finish.
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
                          value={tournamentName}
                          onChange={(e) => {
                            setTournamentName(e.target.value);
                          }}
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
                          value={tournamentGame}
                          onChange={(e) => {
                            setTournamentGame(e.target.value);
                          }}
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
                    </CardContent>
                  </div>

                  <CardFooter className="mt-12">
                    <Button title="save" type="submit">
                      <i className="fa-solid fa-check"></i>
                      SAVE CHANGES
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="participants" className="tab_content">
              <Card>
                <form
                  id="edit_tournament_participants"
                  onSubmit={(e) => {
                    updateTournamentData(e, "participants");
                  }}
                >
                  <div>
                    <CardHeader>
                      <CardTitle className="font-light">
                        <h2>Tournament Participatnts</h2>
                      </CardTitle>

                      <CardDescription>
                        <p>
                          The Participants Management section lets you add,
                          edit, and organize the names and titles of all
                          individuals involved in the tournament. This section
                          gives you full control to keep everything accurate and
                          up to date.
                        </p>
                      </CardDescription>
                    </CardHeader>

                    <CardContent id="participants_wrapper">
                      {activeTournament.initSwissSeeds.map((seed, index) => (
                        <SeedPreviewCard
                          key={index + 1}
                          seed={seed}
                          avatars={availableAvatars}
                          eventHandlers={eventHandlers}
                        />
                      ))}
                    </CardContent>
                  </div>

                  <CardFooter className="mt-12">
                    <Button title="create" type="submit">
                      <i className="fa-solid fa-check"></i>
                      SAVE CHANGES
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="actions" className="tab_content">
              <Card>
                <CardHeader>
                  <CardTitle className="font-light">
                    <h2>Delete Tournament</h2>
                  </CardTitle>

                  <CardDescription className="flex flex-row justify-between items-center">
                    <p>
                      Remove this tournament from the system. This action is
                      irreversible.
                    </p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <i className="fa-solid fa-delete-left"></i>
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
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
                              onClick={() =>
                                deleteTournament(activeTournament.id)
                              }
                            >
                              Continue
                            </Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }
}
