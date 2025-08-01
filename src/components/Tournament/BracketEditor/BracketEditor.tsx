import { Button } from "@/components/ui/button";
import { defaultOnClickFunc } from "../../../utils/types/VariableDefinations";
import "./BracketEditor.css";

export default function BracketEditor(props: {
  bracketID: number;
  toggleEditModeOnClick: defaultOnClickFunc;
  clearSeriesScoresOnClick: defaultOnClickFunc;
  generateNextBracketOnClick: (bracketID: number) => void;
}) {
  const showButtonState: string = props.bracketID === 6 ? "remove" : "";

  return (
    <div
      id={`bracket_${props.bracketID}_editor`}
      className={`bracket_editor hide rounded-full`}
    >
      <Button
        onClick={props.toggleEditModeOnClick}
        title="edit bracket"
        data-id="edit"
        className={`btn1 ${showButtonState}`}
        size="icon"
      >
        <i className="fa-solid fa-pen-clip"></i>
      </Button>

      <Button
        onDoubleClick={props.clearSeriesScoresOnClick}
        title="(double click) clear series scores"
        className={`btn1 ${showButtonState}`}
        size="icon"
      >
        <i className="fa-solid fa-broom"></i>
      </Button>

      <Button
        id={`next_bracket_btn${props.bracketID}`}
        data-direction="right"
        size={`${
          props.bracketID === 6 || props.bracketID === 10 ? "default" : "icon"
        }`}
        onDoubleClick={() => {
          props.generateNextBracketOnClick(props.bracketID);
        }}
        title="(double click) generate next bracket"
      >
        {(() => {
          if (props.bracketID === 6) {
            return <span>playoffs </span>;
          }
          if (props.bracketID === 10) {
            return <span>winner </span>;
          }
        })()}

        {(() => {
          if (props.bracketID === 10) {
            return <i className="fa-solid fa-trophy"></i>;
          } else {
            return <i className="fa-solid fa-angles-right"></i>;
          }
        })()}
      </Button>
    </div>
  );
}
