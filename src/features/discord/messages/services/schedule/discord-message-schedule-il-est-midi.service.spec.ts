import { Guild } from "discord.js";
import { createMock } from "ts-auto-mock";
import { ServiceNameEnum } from "../../../../../enums/service-name.enum";
import { CoreEventService } from "../../../../core/services/core-event.service";
import { FirebaseGuildsService } from "../../../../firebase/services/guilds/firebase-guilds.service";
import { DiscordMessageScheduleIlEstMidiService } from "./discord-message-schedule-il-est-midi.service";

describe(`DiscordMessageScheduleIlEstMidiService`, (): void => {
  let service: DiscordMessageScheduleIlEstMidiService;
  let coreEventService: CoreEventService;
  let firebaseGuildsService: FirebaseGuildsService;

  beforeEach((): void => {
    coreEventService = CoreEventService.getInstance();
    firebaseGuildsService = FirebaseGuildsService.getInstance();
  });

  describe(`getInstance()`, (): void => {
    it(`should create a DiscordMessageScheduleIlEstMidi service`, (): void => {
      expect.assertions(1);

      service = DiscordMessageScheduleIlEstMidiService.getInstance();

      expect(service).toStrictEqual(
        expect.any(DiscordMessageScheduleIlEstMidiService)
      );
    });

    it(`should return the created DiscordMessageScheduleIlEstMidi service`, (): void => {
      expect.assertions(1);

      const result = DiscordMessageScheduleIlEstMidiService.getInstance();

      expect(result).toStrictEqual(service);
    });
  });

  describe(`constructor()`, (): void => {
    let coreEventServiceNotifyServiceCreatedSpy: jest.SpyInstance;

    beforeEach((): void => {
      coreEventServiceNotifyServiceCreatedSpy = jest
        .spyOn(coreEventService, `notifyServiceCreated`)
        .mockImplementation();
    });

    it(`should notify the DiscordMessageScheduleIlEstMidi service creation`, (): void => {
      expect.assertions(2);

      service = new DiscordMessageScheduleIlEstMidiService();

      expect(coreEventServiceNotifyServiceCreatedSpy).toHaveBeenCalledTimes(1);
      expect(coreEventServiceNotifyServiceCreatedSpy).toHaveBeenCalledWith(
        ServiceNameEnum.DISCORD_MESSAGE_SCHEDULE_IL_EST_MIDI_SERVICE
      );
    });
  });

  describe(`init()`, (): void => {
    let startScheduleSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = new DiscordMessageScheduleIlEstMidiService();

      startScheduleSpy = jest
        .spyOn(service, `startSchedule`)
        .mockImplementation();
    });

    it(`should start the schedule`, (): void => {
      expect.assertions(2);

      service.init();

      expect(startScheduleSpy).toHaveBeenCalledTimes(1);
      expect(startScheduleSpy).toHaveBeenCalledWith();
    });
  });

  describe(`sendMessage()`, (): void => {
    let guild: Guild;

    let firebaseGuildsServiceGetGuildSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = new DiscordMessageScheduleIlEstMidiService();
      guild = createMock<Guild>({
        id: `dummy-guild-id`,
      });

      firebaseGuildsServiceGetGuildSpy = jest
        .spyOn(firebaseGuildsService, `getGuild`)
        .mockRejectedValue(new Error(`getGuild error`));
    });

    it(`should start the schedule`, async (): Promise<void> => {
      expect.assertions(3);

      await expect(service.sendMessage(guild)).rejects.toThrow(
        new Error(`getGuild error`)
      );

      expect(firebaseGuildsServiceGetGuildSpy).toHaveBeenCalledTimes(1);
      expect(firebaseGuildsServiceGetGuildSpy).toHaveBeenCalledWith(
        `dummy-guild-id`
      );
    });
  });
});
