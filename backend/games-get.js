module.exports.handler = async (event) => {
  try {
    const date = event.queryStringParameters.date;

    console.log(`Fetching games for date: ${date}`);

    const res = await fetch(`https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1&date=${date}`);
    const data = await res.json();

    if (!data.dates || data.dates.length === 0) return { statusCode: 404, body: JSON.stringify({ error: "No games found" }) };

    const games = data.dates[0].games.map(game => ({
      id: game.gamePk,
      teams: {
        away: {
          id: game.teams.away.team.id,
          name: game.teams.away.team.name
        },
        home: {
          id: game.teams.home.team.id,
          name: game.teams.home.team.name
        }
      }
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ games })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
        
  }
};