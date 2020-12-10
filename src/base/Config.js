module.exports = class Config {
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

    getConfigBuilder() {
        return this.configBuilder;
    }

    getPlugin() {
        return this.plugin;
    }

    getPositionInfoText() {
        return this.positionInfoText;
    }

    getShowPositionInfo() {
        return this.showPositionInfo;
    }
};
