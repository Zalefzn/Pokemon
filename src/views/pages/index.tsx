/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useMemo } from "react";
import { Pokemon, PokemonDetails } from "src/domain/models/Pokemon";
import { GetPokemonList } from "@/applications/usecases/GetListPokemon";
import { PokemonRepositoryImpl } from "@/infrastructure/repository/PokemonRepositoryImpl";
import PokemonCard from "../components/PokemonCard";
import Image from "next/image";

export default function HomePage() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | null>(
    null
  );
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const useCase = new GetPokemonList(new PokemonRepositoryImpl());
      const data = await useCase.execute(offset, limit);
      setPokemons(data);
      if (allPokemons.length === 0) {
        const allData = await useCase.execute(0, 1000);
        setAllPokemons(allData);
      }
    } catch (error) {
      console.error("Failed to fetch pokemons:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePokemonClick = async (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setIsLoadingDetails(true);
    try {
      const id = pokemon.url.split("/").filter(Boolean).pop();
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
      const data = await response.json();
      setPokemonDetails({
        id: data.id,
        name: data.name,
        height: data.height,
        weight: data.weight,
        types: data.types.map((t: any) => t.type.name),
        abilities: data.abilities.map((a: any) => a.ability.name),
        stats: data.stats.map((s: any) => ({
          name: s.stat.name,
          value: s.base_stat,
        })),
        sprites: {
          front_default: data.sprites.front_default,
          back_default: data.sprites.back_default,
          other: {
            "official-artwork":
              data.sprites.other["official-artwork"].front_default,
          },
        },
      });
      setShowPopup(true);
    } catch (error) {
      console.error("Failed to fetch pokemon details:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [offset, limit]);

  const filteredPokemons = useMemo(() => {
    if (!searchTerm) return pokemons;
    return allPokemons
      .filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, limit);
  }, [searchTerm, pokemons, allPokemons, limit]);

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedPokemon(null);

    const cards = document.querySelectorAll("[data-aos]");
    cards.forEach((card) => {
      card.setAttribute("data-aos", "fade-up");
    });
  };

  const handlePrevious = () => {
    if (offset > 0) setOffset((prev) => Math.max(prev - limit, 0));
  };

  const handleNext = () => setOffset((prev) => prev + limit);

  return (
    <main className="px-6 sm:px-10 lg:px-16 py-10 max-w-7xl mx-auto relative">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
        Pokémon Collection
      </h1>

      <div className="mb-8 max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Limit:</label>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setOffset(0);
              }}
              className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
            >
              {[10, 20, 30, 40, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Offset:</label>
            <select
              value={offset}
              onChange={(e) => setOffset(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
            >
              {Array.from(
                { length: Math.ceil(allPokemons.length / limit) },
                (_, i) => i * limit
              ).map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
            {(searchTerm ? filteredPokemons : pokemons).map((pokemon) => (
              <PokemonCard
                key={pokemon.name}
                pokemon={pokemon}
                isActive={selectedPokemon?.name === pokemon.name}
                onClick={() => handlePokemonClick(pokemon)}
              />
            ))}
          </div>

          {!searchTerm && (
            <div className="flex justify-center gap-6 mt-12">
              <button
                onClick={handlePrevious}
                disabled={offset === 0 || isLoading}
                className={`px-6 py-3 rounded-lg text-white font-semibold transition duration-200 ${
                  offset === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gray-700 hover:bg-gray-800"
                }`}
              >
                ← Previous
              </button>
              <button
                onClick={handleNext}
                disabled={isLoading}
                className={`px-6 py-3 rounded-lg text-white font-semibold transition duration-200 ${
                  isLoading
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {showPopup && (selectedPokemon || pokemonDetails) && (
        <div className="fixed inset-0 bg-gray-500/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleClosePopup}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {isLoadingDetails ? (
              <div className="flex justify-center items-center h-60">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-bold capitalize mb-4">
                  {pokemonDetails?.name || selectedPokemon?.name}
                  <span className="text-gray-500 ml-2 font-normal">
                    #{pokemonDetails?.id.toString().padStart(3, "0")}
                  </span>
                </h2>

                <div className="w-48 h-48 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Image
                    src={
                      pokemonDetails?.sprites.other["official-artwork"] ||
                      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selectedPokemon?.url
                        .split("/")
                        .filter(Boolean)
                        .pop()}.png`
                    }
                    alt={pokemonDetails?.name || selectedPokemon?.name || ""}
                    width={192}
                    height={192}
                    className="object-contain"
                    unoptimized
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Height</p>
                    <p className="font-semibold">
                      {(pokemonDetails?.height || 0) / 10} m
                    </p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-semibold">
                      {(pokemonDetails?.weight || 0) / 10} kg
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center mb-6">
                  <div className="flex flex-col md:flex-row gap-4 w-full max-w-xs md:max-w-none">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 text-center">
                        Types
                      </h3>
                      <div className="flex justify-center gap-2 flex-wrap">
                        {pokemonDetails?.types.map((type) => (
                          <span
                            key={type}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 text-center">
                        Abilities
                      </h3>
                      <div className="flex justify-center gap-2 flex-wrap">
                        {pokemonDetails?.abilities.map((ability) => (
                          <span
                            key={ability}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm capitalize"
                          >
                            {ability}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Stats</h3>
                  <div className="space-y-2">
                    {pokemonDetails?.stats.map((stat) => (
                      <div key={stat.name} className="text-left">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {stat.name.replace("-", " ")}
                          </span>
                          <span className="text-sm font-semibold">
                            {stat.value}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${Math.min(100, stat.value)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
