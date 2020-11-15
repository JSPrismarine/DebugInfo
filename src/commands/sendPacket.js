const Plugin = require('../base/BasePlugin');

module.exports = class sendPacket extends Plugin {
    constructor(pluginData) {
        super(pluginData);

        this.getApi()
            .getServer()
            .getCommandManager()
            .registerClassCommand(
                {
                    id: 'debug-info:send-packet',
                    description: 'Send packet to client',
                    flags: 0,
                    aliases: [],
                    execute: (sender, args) => {
                        const target = this.getApi().getServer().getPlayerByName(args[0]);
                        const packet = this.getApi().getServer().getPacketRegistry().getPackets().get(parseInt(args[1]));
                        const data = JSON.parse(args.filter((item, index) => {
                            return index !== 0 && index !== 1;
                        }).join(' '));

                        let pk = new packet();
                        for (let entry in data) {
                            pk[entry] = data[entry];
                        }
                        target.getConnection().sendDataPacket(pk);
                    },
                },
                this.getApi().getServer()
            );
    }
};
