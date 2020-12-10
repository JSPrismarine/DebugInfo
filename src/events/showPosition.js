const Plugin = require('../base/BasePlugin');

module.exports = class showPosition extends Plugin {
    constructor(pluginData) {
        super(pluginData, 'playerMove');
        this.titles = new Map();

        setInterval(() => {
            this.updateTitle();
        }, 1000 / 60);
    }

    run(eventData) {
        eventData
            .getPlayer()
            .getWorld()
            .getChunkAt(
                eventData.getTo().getX(),
                eventData.getTo().getZ(),
                false
            )
            .then((chunk) => {
                const packet = this.getApi()
                    .getServer()
                    .getPacketRegistry()
                    .getPackets()
                    .get(0x58);

                if (!packet) return;

                const placeholder = {
                    playerX: Math.floor(eventData.getTo().getX()),
                    playerY: Math.floor(eventData.getTo().getY()),
                    playerZ: Math.floor(eventData.getTo().getZ()),
                    chunkX: chunk.getX(),
                    chunkZ: chunk.getZ(),
                    world: eventData.getPlayer().getWorld(),
                    worldName: eventData.getPlayer().getWorld().getName(),
                    provider: eventData.getPlayer().getWorld().getProvider()
                        .constructor.name
                };

                let titleText = this.getPlugin()
                    .getConfig()
                    .getPositionInfoText();

                for (const key in placeholder) {
                    titleText = titleText.replace(
                        new RegExp(`{{${key}}}`, 'gm'),
                        placeholder[key]
                    );
                }

                let pk = new packet();
                pk.type = 4;
                pk.text = titleText;

                this.titles.set(eventData.getPlayer().getUUID(), {
                    connection: eventData.getPlayer().getConnection(),
                    packet: pk
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
