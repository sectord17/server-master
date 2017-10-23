module.exports = exports = class Game {
    constructor(id, name, ip, port) {
        this.id = id;
        this.name = name;
        this.ip = ip;
        /* Game port */
        this.port = port;
        this.playersCount = 0;
    }

    getInlineDetails() {
        return `#${this.id} ${this.name} <${this.ip}, ${this.port}>`;
    }
};