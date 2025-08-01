import {
  useState,
  ReactNode,
  useEffect,
  createContext,
  useContext,
} from "react";
import { avatarPath } from "./utils/types/VariableDefinations";
import {
  contentFromLocalStorage,
  contentToLocalStorage,
} from "./utils/models/UtilityFunctions";
import {
  getTournamentStatesID,
  SwissTournament,
  SwissTournamentStates,
} from "@/utils/models/Tournament";

type AppContextType = {
  tournaments: SwissTournament[];
  setTournaments: React.Dispatch<React.SetStateAction<SwissTournament[]>>;
  tournamentsStates: SwissTournamentStates[];
  setTournamentsStates: React.Dispatch<
    React.SetStateAction<SwissTournamentStates[]>
  >;
  avatarPaths: avatarPath[];
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [tournaments, setTournaments] = useState<SwissTournament[]>(
    () => contentFromLocalStorage("tournaments", []) || []
  );

  const [tournamentsStates, setTournamentsStates] = useState<
    SwissTournamentStates[]
  >(() => contentFromLocalStorage("tournamentsStates", []) || []);

  const generatePaths = (): avatarPath[] => {
    const paths: avatarPath[] = [];
    for (let x = 1; x <= 25; x++) {
      paths.push({pathID: `avatar-${x}`, url: `${import.meta.env.BASE_URL}images/avatars/${x}.png`});
    }
    return paths;
  };

  const avatarPaths: avatarPath[] = generatePaths();

  useEffect(() => {
    contentToLocalStorage("tournaments", tournaments);
    if (
      tournaments.length > 0 &&
      tournaments.length != tournamentsStates?.length
    ) {
      const exisitingStatesIDs: string[] = [];

      tournaments.forEach((tournament) => {
        const states = tournamentsStates?.find((states) => {
          return states.id === getTournamentStatesID(tournament.id);
        });
        if (states) {
          exisitingStatesIDs.push(states.id);
        }
      });

      const existingStateIDSet = new Set(exisitingStatesIDs);
      const filteredtournamentsStates = tournamentsStates.filter((item) =>
        existingStateIDSet.has(item.id)
      );
      setTournamentsStates(filteredtournamentsStates);
      console.log(filteredtournamentsStates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournaments]);

  useEffect(() => {
    contentToLocalStorage("tournamentsStates", tournamentsStates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentsStates]);

  return (
    <AppContext.Provider
      value={{
        tournaments,
        setTournaments,
        tournamentsStates,
        setTournamentsStates,
        avatarPaths
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
