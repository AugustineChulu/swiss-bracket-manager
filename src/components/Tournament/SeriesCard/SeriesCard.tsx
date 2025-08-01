import { Seed } from "@/utils/models/Seed";
import "./SeriesCard.css";

function SeriesCard(props: {
  bracketID: number;
  sub_bracket: number;
  stage: string;
  left_seed: Seed | null;
  right_seed: Seed | null;
  seed_list: Seed[] | null;
}) {
  if (props.left_seed && props.right_seed) {
    const leftScore = props.left_seed.seriesScores[props.bracketID - 1];
    const rightScore = props.right_seed.seriesScores[props.bracketID - 1];
    // console.log('lef scores: ', props.left_seed.seriesScores)
    return (
      <div
        className={`${props.stage}_series_card ${
          props.left_seed.id == 0 && props.right_seed.id == 0 ? "hide" : ""
        }`}
      >
        <div title={props.left_seed.name}>
          {props.left_seed.avatar.pathID != "" ? (
            <img
              alt={`${props.left_seed.name} avatar`}
              src={props.left_seed.avatar.url}
              className="avatar_image"
            />
          ) : (
            props.left_seed?.initials
          )}
        </div>

        <input
          title="left seed series score"
          name={`Brac${props.bracketID}-subBrac${props.sub_bracket}-ID${props.left_seed.id}`}
          type="number"
          min={0}
          max={99}
          placeholder="-"
          data-input-id={`Brac${props.bracketID}-ID${props.left_seed.id}`}
          required
          disabled
          // defaultValue={getScore(props.left_seed.id, props.bracketID - 1)}
          defaultValue={leftScore === -1 ? "" : leftScore}
        />

        {(() => {
          if (props.stage == "playoffs") {
            return <div>{props.left_seed.name}</div>;
          }
        })()}

        {(() => {
          if (props.stage == "swiss") {
            return <div className="versus_txt">VS</div>;
          }
        })()}

        {(() => {
          if (props.stage == "playoffs") {
            return <div>{props.right_seed.name}</div>;
          }
        })()}

        <input
          title="right seed series score"
          name={`Brac${props.bracketID}-subBrac${props.sub_bracket}-ID${props.right_seed.id}`}
          type="number"
          min={0}
          max={99}
          placeholder="-"
          data-input-id={`Brac${props.bracketID}-ID${props.right_seed.id}`}
          required
          disabled
          // defaultValue={getScore(props.right_seed.id, props.bracketID - 1)}
          defaultValue={rightScore === -1 ? "" : rightScore}
        />

        <div title={props.right_seed.name}>
          {props.right_seed.avatar.pathID != "" ? (
            <img
              alt={`${props.right_seed.name} avatar`}
              src={props.right_seed.avatar.url}
              className="avatar_image"
            />
          ) : (
            props.right_seed?.initials
          )}
        </div>
      </div>
    );
  } else if (props.seed_list != null && props.seed_list.length > 0) {
    return (
      <div className={`seed_list`}>
        {props.seed_list?.map((seed, index) => (
          <div
            title={seed.name}
            key={index}
            className={`${seed.id == 0 ? "hide" : ""}`}
          >
            {seed.avatar.pathID != "" ? (
              <img
                alt={`${seed.name} avatar`}
                src={seed.avatar.url}
                className="avatar_image"
              />
            ) : (
              seed.initials
            )}
          </div>
        ))}
      </div>
    );
  }
}
export default SeriesCard;
