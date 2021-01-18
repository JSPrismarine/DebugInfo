import ApiV1 from '@jsprismarine/prismarine/dist/src/plugin/api/versions/1.0/PluginApi';
import Plugin from '../Plugin';

class Event {
    private plugin?: Plugin;
    private emitter: string;
    public id: string;
    constructor({ id, emitter }: { id: string; emitter: string }) {
        this.emitter = emitter;
        this.id = id;
    }

    public getPlugin(): Plugin {
        return this.plugin;
    }

    public getApi(): ApiV1 {
        return this.getPlugin().getApi();
    }

    public onInit(plugin: Plugin): void {
        this.plugin = plugin;
        this.getPlugin()
            .getEvents()
            .set(`${this.getEmitter()}:${this.id}`, this);
    }

    public onLoad(): void {}

    public getEmitter(): string {
        return this.emitter;
    }
}

export default Event;
