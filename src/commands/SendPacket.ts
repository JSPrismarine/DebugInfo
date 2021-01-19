import {
    argument,
    CommandDispatcher,
    literal,
    string
} from '@jsprismarine/brigadier';
import Command from '../core/Command';

class SendPacket extends Command {
    constructor() {
        super({
            id: 'debuginfo:sendpacket',
            aliases: ['sp'],
            description: 'Send packet to client'
        });
    }

    public async register(dispatcher: CommandDispatcher<any>) {
        dispatcher.register(
            literal('sendpacket').then(
                argument('target', string()).then(
                    argument('packet', string()).then(
                        argument('packetData', string()).executes(
                            async (context) => {
                                const target = this.getApi()
                                    .getServer()
                                    .getPlayerManager()
                                    .getPlayerByName(
                                        context.getArgument('target')
                                    );

                                if (!target) {
                                    context.getSource();
                                }

                                const packet = this.getApi()
                                    .getServer()
                                    .getPacketRegistry()
                                    .getPackets()
                                    .get(context.getArgument('packet'));

                                const packetData: any = JSON.parse(
                                    context.getArgument('packetData')
                                );

                                let pk = new packet();
                                for (let entry in packetData) {
                                    pk[entry] = packetData[entry];
                                }

                                target.getConnection().sendDataPacket(pk);
                            }
                        )
                    )
                )
            )
        );
    }
}

export default SendPacket;
