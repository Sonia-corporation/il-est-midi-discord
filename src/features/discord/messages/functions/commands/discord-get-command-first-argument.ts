import _ from "lodash";
import { IDiscordExtractFromCommandCallbackData } from "../../interfaces/commands/discord-extract-from-command-callback-data";
import { IDiscordGetCommandFirstArgumentData } from "../../interfaces/commands/discord-get-command-first-argument-data";
import { discordExtractFromCommand } from "./discord-extract-from-command";
import { discordGetCommandWithFirstArgumentRegexp } from "./discord-get-command-with-first-argument-regexp";
import { discordGetFormattedMessage } from "./discord-get-formatted-message";
import xregexp, { ExecArray } from "xregexp";

function getFirstArgument({
  command,
  message,
  prefix,
}: Readonly<IDiscordExtractFromCommandCallbackData>): string | null {
  const execArray: ExecArray | null = xregexp.exec(
    message,
    discordGetCommandWithFirstArgumentRegexp({
      command,
      prefix,
    })
  );

  if (!_.isNil(execArray)) {
    return execArray.argument1;
  }

  return null;
}

export function discordGetCommandFirstArgument({
  commands,
  message,
  prefixes,
}: Readonly<IDiscordGetCommandFirstArgumentData>): string | null {
  return discordExtractFromCommand({
    commands,
    finder: getFirstArgument,
    message: discordGetFormattedMessage(message),
    prefixes,
  });
}
