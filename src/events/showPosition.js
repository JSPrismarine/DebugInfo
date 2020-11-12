const Plugin = require('../base/BasePlugin');
const { stripIndent } = require('common-tags');

module.exports = class showPosition extends Plugin {
    constructor(pluginData) {
        super(pluginData, 'playerMove');
        this.titles = new Map();

        setInterval(() => {
            this.updateTitle();
        }, 1000 / 60);
    }

    run(eventData) {
        const playerX = Math.floor(eventData.getTo().getX());
        const playerY = Math.floor(eventData.getTo().getY());
        const playerZ = Math.floor(eventData.getTo().getZ());
        const world = eventData.getPlayer().getWorld();
        const provider = world.getProvider().constructor.name;

        world.getChunkAt(playerX, playerZ, false).then((chunk) => {
            const packet = this.getApi()
                .getServer()
                .getPacketRegistry()
                .getPackets()
                .get(0x58);

            if (!packet) return;

            let pk = new packet();
            pk.type = 4;
            pk.text = stripIndent`
                §aPlayer §r[§6X§7: ${playerX} §6Y§7: ${playerY} §6Z§7: ${playerZ}§r] §aChunk §r[§6X§7: ${chunk.getX()} §6Z§7: ${chunk.getZ()}§r]
                §aWorld §r[§6Name§7: "${world.getName()}" §aProvider: §7${provider}§r]`;

            this.titles.set(eventData.getPlayer().getUUID(), {
                connection: eventData.getPlayer().getConnection(),
                packet: pk,
            });
        });
    }

    updateTitle() {
        const onlinePlayers = this.getApi().getServer().getOnlinePlayers();
        for (const [key, value] of this.titles) {
            if (
                onlinePlayers.some(
                    (player) =>
                        player.getUUID() === key && player?.debugInfo?.showPos
                )
            ) {
                value.connection.sendDataPacket(value.packet);
            } else {
                this.titles.delete(key);
            }
        }
    }
};
