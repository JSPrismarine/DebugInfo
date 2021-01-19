import JspCommand from '@jsprismarine/prismarine/dist/src/command/Command';
import ApiV1 from '@jsprismarine/prismarine/dist/src/plugin/api/versions/1.0/PluginApi';
import Plugin from '../Plugin';

interface CommandProps {
    id: string;
    description?: string;
    permission?: string;
    aliases?: string[];
}

class Command extends JspCommand {
    private plugin!: Plugin;
    constructor(command: CommandProps) {
        super(command);
    }

    public getPlugin(): Plugin {
        return this.plugin;
    }

    public getApi(): ApiV1 {
        return this.getPlugin().getApi();
    }

    public onInit(plugin: Plugin) {
        this.plugin = plugin;
        this.getPlugin().getCommands().set(this.id, this);
    }

    public onLoad(): void {}
}

export default Command;
