export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  abilities: string[];
  stats: {
    name: string;
    value: number;
  }[];
  sprites: {
    front_default: string;
    back_default: string;
    other: {
      'official-artwork': string;
    };
  };
}