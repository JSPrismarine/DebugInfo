const { readdirSync, statSync } = require('fs');
const Path = require('path');

class JoinMessage {
    constructor(api) {
        this.api = api;
        this.events = {};
        this.commands = {};
        this.loadEvents(__dirname + '/src/events/');
        //this.loadEvents(__dirname + '/src/commands/');
    }

    loadCommands(filePath) {
        let commandFiles = this.getFiles(filePath);
        return;
    }

    loadEvents(filePath) {
        let eventFiles = this.getFiles(filePath);

        eventFiles.forEach((fileName) => {
            const EventClass = require(fileName);
            const event = new EventClass(this);
            this.events[event.emitter] = this.events[event.emitter] ? [...this.events[event.emitter], event] : [event];
        });

        for (const [key, value] of Object.entries(this.events)) {
            this.api.getEventManager().on(key, (...eventData) => {
                value.forEach((file) => file?.run(...eventData));
            });
        }
        return;
    }

    onEnable() {
        this.api.getLogger().info('ready');
    }

    onDisable() {
        this.api.getLogger().info('disabled');
    }

    getFiles(folderPath) {
        const entries = readdirSync(folderPath).map((entries) => Path.join(folderPath, entries));
        const dirPath = entries.filter((entry) => statSync(entry).isFile());
        const dirFiles = entries.filter((entry) => !dirPath.includes(entry)).reduce((entry, entries) => entry.concat(this.getFiles(entries)), []);
        return [...dirPath, ...dirFiles];
    }
}

module.exports.default = JoinMessage;
