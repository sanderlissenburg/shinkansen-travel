import {CommandHandler} from "./command-handler";
import {Command} from "./command";

export class CommandBus {
    private handlers: {[commandName: string]: CommandHandler} = {};

    register(handles: string, commandHandler: CommandHandler): void
    {
        this.handlers[handles] = commandHandler;
    }

    async handle(command: Command)
    {
        if(command.constructor.name in this.handlers) {
            await this.handlers[command.constructor.name].handle(command);
        } else {
            console.log(`Warning: No Command handler for ${command.constructor.name}`);
        }
    }
}
