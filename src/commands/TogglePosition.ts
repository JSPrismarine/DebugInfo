import JspCommand from '@jsprismarine/prismarine/dist/src/command/Command';
import { CommandDispatcher, literal } from '@jsprismarine/brigadier';
import Command from '../base/Command';
import ShowPosition from '../events/ShowPosition';
import Player from '@jsprismarine/prismarine/dist/src/player/Player';
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
            literal('togglepos').executes(async (context) => {
                const event = this.getPlugin()
                    .getEvents()
                    .get('playerMove:ShowPosition') as ShowPosition;

                const titleData = event.titles.get(
                    (context.getSource() as Player).getUUID()
                );

                titleData.show = !titleData.show;

                event.titles.set(
                    (context.getSource() as Player).getUUID(),
                    titleData
                );
            })
        );
    }
}

export default TogglePosition;
