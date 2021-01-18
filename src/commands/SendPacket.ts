import JspCommand from '@jsprismarine/prismarine/dist/src/command/Command';
import { argument, CommandDispatcher, literal } from '@jsprismarine/brigadier';
import Command from '../base/Command';
import { CommandArgumentEntity } from '@jsprismarine/prismarine/dist/src/command/CommandArguments';
class SendPacket extends Command {
    constructor() {
        super(
            new JspCommand({
                id: 'debug-info:send-packet',
                aliases: ['sp', 'sendpacket'],
                description: 'Send packet to client'
            })
        );
    }

    public async register(dispatcher: CommandDispatcher<any>) {
        dispatcher.register(
            literal('sendpacket').then(
                argument('target', new CommandArgumentEntity()).then(
                    argument('packet', new CommandArgumentEntity()).then(
                        argument(
                            'packetData',
                            new CommandArgumentEntity()
                        ).executes(async (context) => {
                            const target = this.getApi()
                                .getServer()
                                .getPlayerManager()
                                .getPlayerByName(context.getArgument('target'));

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
                        })
                    )
                )
            )
        );
    }
}

export default SendPacket;
