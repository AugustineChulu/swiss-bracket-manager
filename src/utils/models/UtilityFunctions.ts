import {
  bracketContent,
  bracketEditorState,
  bracketKeys,
  defaultBracketContent,
  defaultSeed,
  linkerline,
  Series,
  // stageView,
} from "../types/VariableDefinations";
import { Seed } from "./Seed";

// export function animateIcon(
//   event: React.MouseEvent<HTMLElement>,
//   className: string) {

//     const children = Array.from(event.currentTarget.children);

//     children.forEach(child => {
//         if (child instanceof HTMLDivElement && child.classList.contains('btn_icon_wrapper')) {
//             child.children[0].classList.add(className);

//             setTimeout(() => {
//                 child.children[0].classList.remove(className);
//             }, 2000);
//         }
//     });
// }

export function cycleViews(page: number) {
  const view_wrapper = document.getElementById("view_wrapper") as HTMLElement;
  view_wrapper.style.transform = `translateX(calc(${page} * -100%))`;
}

export function clearLocalStorage() {
  localStorage.clear();
  // animateIcon(e, 'fa-shake');
}

export function contentToLocalStorage<T>(key: string, content: T) {
  localStorage.setItem(key, JSON.stringify(content));
}

export function contentFromLocalStorage<T>(key: string, defaultContent: T): T {
  let result: T = defaultContent;
  try {
    const storedContent = localStorage.getItem(key);

    if (storedContent != null) {
      result = JSON.parse(storedContent) as T;
    }
  } catch (error) {
    const error_msg = `Error retrieving or parsing item: "${key}"`;
    console.error(error_msg, error);
  }
  return result;
}

export function initiateBracketEditorStates(): bracketEditorState[] {
  const array: bracketEditorState[] = [];
  let showState: boolean = false;
  let disabledState: boolean = false;

  for (let x = 0; x < 10; x++) {
    if (x === 0) {
      showState = true;
      disabledState = false;
    } else {
      showState = false;
      disabledState = true;
    }

    const bracketEditorStates: bracketEditorState = {
      bracketID: `bracket_${x + 1}_editor`,
      show: showState,
      disabled: disabledState,
    };
    array.push(bracketEditorStates);
  }
  return array;
}

export function initiateEmptyBrackets(key: string): bracketContent {
  let result: bracketContent = defaultBracketContent;
  const subBracketsArray: (Series | Seed)[][] = [];
  const subBracketDefinitions: { [key: string]: number[] } = {
    [bracketKeys[0]]: [8],
    [bracketKeys[1]]: [4, 4],
    [bracketKeys[2]]: [2, 4, 2],
    [bracketKeys[3]]: [1, 3, 3, 1],
    [bracketKeys[4]]: [1, 3, 1],
    [bracketKeys[5]]: [1, 1],
    [bracketKeys[6]]: [1, 1, 1, 1],
    [bracketKeys[7]]: [1, 1],
    [bracketKeys[8]]: [1, 1],
    [bracketKeys[9]]: [1],
  };

  const subBracketRows = subBracketDefinitions[key];

  if (subBracketRows) {
    for (const rows of subBracketRows) {
      if (rows === 1) {
        let seeds;
        switch (key) {
          case bracketKeys[3]:
            seeds = [defaultSeed, defaultSeed];
            break;
          case bracketKeys[4]:
          case bracketKeys[5]:
            seeds = [defaultSeed, defaultSeed, defaultSeed];
            break;
          default:
            seeds = [{ leftSeed: defaultSeed, rightSeed: defaultSeed }];
        }
        subBracketsArray.push(seeds);
      } else {
        const subBracket: Series[] = [];
        for (let i = 0; i < rows; i++) {
          subBracket.push({ leftSeed: defaultSeed, rightSeed: defaultSeed });
        }
        subBracketsArray.push(subBracket);
      }
    }
  }

  result = { subBrackets: subBracketsArray };
  return result;
}

export function rerenderLinkerLinesOnChange(
  lines: linkerline[],
  socketPairs: { start: string; end: string }[]
) {
  // Function to update all lines safely
  const updateLines = () => {
    lines.forEach((line, index) => {
      const { start, end } = socketPairs[index];

      // Validate that start and end elements still exist before positioning
      const startElement = document.getElementById(start);
      const endElement = document.getElementById(end);

      if (startElement && endElement) {
        line.position();
      }
    });
  };

  window.addEventListener("resize", () => {
    updateLines();
  });

  const targetElements = document.querySelectorAll(".bracket");

  let ticking = false;
  let lastTime = 0;
  const delayFactor = 0.5;

  const resizeObserver = new ResizeObserver((entries) => {
    if (!ticking) {
      const now = performance.now();
      const delay = (1000 / 60) * delayFactor;

      if (now - lastTime >= delay) {
        window.requestAnimationFrame(() => {
          entries.forEach((entry) => {
            entry.target;
            updateLines();
          });
          lastTime = now;
          ticking = false;
        });
        ticking = true;
      }
    }
  });

  targetElements.forEach((element) => {
    resizeObserver.observe(element);
  });
}

export function setBgVisibility(type: "show" | "hide") {
  const bg_img_wrapper = document.getElementById(
    "bg_img_wrapper"
  ) as HTMLDivElement;
  if (type === "show") {
    bg_img_wrapper.classList.add("show_bg_img");
  } else {
    bg_img_wrapper.classList.remove("show_bg_img");
  }
}

export function seedsToSeries(seedsArray: Seed[]): Series[] {
  const seriesArray: Series[] = [];

  for (let x = 0; x < seedsArray.length; x += 2) {
    seriesArray.push({
      leftSeed: seedsArray[x],
      rightSeed: seedsArray[x + 1] || defaultSeed,
    });
  }
  return seriesArray;
}

export function seriesToSeeds(seriesArray: Series[]): Seed[] {
  const seedsArray: Seed[] = [];

  seriesArray.forEach((item) => {
    seedsArray.push(item.leftSeed as Seed);
    seedsArray.push(item.rightSeed as Seed);
  });

  return seedsArray;
}

export function getInputValue(bracketID: number, seedID: number): number {
  const inputDOMELement = document.querySelector(
    `input[data-input-id="Brac${bracketID}-ID${seedID}"]`
  ) as HTMLInputElement;
  // console.log(bracketID, seedID, inputDOMELement);
  return parseInt(inputDOMELement.value, 10) || 0;
}

export function getImg(target: EventTarget & HTMLInputElement) {
  return new Promise((resolve) => {
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      resolve("");
    }
  });
}
