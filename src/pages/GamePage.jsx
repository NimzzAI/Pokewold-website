import SEO from '../components/SEO.jsx';
import GameEngine from '../game/GameEngine.jsx';

export default function GamePage() {
  return (
    <>
      <SEO
        title="Mainkan Game RPG Piksel"
        description="Jelajahi dunia piksel Pokémon klasik, tangkap Pokémon liar dengan data PokeAPI, dan kalahkan Gym Leader di browser Anda!"
      />
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start py-2 sm:py-4">
        <GameEngine />
      </div>
    </>
  );
}
