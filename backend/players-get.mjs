export const handler = async (event) => {
  try {
    const japanesePlayerIds = ["660271"]; // 大谷選手

    const players = [];

    for (const id of japanesePlayerIds) {
      const res = await fetch(`https://statsapi.mlb.com/api/v1/people/${id}`);
      const data = await res.json();

      if (!data.people || data.people.length === 0) continue;

      const player = data.people[0];
      players.push({
        id: player.id,
        name: player.fullName,
        team: player.currentTeam ? player.currentTeam.abbreviation : "N/A"
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
