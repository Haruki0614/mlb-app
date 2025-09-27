module.exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  try {
    const japanesePlayerIds = ["660271"];

    const players = [];

    for (const id of japanesePlayerIds) {
      const playerStatsRes = await fetch(`https://statsapi.mlb.com/api/v1/people/${id}/stats?stats=season&group=hitting&season=2025`);
      const playerStatsData = await playerStatsRes.json();

      if (!playerStatsData.stats || playerStatsData.stats.length === 0) continue;

      players.push({
        id: id,
        name: playerStatsData.stats[0]?.splits[0]?.player?.fullName || null,
        hits: playerStatsData.stats[0]?.splits[0]?.stat?.hits || 0,
        homeRuns: playerStatsData.stats[0]?.splits[0]?.stat?.homeRuns || 0,
      });
    }
    response.body = JSON.stringify({ players });
  } catch (err) {
    console.error(err);
    response.statusCode = 500;
    response.body = JSON.stringify({ 
      message: "Internal Server Error",
      errorDetails: err.toString(),
    });
  }

  return response;
};


if (require.main === module) {
  module.exports.handler()
    .then((res) => {
      console.log("Lambda Response:", res);
    })
    .catch((err) => {
      console.error("Error:", err);
    });
}