/**
 * @param {Game} game
 */
module.exports = game => {
    return {
        id: game.id,
        name: game.name,
        players_count: game.playersCount,
        status: game.status
    };
};
