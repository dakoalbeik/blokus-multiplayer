import { ref, type Ref } from "vue";

export const BLOKUS_TILES_PER_ROW = 20;

function getPositionInfo(boardElement: HTMLElement) {
  const { left, top, width, height } = boardElement.getBoundingClientRect();
  return {
    offset: { x: left, y: top },
    size: { width, height },
    tileSize: { width: width / BLOKUS_TILES_PER_ROW, height: height / BLOKUS_TILES_PER_ROW },
  };
}

export type BlokusDomBoard =
  | {
      status: "unmounted";
      mount: () => void;
    }
  | {
      status: "mounted";
      boardElement: HTMLElement;
      layoutInfo: ReturnType<typeof getPositionInfo>;
      getPositionInfo: () => ReturnType<typeof getPositionInfo>;
    };

export function useBlokusDomBoard(): Ref<BlokusDomBoard> {
  const boardRef = ref<BlokusDomBoard>({
    status: "unmounted",
    mount() {
      boardRef.value = builder();
    },
  });

  window.addEventListener("resize", () => {
    if (boardRef.value.status === "mounted") {
      boardRef.value.layoutInfo = boardRef.value.getPositionInfo();
    }
  });

  function builder() {
    const boardElement: HTMLElement | null = document.getElementById("blokus-board");
    if (boardElement === null) {
      throw Error("Failed to find DOM node with id 'blokus-board'");
    }

    const layoutInfo = getPositionInfo(boardElement);

    return {
      status: "mounted",
      boardElement,
      layoutInfo,
      getPositionInfo: () => getPositionInfo(boardElement),
    } as const;
  }

  return boardRef;
}
