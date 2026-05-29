import SpaceShooterGame from "@/game/SpaceShooterGame";

export default async function GamePage({ searchParams }) {
  const params = await searchParams;
  const parsedLevel = Number(params?.level ?? 1);
  const initialLevel = Number.isFinite(parsedLevel) ? parsedLevel : 1;

  return <SpaceShooterGame initialLevel={initialLevel} />;
}
