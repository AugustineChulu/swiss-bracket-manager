import { Seed } from "@/utils/models/Seed";
import { Input } from "../ui/input";
import "./SeedPreviewCard.css";
import { Popover, PopoverContent } from "../ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { avatarPath } from "@/utils/types/VariableDefinations";
import { Button } from "../ui/button";

export default function SeedPreviewCard(props: {
  seed: Seed;
  avatars: avatarPath[];
  eventHandlers: {
    selectAvatarHandler: (seedID: number, avatar: avatarPath) => void;
    removeAvatarHandler: (seedID: number) => void;
  };
}) {
  return (
    <div className="seed_preview_card">
      <div className="rank_card">
        <span>SEED &ensp;</span>

        <span className="rank_value">{props.seed.id}</span>
      </div>

      <div className="seed_details_wrapper">
        <div>
          <label
            htmlFor={`seed${props.seed.id}_initials`}
            // className="text-xs"
          >
            initials
          </label>
          <Input
            id={`seed${props.seed.id}_initials`}
            className="seed_initials"
            title={`must be 3 uppercase characters`}
            name={`seed${props.seed.id}_initials`}
            type="text"
            required
            maxLength={3}
            pattern="[A-Z]{3}"
            defaultValue={props.seed.initials}
          />
        </div>

        <div>
          <label
            htmlFor={`seed${props.seed.id}_name`}
            // className="text-sm"
          >
            name
          </label>
          <Input
            id={`seed${props.seed.id}_name`}
            name={`seed${props.seed.id}_name`}
            type="text"
            required
            defaultValue={props.seed ? props.seed?.name : ""}
          />
        </div>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <div className="seed_avatar_wrapper">
            <img
              alt={`seed${props.seed.id} avatar`}
              id={`seed${props.seed.id}_avatar`}
              src={props.seed?.avatar.url}
              className="seed_avatar"
            ></img>

            {props.seed.avatar.pathID != "" ? (
              <Button
                type="button"
                title="remove avatar"
                onClick={() => {
                  props.eventHandlers.removeAvatarHandler(props.seed.id);
                }}
                size="icon"
                className="remove_seed_avatar_btn"
              >
                <i className="fa-solid fa-xmark"></i>
              </Button>
            ) : null}
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <div className="avatarWrapper max-w-sm flex flex-wrap justify-center gap-4">
            {(() => {
              const avartarsWrapper: JSX.Element[] = [];
              props.avatars.forEach((avatar, index) => {
                avartarsWrapper.push(
                  <img
                    key={index}
                    alt={`avatar ${avatar.pathID}`}
                    src={avatar.url}
                    className="size-14 rounded-sm cursor-pointer"
                    onClick={() => {
                      props.eventHandlers.selectAvatarHandler(props.seed.id, {
                        pathID: avatar.pathID,
                        url: avatar.url,
                      });
                    }}
                  />
                );
              });
              return avartarsWrapper;
            })()}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
