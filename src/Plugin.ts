import ApiV1 from '@jsprismarine/prismarine/dist/src/plugin/api/versions/1.0/PluginApi';
import { readdirSync, statSync } from 'fs';
import Command from './core/Command';
import JspCommand from '@jsprismarine/prismarine/dist/src/command/Command';
import Config from './core/Config';
import Event from './core/Event';
import Path from 'path';

class Plugin {
    private api: any;
    private commands: Map<string, Command> = new Map();
    private events: Map<string, Event> = new Map();
    private config: Config;

    constructor(api: ApiV1) {
        this.api = api;
        this.config = new Config(this);
    }

    private getFiles(folderPath: string): string[] {
        const entries = readdirSync(folderPath).map((entries) =>
            Path.join(folderPath, entries)
        );
        const dirPath = entries.filter((entry) => statSync(entry).isFile());
        const dirFiles = entries
            .filter((entry) => !dirPath.includes(entry))
            .reduce(
                (entry, entries) => entry.concat(this.getFiles(entries) as any),
                []
            );
        return [...dirPath, ...dirFiles];
    }

    private async loadCommands(filePath: string): Promise<void> {
        let commandFiles = this.getFiles(filePath);

        // init commands
        commandFiles.forEach(async (fileName) => {
            const CommandClass = require(fileName).default;

            try {
                const command = new CommandClass();
                command.onInit(this);

                try {
                    await this.getApi()
                        .getServer()
                        .getCommandManager()
                        .registerClassCommand(
                            command as JspCommand,
                            this.getApi().getServer()
                        );
                } catch (error) {
                    this.getApi()
                        .getServer()
                        .getLogger()
                        .warn(
                            `Failed to register command ${command.id}: ${error}`
                        );
                    this.getApi().getServer().getLogger().silly(error.stack);
                }
            } catch (error) {
                this.getApi()
                    .getLogger()
                    .warn(`Could't load command file: ${fileName}`);
                this.getApi().getServer().getLogger().silly(error.stack);
            }
        });
    }

    private loadEvents(filePath: string): void {
        let eventFiles = this.getFiles(filePath);

        // init events
        eventFiles.forEach((fileName) => {
            const EventClass = require(fileName).default;
            try {
                new EventClass().onInit(this);
            } catch (error) {
                this.getApi()
                    .getLogger()
                    .warn(`Could't load event file: ${fileName}`);
            }
        });

        // listen to events
        for (const [key, value] of Object.entries(this.events)) {
            this.api.getEventManager().on(key, (...eventData: any) => {
                value.forEach((file: Event) => file?.execute(eventData));
            });
        }
    }

    public onEnable(): void {
        this.loadEvents(__dirname + '/events/');
        this.loadCommands(__dirname + '/commands/');
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
