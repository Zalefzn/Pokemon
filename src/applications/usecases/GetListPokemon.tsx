import { PokemonRepository } from "@/domain/repositories/PokemonRepository";
import { Pokemon } from "src/domain/models/Pokemon";

export class GetPokemonList {
  constructor(private repo: PokemonRepository) {}

  async execute(offset: number, limit: number): Promise<Pokemon[]> {
    return await this.repo.getPokemonList(offset, limit);
  }
}