import { useNavigate } from "react-router-dom";
// import "../css/views/Home.css";
import { Button } from "@/components/ui/button";
// import { useParams } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const routeToOverview = () => {
    navigate(`/swiss-bracket-manager/overview`);
  };

  const showMore = () => {};

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-y-8">
        <div
          id="logo"
          className="size-70 bg-(--card) rounded-full flex items-center justify-center"
        >
          <svg
            id="Layer_1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 358.6"
          >
            <rect
              x="151.4"
              y="20"
              width="197.2"
              height="318.59"
              rx="12"
              style={{ fill: "#ed1c24" }}
            />
            <rect
              x="151.4"
              y="80.7"
              width="197.2"
              height="197.16"
              style={{ fill: "none" }}
            />
            <path
              d="M94.1,80.7a12,12,0,0,0-12,12v76.6h0v20h0v76.6a12,12,0,0,0,12,12h37.3V80.7Z"
              style={{ fill: "none" }}
            />
            <path
              d="M151.4,326.6a12,12,0,0,0,12,12H336.6a12,12,0,0,0,12-12V297.9H151.4Z"
              style={{ fill: "none" }}
            />
            <path
              d="M348.6,32a12,12,0,0,0-12-12H163.4a12,12,0,0,0-12,12V60.7H348.6Z"
              style={{ fill: "none" }}
            />
            <path
              d="M405.9,277.9a12,12,0,0,0,12-12V189.3h0v-20h0V92.7a12,12,0,0,0-12-12H368.6V277.9Z"
              style={{ fill: "none" }}
            />
            <path
              d="M437.9,169.3V92.7a32.1,32.1,0,0,0-32-32H368.6V32a32.1,32.1,0,0,0-32-32H163.4a32.1,32.1,0,0,0-32,32V60.7H94.1a32.1,32.1,0,0,0-32,32v76.6H0v20H62.1v76.6a32.1,32.1,0,0,0,32,32h37.3v28.7a32.1,32.1,0,0,0,32,32H336.6a32.1,32.1,0,0,0,32-32V297.9h37.3a32.1,32.1,0,0,0,32-32V189.3H500v-20ZM94.1,277.9a12,12,0,0,1-12-12V189.3h0v-20h0V92.7a12,12,0,0,1,12-12h37.3V277.9Zm254.5,48.7a12,12,0,0,1-12,12H163.4a12,12,0,0,1-12-12V32a12,12,0,0,1,12-12H336.6a12,12,0,0,1,12,12V326.6Zm69.3-157.3h0v20h0v76.6a12,12,0,0,1-12,12H368.6V80.7h37.3a12,12,0,0,1,12,12Z"
              style={{ fill: "#fff" }}
            />
            <path
              d="M312.3,159.3H275.7a5.8,5.8,0,0,1-5.7-5.7V117a5.7,5.7,0,0,0-5.7-5.7H235.7A5.7,5.7,0,0,0,230,117v36.6a5.8,5.8,0,0,1-5.7,5.7H187.7A5.7,5.7,0,0,0,182,165v28.6a5.7,5.7,0,0,0,5.7,5.7h36.6A5.8,5.8,0,0,1,230,205v36.6a5.7,5.7,0,0,0,5.7,5.7h28.6a5.7,5.7,0,0,0,5.7-5.7V205a5.8,5.8,0,0,1,5.7-5.7h36.6a5.7,5.7,0,0,0,5.7-5.7V165A5.7,5.7,0,0,0,312.3,159.3Z"
              style={{ fill: "#fff" }}
            />
          </svg>
        </div>
        <div>
          <div className="font-[Bourgeois-Heavy] text-center text-6xl">
            SWISS BRACKET MANAGER
          </div>
          <h3 className="mt-2 text-center text-3xl">
            welcome to the swiss tournament bracket manager
          </h3>
        </div>

        <div className="flex justify-center gap-x-4">
          <Button onClick={routeToOverview}>proceed to tournaments</Button>

          <Button onClick={showMore} variant="outline">
            learn more
          </Button>
        </div>
      </div>

      <div></div>
    </div>
  );
}
