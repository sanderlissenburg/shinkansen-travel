import {CommandHandler} from "./command-handler";
import {Command} from "./command";

export class CommandBus {
    private handlers: {[commandName: string]: CommandHandler} = {};

    register(handles: string, commandHandler: CommandHandler): void
    {
        this.handlers[handles] = commandHandler;
    }

    handle(command: Command): void
    {
        if(command.constructor.name in this.handlers) {
            this.handlers[command.constructor.name].handle(command);
        }
    }
}
