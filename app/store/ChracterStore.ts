import { create } from "zustand";
import { randomIntFromInterval } from "../util/RandomUtil";

interface Character {
  id: number;
  pokemonId: number;
  position: {
    x: number;
    y: number;
  };
  isMoving: boolean;
}

interface CountStoreState {
  count: number;
  getAndIncrease: () => number;
}

const useCountStore = create<CountStoreState>((set, get) => ({
  count: 0,
  getAndIncrease: () => {
    const value = get().count;
    set((state) => ({ count: state.count + 1 }));
    return value;
  },
}));

// 상태 타입 정의
interface CharacterStoreState {
  characters: Character[];
  addCharacter: () => void;
  updateCharacter: (id: number, updatedFields: Partial<Character>) => void;
}

export const useCharacterStore = create<CharacterStoreState>((set) => ({
  characters: [],
  addCharacter: () => {
    const { getAndIncrease } = useCountStore.getState();
    const count = getAndIncrease();

    set((state) => ({
      characters: [
        ...state.characters,
        {
          id: count,
          pokemonId: randomIntFromInterval(1, 1025),
          position: { x: 0, y: 0 },
          isMoving: false,
        },
      ],
    }));
  },
  updateCharacter: (id, updatedFields) =>
    set((state) => ({
      characters: state.characters.map((character) =>
        character.id === id ? { ...character, ...updatedFields } : character
      ),
    })),
}));
