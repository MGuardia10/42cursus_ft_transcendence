import type { Match } from "../types/tournament"

export function generateBracket(maxPlayers: number): Match[] {
  const matches: Match[] = []
  const totalRounds = Math.log2(maxPlayers)

  let matchId = 1
  for (let round = 1; round <= totalRounds; round++) {
    const matchesInRound = maxPlayers / Math.pow(2, round)
    for (let position = 0; position < matchesInRound; position++) {
      matches.push({
        id: `match-${matchId}`,
        round,
        position,
      })
      matchId++
    }
  }

  return matches
} 