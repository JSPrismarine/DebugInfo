import JspCommand from '@jsprismarine/prismarine/dist/src/command/Command';
import { CommandDispatcher, literal } from '@jsprismarine/brigadier';
import Command from '../base/Command';
class TogglePosition extends Command {
    constructor() {
        super(
            new JspCommand({
                id: 'debug-info:toggle-position',
                aliases: ['togglepos', 'toggle-pos', 'toggleposition'],
                description: 'Toggle showing position'
            })
        );
    }

    public async register(dispatcher: CommandDispatcher<any>) {
        dispatcher.register(
            literal('togglepos').executes(async (context) => {})
        );
    }
}

export default TogglePosition;
