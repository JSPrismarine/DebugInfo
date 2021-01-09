import DataPacket from '@jsprismarine/prismarine/dist/src/network/packet/DataPacket';
import PlayerConnection from '@jsprismarine/prismarine/dist/src/player/PlayerConnection';
import Event from '../base/Event';

interface Title {
    connection: PlayerConnection;
    packet: DataPacket;
    show: boolean;
}
class ShowPosition extends Event {
    public titles: Map<string, Title> = new Map();
    constructor() {
        super({ id: 'ShowPosition', emitter: 'playerMove' });
        setInterval(() => {
            this.updateTitle();
        }, 1000 / 60);
    }

    public execute(eventData): void {
        const packet = this.getApi()
            .getServer()
            .getPacketRegistry()
            .getPackets()
            .get(0x58);

        this.formatTitle(
            eventData,
            this.getPlugin().getConfig().getPositionInfoText()
        ).then((title) => {
            let pk = new packet();
            pk.type = 4;
            pk.text = title;

            this.titles.set(eventData.getPlayer().getUUID(), {
                connection: eventData.getPlayer().getConnection(),
                packet: pk,
                show: this.getPlugin().getConfig().getShowPositionInfo()
            });
        });
    }

    private updateTitle() {
        for (const [key, value] of this.titles) {
            if (value.show) {
                value.connection.sendDataPacket(value.packet);
            } else {
                this.titles.delete(key);
            }
        }
    }

    private formatTitle(eventData: any, title: string): Promise<string> {
        return new Promise((resolve, reject) => {
            eventData
                .getPlayer()
                .getWorld()
                .getChunkAt(
                    eventData.getTo().getX(),
                    eventData.getTo().getZ(),
                    false
                )
                .then((chunk) => {
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

                    for (const key in placeholder) {
                        title = title.replace(
                            new RegExp(`{{${key}}}`, 'gm'),
                            placeholder[key]
                        );
                    }

                    resolve(title);
                });
        });
    }
}

export default ShowPosition;
