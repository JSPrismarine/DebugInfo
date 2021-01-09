import ApiV1 from '@jsprismarine/prismarine/dist/src/plugin/api/versions/1.0/PluginApi';
import { readdirSync, statSync } from 'fs';
import Command from './base/Command';
import Config from './base/Config';
import Event from './base/Event';
import Path from 'path';

class Plugin {
    private api: any;
    private commands: Map<string, Command> = new Map();
    private events: Map<string, Event> = new Map();
    private config: Config = new Config(this);

    constructor(api) {
        this.api = api;
    }

    private getFiles(folderPath): string[] {
        const entries = readdirSync(folderPath).map((entries) =>
            Path.join(folderPath, entries)
        );
        const dirPath = entries.filter((entry) => statSync(entry).isFile());
        const dirFiles = entries
            .filter((entry) => !dirPath.includes(entry))
            .reduce(
                (entry, entries) => entry.concat(this.getFiles(entries)),
                []
            );
        return [...dirPath, ...dirFiles];
    }

    private loadCommands(filePath): void {
        let commandFiles = this.getFiles(filePath);

        // init commands
        commandFiles.forEach((fileName) => {
            const CommandClass = require(fileName);
            const command = new CommandClass();
            command.onInit(this);
            try {
                this.getApi()
                    .getServer()
                    .getCommandManager()
                    .registerClassCommand(command, this.getApi().getServer());
            } catch (err) {
                this.getApi()
                    .getServer()
                    .getLogger()
                    .warn(`Failed to register command ${command.id}: ${err}`);
                this.getApi().getServer().getLogger().silly(err.stack);
            }
        });
    }

    private loadEvents(filePath): void {
        let eventFiles = this.getFiles(filePath);

        // init events
        eventFiles.forEach((fileName) => {
            const EventClass = require(fileName);
            new EventClass().onInit(this);
        });

        // listen to events
        for (const [key, value] of Object.entries(this.events)) {
            this.api.getEventManager().on(key, (...eventData) => {
                value.forEach((file) => file?.execute(...eventData));
            });
        }
    }

    public onEnable(): void {
        this.loadEvents(__dirname + '/src/events/');
        this.loadCommands(__dirname + '/src/commands/');
        this.api.getLogger().info('ready');
    }

    public onDisable(): void {
        this.api.getLogger().info('disabled');
    }

    public getEvents(): Map<string, Event> {
        return this.events;
    }

    public getCommands(): Map<string, Command> {
        return this.commands;
    }

    public getConfig(): Config {
        return this.config;
    }

    public getApi(): ApiV1 {
        return this.api;
    }
}

export default Plugin;
