const Plugin = require('../base/BasePlugin');

module.exports = class Movement extends Plugin {
    constructor(pluginData) {
        super(pluginData, 'playerMove');
        this.titles = new Map();

        setInterval(() => {
            this.updateTitle();
        }, 1000 / 60);
    }

    run(eventData) {
        const playerX = Math.floor(eventData.to.x);
        const playerY = Math.floor(eventData.to.y);
        const playerZ = Math.floor(eventData.to.z);

        const world = this.getApi()
            .getServer()
            .getWorldManager()
            .getDefaultWorld();

        world.getChunkAt(playerX, playerZ, false).then((chunk) => {
            const packet = this.getApi().getServer().getPacketRegistry().getPackets().get(0x58);
            if (!packet)
                return;

            let pk = new packet();
            pk.type = 4;
            pk.text = `§aPlayer §r[§6X§7: ${playerX} §6Y§7: ${playerY} §6Z§7: ${playerZ}§r] §aChunk §r[§6X§7: ${chunk.getX()} §6Z§7: ${chunk.getZ()}§r]`;

            this.titles.set(eventData.getPlayer().getUUID(), {
                connection: eventData.getPlayer().getPlayerConnection(),
                packet: pk
            });
        });
    }

    updateTitle() {
        const onlinePlayers = this.getApi()
            .getServer()
            .getOnlinePlayers();
        for (const [key, value] of this.titles) {
            if (onlinePlayers.some((player) => player.getUUID() === key && player?.debugInfo?.showPos)) {
                value.connection.sendDataPacket(value.packet);
            } else {
                this.titles.delete(key);
            }
        }
    }
};
