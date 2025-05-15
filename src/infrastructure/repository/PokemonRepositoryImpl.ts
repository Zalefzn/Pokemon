import { PokemonRepository } from "@/domain/repositories/PokemonRepository";
import { Pokemon } from "src/domain/models/Pokemon";

export class PokemonRepositoryImpl implements PokemonRepository {
  async getPokemonList(offset: number, limit: number): Promise<Pokemon[]> {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const data = await res.json();
    return data.results;
  }
}