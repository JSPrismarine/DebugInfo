import ConfigBuilder from '@jsprismarine/prismarine/src/config/ConfigBuilder';
import ApiV1 from '@jsprismarine/prismarine/dist/src/plugin/api/versions/1.0/PluginApi';
import Plugin from '../Plugin';

class Config {
    private configBuilder: ConfigBuilder;
    private positionInfoText: string;
    private showPositionInfo: boolean;
    private plugin: Plugin;

    constructor(plugin) {
        this.plugin = plugin;
        this.configBuilder = plugin.getApi().getConfigBuilder('config.yaml');
        this.positionInfoText = this.getConfigBuilder().get(
            'position-info-text',
            `§aPlayer §r[§6X§7: {{playerX}} §6Y§7: {{playerY}} §6Z§7: {{playerZ}}§r] §aChunk §r[§6X§7: {{chunkX}} §6Z§7: {{chunkZ}}§r]\n§aWorld §r[§6Name§7: "{{worldName}}" §aProvider: §7{{provider}}§r]`
        );
        this.showPositionInfo = this.getConfigBuilder().get(
            'show-Position-Info',
            true
        );
    }

    public getPlugin(): Plugin {
        return this.plugin;
    }

    public getApi(): ApiV1 {
        return this.getPlugin().getApi();
    }

    public getConfigBuilder(): ConfigBuilder {
        return this.configBuilder;
    }

    public getPositionInfoText(): string {
        return this.positionInfoText;
    }

    public getShowPositionInfo(): boolean {
        return this.showPositionInfo;
    }
}

export default Config;
