export const handler = async (event) => {
  try {
    const japanesePlayerIds = ["660271", "808967"];

    const players = [];

    for (const id of japanesePlayerIds) {
      const res = await fetch(`https://statsapi.mlb.com/api/v1/people/${id}`);
      const playerStatsRes = await fetch(`https://statsapi.mlb.com/api/v1/people/${id}/stats?stats=season&group=pitching&season=2025`);
      const data = await res.json();
      const playerStatsData = await playerStatsRes.json();

      if (!data.people || data.people.length === 0) continue;

      const player = data.people[0];
      players.push({
        id: player.id,
        name: player.fullName,
        stats: playerStatsData.stats || []
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ players })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
