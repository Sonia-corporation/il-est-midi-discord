import { Guild, GuildChannel } from "discord.js";
import _ from "lodash";
import { AbstractService } from "../../../../classes/abstract.service";
import { ServiceNameEnum } from "../../../../enums/service-name.enum";
import { wrapInQuotes } from "../../../../functions/formatters/wrap-in-quotes";
import { ChalkService } from "../../../logger/services/chalk/chalk.service";
import { LoggerService } from "../../../logger/services/logger.service";
import { isDiscordGuildChannel } from "../../channels/functions/is-discord-guild-channel";
import { isDiscordGuildChannelWritable } from "../../channels/functions/types/is-discord-guild-channel-writable";
import { DiscordChannelGuildService } from "../../channels/services/discord-channel-guild.service";
import { DiscordLoggerErrorService } from "../../logger/services/discord-logger-error.service";
import { IDiscordMessageResponse } from "../../messages/interfaces/discord-message-response";
import { DiscordMessageCommandCookieService } from "../../messages/services/command/cookie/discord-message-command-cookie.service";
import { DiscordClientService } from "../../services/discord-client.service";
import { DiscordGuildSoniaChannelNameEnum } from "../enums/discord-guild-sonia-channel-name.enum";
import { DiscordGuildConfigService } from "./config/discord-guild-config.service";
import { DiscordGuildSoniaService } from "./discord-guild-sonia.service";

export class DiscordGuildCreateService extends AbstractService {
  private static _instance: DiscordGuildCreateService;

  public static getInstance(): DiscordGuildCreateService {
    if (_.isNil(DiscordGuildCreateService._instance)) {
      DiscordGuildCreateService._instance = new DiscordGuildCreateService();
    }

    return DiscordGuildCreateService._instance;
  }

  private readonly _discordClientService: DiscordClientService = DiscordClientService.getInstance();
  private readonly _loggerService: LoggerService = LoggerService.getInstance();
  private readonly _discordChannelGuildService: DiscordChannelGuildService = DiscordChannelGuildService.getInstance();
  private readonly _discordGuildConfigService: DiscordGuildConfigService = DiscordGuildConfigService.getInstance();
  private readonly _discordMessageCommandCookieService: DiscordMessageCommandCookieService = DiscordMessageCommandCookieService.getInstance();
  private readonly _chalkService: ChalkService = ChalkService.getInstance();
  private readonly _discordGuildSoniaService: DiscordGuildSoniaService = DiscordGuildSoniaService.getInstance();
  private readonly _discordLoggerErrorService: DiscordLoggerErrorService = DiscordLoggerErrorService.getInstance();

  public constructor() {
    super(ServiceNameEnum.DISCORD_GUILD_CREATE_SERVICE);
  }

  public init(): void {
    this._listen();
  }

  public sendMessage(guild: Readonly<Guild>): void {
    if (this._canSendMessage()) {
      const primaryGuildChannel: GuildChannel | null = this._discordChannelGuildService.getPrimary(
        guild
      );

      if (isDiscordGuildChannel(primaryGuildChannel)) {
        return this._sendMessage(primaryGuildChannel);
      }
    }
  }

  public addFirebaseGuild(guild: Readonly<Guild>): void {
    console.log(guild);
  }

  private _listen(): void {
    this._discordClientService
      .getClient()
      .on(`guildCreate`, (guild: Readonly<Guild>): void => {
        this._loggerService.debug({
          context: this._serviceName,
          message: this._chalkService.text(
            `${wrapInQuotes(`guildCreate`)} event triggered`
          ),
        });

        this.sendMessage(guild);
        this.addFirebaseGuild(guild);
      });

    this._loggerService.debug({
      context: this._serviceName,
      message: this._chalkService.text(
        `listen ${wrapInQuotes(`guildCreate`)} event`
      ),
    });
  }

  private _canSendMessage(): boolean {
    if (this._discordGuildConfigService.shouldSendCookiesOnCreate()) {
      return true;
    }

    this._loggerService.debug({
      context: this._serviceName,
      message: this._chalkService.text(
        `guild create cookies message sending disabled`
      ),
    });

    return false;
  }

  private _sendMessage(guildChannel: Readonly<GuildChannel>): Promise<void> {
    if (isDiscordGuildChannelWritable(guildChannel)) {
      const messageResponse: IDiscordMessageResponse = this._getMessageResponse();

      this._loggerService.debug({
        context: this._serviceName,
        message: this._chalkService.text(
          `sending message for the guild create...`
        ),
      });

      return guildChannel
        .send(messageResponse.response, messageResponse.options)
        .then((): void => {
          this._loggerService.log({
            context: this._serviceName,
            message: this._chalkService.text(
              `cookies message for the create guild sent`
            ),
          });
        })
        .catch((error: Readonly<Error | string>): void => {
          this._loggerService.error({
            context: this._serviceName,
            message: this._chalkService.text(
              `cookies message sending for the create guild failed`
            ),
          });
          this._loggerService.error({
            context: this._serviceName,
            message: this._chalkService.error(error),
          });
          this._discordGuildSoniaService.sendMessageToChannel({
            channelName: DiscordGuildSoniaChannelNameEnum.ERRORS,
            messageResponse: this._discordLoggerErrorService.getErrorMessageResponse(
              error
            ),
          });
        });
    }

    this._loggerService.debug({
      context: this._serviceName,
      message: this._chalkService.text(`the guild channel is not writable`),
    });

    return Promise.reject(new Error(`Guild channel is not writable`));
  }

  private _getMessageResponse(): IDiscordMessageResponse {
    return this._discordMessageCommandCookieService.getMessageResponse();
  }
}
