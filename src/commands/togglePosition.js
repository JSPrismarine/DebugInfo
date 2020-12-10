const Plugin = require('../base/BasePlugin');

module.exports = class togglePosition extends (
    Plugin
) {
    constructor(pluginData) {
        super(pluginData);

        this.getApi()
            .getServer()
            .getCommandManager()
            .registerClassCommand(
                {
                    id: 'debug-info:toggle-pos',
                    description: 'Toggle showing position',
                    flags: 0,
                    aliases: [],
                    execute: (sender) => {
                        if (!sender.debugInfo) sender.debugInfo = {};

                        sender.debugInfo.showPos = !sender.debugInfo.showPos;
                    }
                },
                this.getApi().getServer()
            );
    }
};
