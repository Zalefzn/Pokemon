import { Pokemon } from "../models/Pokemon";

export interface PokemonRepository {
  getPokemonList(offset: number, limit: number): Promise<Pokemon[]>;
}