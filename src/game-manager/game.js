module.exports = exports = class Game {
    constructor(id, name, ip, port) {
        this.id = parseInt(id);
        this.name = name;
        this.ip = ip;
        /* Game port */
        this.port = parseInt(port);
        this.playersCount = 0;
        this.status = 0;
    }

    setPlayersCount(count) {
        this.playersCount = parseInt(count);
    }

    setStatus(status) {
        this.status = parseInt(status);
    }

    getInlineDetails() {
        return `#${this.id} ${this.name} <${this.ip}, ${this.port}>`;
    }
};