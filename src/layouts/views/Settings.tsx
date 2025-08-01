import {
  Card,
  CardDescription,
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAppContext } from "@/AppContext";
// import { useParams } from 'react-router-dom';

export default function Settings() {
  const { setTournaments, setTournamentsStates } = useAppContext();

  const deleteAllTournaments = () => {
    setTimeout(() => {
      setTournaments([]);
      setTournamentsStates([])
      toast("all tournament data has been deleted.");
    }, 500);
  };

  return (
    <div className="content_page">
      <div>
        <h3>Settings</h3>
        <div className="title_bar_btns_wrapper"></div>
      </div>

      <div>
        <div className="py-3 pr-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-light">
                <h2>Delete All Tournaments</h2>
              </CardTitle>

              <CardDescription className="flex flex-row justify-between items-center">
                <p>
                  Remove all tournament data from the system. This action is
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
                          onClick={() => deleteAllTournaments()}
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
        </div>
      </div>
    </div>
  );
}
