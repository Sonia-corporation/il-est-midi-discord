import { IAnyDiscordMessage } from "../../../types/any-discord-message";
import { IDiscordCommandFlagResponse } from "../../../types/commands/flags/discord-command-flag-response";
import { DiscordCommandFlags } from "./discord-command-flags";

export abstract class DiscordCommandFlagActionValueless<T extends string> {
  public abstract execute: (
    anyDiscordMessage: Readonly<IAnyDiscordMessage>,
    value: string | null | undefined,
    discordCommandFlags: Readonly<DiscordCommandFlags<T>>
  ) => Promise<IDiscordCommandFlagResponse>;
}
