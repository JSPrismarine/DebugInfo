import JspCommand from '@jsprismarine/prismarine/dist/src/command/Command';
import Command from '../base/Command';

class SendPacket extends Command {
    constructor() {
        super(
            new JspCommand({
                id: 'debug-info:send-packet',
                description: 'Send packet to client',
                permission: ''
            })
        );
    }
}

export default SendPacket;
