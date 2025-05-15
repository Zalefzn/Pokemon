'use client';
import Image from "next/image";
import { Pokemon } from "../../domain/models/Pokemon";
import { useEffect, useState } from "react";

export default function PokemonCard({ 
  pokemon, 
  isActive,
  onClick 
}: { 
  pokemon: Pokemon;
  isActive: boolean;
  onClick: () => void;
}) {
  const [isClicked, setIsClicked] = useState(false);
  const id = pokemon.url.split("/").filter(Boolean).pop();
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  const handleClick = () => {
    setIsClicked(true);
    onClick();
  };

  return (
    <div 
      onClick={handleClick}
      data-aos={isClicked ? "" : "fade-up"}
      data-aos-delay={isClicked ? "" : "100"}
      className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-5 text-center hover:-translate-y-1 cursor-pointer ${
        isActive ? 'ring-4 ring-blue-500 bg-blue-50' : ''
      }`}
    >
      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <Image
          src={imageUrl}
          alt={pokemon.name}
          width={96}
          height={96}
          className="object-contain"
          unoptimized
        />
      </div>
      <h3 className="text-lg font-bold text-gray-800 capitalize mb-1">{pokemon.name}</h3>
      <p className="text-sm text-gray-500 font-mono">#{id?.padStart(3, "0")}</p>
    </div>
  );
}