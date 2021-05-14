import { DiscordMessageCommandFeatureReleaseNotesConfigService } from './config/discord-message-command-feature-release-notes-config.service';
import { DiscordMessageCommandFeatureReleaseNotesService } from './discord-message-command-feature-release-notes.service';
import { ColorEnum } from '../../../../../../../../../enums/color.enum';
import { IconEnum } from '../../../../../../../../../enums/icon.enum';
import { ServiceNameEnum } from '../../../../../../../../../enums/service-name.enum';
import { CoreEventService } from '../../../../../../../../core/services/core-event.service';
import { DiscordSoniaService } from '../../../../../../../users/services/discord-sonia.service';
import { IDiscordCommandFlagSuccess } from '../../../../../../interfaces/commands/flags/discord-command-flag-success';
import { IDiscordMessageResponse } from '../../../../../../interfaces/discord-message-response';
import { IAnyDiscordMessage } from '../../../../../../types/any-discord-message';
import { IDiscordCommandFlagResponse } from '../../../../../../types/commands/flags/discord-command-flag-response';
import { IDiscordCommandFlagsResponse } from '../../../../../../types/commands/flags/discord-command-flags-response';
import { IDiscordCommandFlagsSuccess } from '../../../../../../types/commands/flags/discord-command-flags-success';
import { DISCORD_MESSAGE_COMMAND_FEATURE_NAMES } from '../../../constants/discord-message-command-feature-names';
import { DiscordMessageCommandFeatureNameEnum } from '../../../enums/discord-message-command-feature-name.enum';
import { DISCORD_MESSAGE_COMMAND_FEATURE_RELEASE_NOTES_FLAGS } from '../constants/discord-message-command-feature-release-notes-flags';
import { EmbedFieldData, MessageEmbedAuthor, MessageEmbedFooter, MessageEmbedThumbnail } from 'discord.js';
import _ from 'lodash';
import moment from 'moment-timezone';
import { createMock } from 'ts-auto-mock';

jest.mock(`../../../../../../../../logger/services/chalk/chalk.service`);

describe(`DiscordMessageCommandFeatureReleaseNotesService`, (): void => {
  let service: DiscordMessageCommandFeatureReleaseNotesService;
  let coreEventService: CoreEventService;
  let discordMessageCommandFeatureReleaseNotesConfigService: DiscordMessageCommandFeatureReleaseNotesConfigService;
  let discordSoniaService: DiscordSoniaService;

  beforeEach((): void => {
    coreEventService = CoreEventService.getInstance();
    discordMessageCommandFeatureReleaseNotesConfigService =
      DiscordMessageCommandFeatureReleaseNotesConfigService.getInstance();
    discordSoniaService = DiscordSoniaService.getInstance();
  });

  describe(`getInstance()`, (): void => {
    it(`should create a DiscordMessageCommandFeatureReleaseNotes service`, (): void => {
      expect.assertions(1);

      service = DiscordMessageCommandFeatureReleaseNotesService.getInstance();

      expect(service).toStrictEqual(expect.any(DiscordMessageCommandFeatureReleaseNotesService));
    });

    it(`should return the created DiscordMessageCommandFeatureReleaseNotes service`, (): void => {
      expect.assertions(1);

      const result = DiscordMessageCommandFeatureReleaseNotesService.getInstance();

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

    it(`should notify the DiscordMessageCommandFeatureReleaseNotes service creation`, (): void => {
      expect.assertions(2);

      service = new DiscordMessageCommandFeatureReleaseNotesService();

      expect(coreEventServiceNotifyServiceCreatedSpy).toHaveBeenCalledTimes(1);
      expect(coreEventServiceNotifyServiceCreatedSpy).toHaveBeenCalledWith(
        ServiceNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_RELEASE_NOTES_SERVICE
      );
    });
  });

  describe(`isReleaseNotesFeature()`, (): void => {
    let featureName: string | DiscordMessageCommandFeatureNameEnum;

    beforeEach((): void => {
      service = new DiscordMessageCommandFeatureReleaseNotesService();
    });

    describe(`when the given feature name is not the release notes feature`, (): void => {
      beforeEach((): void => {
        featureName = `dummy`;
      });

      it(`should return false`, (): void => {
        expect.assertions(1);

        const result = service.isReleaseNotesFeature(featureName);

        expect(result).toStrictEqual(false);
      });
    });

    describe(`when the given feature name is the release notes feature`, (): void => {
      beforeEach((): void => {
        featureName = DiscordMessageCommandFeatureNameEnum.RELEASE_NOTES;
      });

      it(`should return true`, (): void => {
        expect.assertions(1);

        const result = service.isReleaseNotesFeature(featureName);

        expect(result).toStrictEqual(true);
      });
    });

    describe(`when the given feature name is the shortcut release notes feature`, (): void => {
      beforeEach((): void => {
        featureName = DiscordMessageCommandFeatureNameEnum.R;
      });

      it(`should return true`, (): void => {
        expect.assertions(1);

        const result = service.isReleaseNotesFeature(featureName);

        expect(result).toStrictEqual(true);
      });
    });
  });

  describe(`getMessageResponse()`, (): void => {
    let anyDiscordMessage: IAnyDiscordMessage;
    let messageFlags: string;

    let executeAllSpy: jest.SpyInstance;
    let discordSoniaServiceGetCorporationMessageEmbedAuthorSpy: jest.SpyInstance;
    let discordMessageCommandFeatureReleaseNotesConfigServiceGetReleaseNotesConfigImageColor: jest.SpyInstance;
    let discordSoniaServiceGetImageUrlSpy: jest.SpyInstance;
    let discordMessageCommandFeatureReleaseNotesConfigServiceGetReleaseNotesConfigImageUrlSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = new DiscordMessageCommandFeatureReleaseNotesService();
      anyDiscordMessage = createMock<IAnyDiscordMessage>();
      messageFlags = `--enabled=true -e`;

      executeAllSpy = jest
        .spyOn(DISCORD_MESSAGE_COMMAND_FEATURE_RELEASE_NOTES_FLAGS, `executeAll`)
        .mockRejectedValue(new Error(`executeAll error`));
      discordSoniaServiceGetCorporationMessageEmbedAuthorSpy = jest.spyOn(
        discordSoniaService,
        `getCorporationMessageEmbedAuthor`
      );
      discordMessageCommandFeatureReleaseNotesConfigServiceGetReleaseNotesConfigImageColor = jest.spyOn(
        discordMessageCommandFeatureReleaseNotesConfigService,
        `getReleaseNotesConfigImageColor`
      );
      discordSoniaServiceGetImageUrlSpy = jest.spyOn(discordSoniaService, `getImageUrl`);
      discordMessageCommandFeatureReleaseNotesConfigServiceGetReleaseNotesConfigImageUrlSpy = jest.spyOn(
        discordMessageCommandFeatureReleaseNotesConfigService,
        `getReleaseNotesConfigImageUrl`
      );
      jest
        .spyOn(DISCORD_MESSAGE_COMMAND_FEATURE_NAMES, `getRandomArgumentUsageExample`)
        .mockReturnValue(`release-notes`);
    });

    it(`should execute all actions in the given message`, async (): Promise<void> => {
      expect.assertions(3);

      await expect(service.getMessageResponse(anyDiscordMessage, messageFlags)).rejects.toThrow(
        new Error(`executeAll error`)
      );

      expect(executeAllSpy).toHaveBeenCalledTimes(1);
      expect(executeAllSpy).toHaveBeenCalledWith(anyDiscordMessage, messageFlags);
    });

    describe(`when the execution of all actions failed`, (): void => {
      beforeEach((): void => {
        executeAllSpy.mockRejectedValue(new Error(`executeAll error`));
      });

      it(`should throw an error`, async (): Promise<void> => {
        expect.assertions(1);

        await expect(service.getMessageResponse(anyDiscordMessage, messageFlags)).rejects.toThrow(
          new Error(`executeAll error`)
        );
      });
    });

    describe(`when the execution of all actions was successful`, (): void => {
      let discordCommandFlagsResponse: IDiscordCommandFlagsResponse;

      beforeEach((): void => {
        discordCommandFlagsResponse = createMock<IDiscordCommandFlagsResponse>();

        executeAllSpy.mockResolvedValue(discordCommandFlagsResponse);
      });

      describe(`when there is one given success flag`, (): void => {
        let discordCommandFlagsSuccess: IDiscordCommandFlagsSuccess;

        beforeEach((): void => {
          discordCommandFlagsSuccess = [createMock<IDiscordCommandFlagSuccess>()];
          discordCommandFlagsResponse = discordCommandFlagsSuccess;

          executeAllSpy.mockResolvedValue(discordCommandFlagsResponse);
        });

        it(`should return one Discord message response`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result).toHaveLength(1);
        });

        it(`should return a Discord message response embed with an author`, async (): Promise<void> => {
          expect.assertions(1);
          const messageEmbedAuthor: MessageEmbedAuthor = createMock<MessageEmbedAuthor>();
          discordSoniaServiceGetCorporationMessageEmbedAuthorSpy.mockReturnValue(messageEmbedAuthor);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result[0].options.embed?.author).toStrictEqual(messageEmbedAuthor);
        });

        it(`should return a Discord message response embed with a color`, async (): Promise<void> => {
          expect.assertions(1);
          discordMessageCommandFeatureReleaseNotesConfigServiceGetReleaseNotesConfigImageColor.mockReturnValue(
            ColorEnum.DESERT
          );

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result[0].options.embed?.color).toStrictEqual(ColorEnum.DESERT);
        });

        it(`should return a Discord message response embed with a description indicating that one flag was successful`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result[0].options.embed?.description).toStrictEqual(`**1** release notes feature option updated.`);
        });

        it(`should return a Discord message response embed with 1 field`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result[0].options.embed?.fields).toHaveLength(1);
        });

        it(`should return a Discord message response embed with the fields containing the flags success`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result[0].options.embed?.fields?.[0]).toStrictEqual({
            inline: false,
            name: discordCommandFlagsSuccess[0].name,
            value: discordCommandFlagsSuccess[0].description,
          } as EmbedFieldData);
        });

        it(`should return a Discord message response embed with a footer containing an icon and a text`, async (): Promise<void> => {
          expect.assertions(1);
          discordSoniaServiceGetImageUrlSpy.mockReturnValue(`dummy-image-url`);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result[0].options.embed?.footer).toStrictEqual({
            iconURL: `dummy-image-url`,
            text: `Release notes feature successfully updated`,
          } as MessageEmbedFooter);
        });

        describe(`when the Sonia image url is null`, (): void => {
          beforeEach((): void => {
            discordSoniaServiceGetImageUrlSpy.mockReturnValue(null);
          });

          it(`should return a Discord message response embed with a footer but without an icon`, async (): Promise<void> => {
            expect.assertions(1);

            const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

            expect(result[0].options.embed?.footer).toStrictEqual({
              iconURL: undefined,
              text: `Release notes feature successfully updated`,
            } as MessageEmbedFooter);
          });
        });

        describe(`when the Sonia image url is "image-url"`, (): void => {
          beforeEach((): void => {
            discordSoniaServiceGetImageUrlSpy.mockReturnValue(`image-url`);
          });

          it(`should return a Discord message response embed with a footer containing an icon and a text`, async (): Promise<void> => {
            expect.assertions(1);

            const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

            expect(result[0].options.embed?.footer).toStrictEqual({
              iconURL: `image-url`,
              text: `Release notes feature successfully updated`,
            } as MessageEmbedFooter);
          });
        });

        it(`should return a Discord message response embed with a thumbnail`, async (): Promise<void> => {
          expect.assertions(1);
          discordMessageCommandFeatureReleaseNotesConfigServiceGetReleaseNotesConfigImageUrlSpy.mockReturnValue(
            IconEnum.NEW_PRODUCT
          );

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result[0].options.embed?.thumbnail).toStrictEqual({
            url: IconEnum.NEW_PRODUCT,
          } as MessageEmbedThumbnail);
        });

        it(`should return a Discord message response embed with a timestamp`, async (): Promise<void> => {
          expect.assertions(2);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(moment(result[0].options.embed?.timestamp).isValid()).toStrictEqual(true);

          expect(moment(result[0].options.embed?.timestamp).fromNow()).toStrictEqual(`a few seconds ago`);
        });

        it(`should return a Discord message response embed with a title`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result[0].options.embed?.title).toStrictEqual(`Release notes feature updated.`);
        });

        it(`should return a Discord message response not split`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result[0].options.split).toStrictEqual(false);
        });

        it(`should return a Discord message response without a response text`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result[0].response).toStrictEqual(``);
        });
      });

      describe(`when there is three given success flags`, (): void => {
        let discordCommandFlagsSuccess: IDiscordCommandFlagsSuccess;

        beforeEach((): void => {
          discordCommandFlagsSuccess = [
            createMock<IDiscordCommandFlagSuccess>(),
            createMock<IDiscordCommandFlagSuccess>(),
            createMock<IDiscordCommandFlagSuccess>(),
          ];
          discordCommandFlagsResponse = discordCommandFlagsSuccess;

          executeAllSpy.mockResolvedValue(discordCommandFlagsResponse);
        });

        it(`should return one Discord message response`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result).toHaveLength(1);
        });

        it(`should return a Discord message response embed with a description indicating that three errors have been found`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result[0].options.embed?.description).toStrictEqual(`**3** release notes feature options updated.`);
        });

        it(`should return a Discord message response embed with 3 fields`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result[0].options.embed?.fields).toHaveLength(3);
        });

        it(`should return a Discord message response embed with the fields containing the flags success`, async (): Promise<void> => {
          expect.assertions(3);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result[0].options.embed?.fields?.[0]).toStrictEqual({
            inline: false,
            name: discordCommandFlagsSuccess[0].name,
            value: discordCommandFlagsSuccess[0].description,
          } as EmbedFieldData);

          expect(result[0].options.embed?.fields?.[1]).toStrictEqual({
            inline: false,
            name: discordCommandFlagsSuccess[1].name,
            value: discordCommandFlagsSuccess[1].description,
          } as EmbedFieldData);

          expect(result[0].options.embed?.fields?.[2]).toStrictEqual({
            inline: false,
            name: discordCommandFlagsSuccess[2].name,
            value: discordCommandFlagsSuccess[2].description,
          } as EmbedFieldData);
        });

        it(`should return a Discord message response embed with a footer containing an icon and a text`, async (): Promise<void> => {
          expect.assertions(1);
          discordSoniaServiceGetImageUrlSpy.mockReturnValue(`dummy-image-url`);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result[0].options.embed?.footer).toStrictEqual({
            iconURL: `dummy-image-url`,
            text: `Release notes feature successfully updated`,
          } as MessageEmbedFooter);
        });

        describe(`when the Sonia image url is null`, (): void => {
          beforeEach((): void => {
            discordSoniaServiceGetImageUrlSpy.mockReturnValue(null);
          });

          it(`should return a Discord message response embed with a footer but without an icon`, async (): Promise<void> => {
            expect.assertions(1);

            const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

            expect(result[0].options.embed?.footer).toStrictEqual({
              iconURL: undefined,
              text: `Release notes feature successfully updated`,
            } as MessageEmbedFooter);
          });
        });

        describe(`when the Sonia image url is "image-url"`, (): void => {
          beforeEach((): void => {
            discordSoniaServiceGetImageUrlSpy.mockReturnValue(`image-url`);
          });

          it(`should return a Discord message response embed with a footer containing an icon and a text`, async (): Promise<void> => {
            expect.assertions(1);

            const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

            expect(result[0].options.embed?.footer).toStrictEqual({
              iconURL: `image-url`,
              text: `Release notes feature successfully updated`,
            } as MessageEmbedFooter);
          });
        });

        it(`should return a Discord message response embed with a thumbnail`, async (): Promise<void> => {
          expect.assertions(1);
          discordMessageCommandFeatureReleaseNotesConfigServiceGetReleaseNotesConfigImageUrlSpy.mockReturnValue(
            IconEnum.NEW_PRODUCT
          );

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result[0].options.embed?.thumbnail).toStrictEqual({
            url: IconEnum.NEW_PRODUCT,
          } as MessageEmbedThumbnail);
        });

        it(`should return a Discord message response embed with a timestamp`, async (): Promise<void> => {
          expect.assertions(2);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(moment(result[0].options.embed?.timestamp).isValid()).toStrictEqual(true);

          expect(moment(result[0].options.embed?.timestamp).fromNow()).toStrictEqual(`a few seconds ago`);
        });

        it(`should return a Discord message response embed with a title`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result[0].options.embed?.title).toStrictEqual(`Release notes feature updated.`);
        });

        it(`should return a Discord message response not split`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result[0].options.split).toStrictEqual(false);
        });

        it(`should return a Discord message response without a response text`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result[0].response).toStrictEqual(``);
        });
      });

      describe(`when there is one given Discord message response`, (): void => {
        let discordMessageResponse: IDiscordMessageResponse;
        let discordMessageResponses: IDiscordMessageResponse[];

        beforeEach((): void => {
          discordMessageResponse = createMock<IDiscordMessageResponse>();
          discordMessageResponses = [discordMessageResponse];
          discordCommandFlagsResponse = discordMessageResponses;

          executeAllSpy.mockResolvedValue(discordCommandFlagsResponse);
        });

        it(`should return one Discord message response`, async (): Promise<void> => {
          expect.assertions(2);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result).toHaveLength(1);
          expect(result[0]).toStrictEqual(discordMessageResponse);
        });
      });

      describe(`when there is three given Discord message response`, (): void => {
        let discordMessageResponseA: IDiscordMessageResponse;
        let discordMessageResponseB: IDiscordMessageResponse;
        let discordMessageResponseC: IDiscordMessageResponse;
        let discordMessageResponses: IDiscordMessageResponse[];

        beforeEach((): void => {
          discordMessageResponseA = createMock<IDiscordMessageResponse>({
            response: `dummy-response-a`,
          });
          discordMessageResponseB = createMock<IDiscordMessageResponse>({
            response: `dummy-response-b`,
          });
          discordMessageResponseC = createMock<IDiscordMessageResponse>({
            response: `dummy-response-c`,
          });
          discordMessageResponses = [discordMessageResponseA, discordMessageResponseB, discordMessageResponseC];
          discordCommandFlagsResponse = discordMessageResponses;

          executeAllSpy.mockResolvedValue(discordCommandFlagsResponse);
        });

        it(`should return three Discord message response`, async (): Promise<void> => {
          expect.assertions(4);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result).toHaveLength(3);
          expect(result[0]).toStrictEqual(discordMessageResponseA);
          expect(result[1]).toStrictEqual(discordMessageResponseB);
          expect(result[2]).toStrictEqual(discordMessageResponseC);
        });
      });

      describe(`when there is three given success flags and three given Discord message response`, (): void => {
        let discordCommandFlagsSuccess: IDiscordCommandFlagsSuccess;
        let discordMessageResponseA: IDiscordMessageResponse;
        let discordMessageResponseB: IDiscordMessageResponse;
        let discordMessageResponseC: IDiscordMessageResponse;
        let discordMessageResponses: IDiscordMessageResponse[];

        beforeEach((): void => {
          discordCommandFlagsSuccess = [
            createMock<IDiscordCommandFlagSuccess>(),
            createMock<IDiscordCommandFlagSuccess>(),
            createMock<IDiscordCommandFlagSuccess>(),
          ];
          discordMessageResponseA = createMock<IDiscordMessageResponse>({
            response: `dummy-response-a`,
          });
          discordMessageResponseB = createMock<IDiscordMessageResponse>({
            response: `dummy-response-b`,
          });
          discordMessageResponseC = createMock<IDiscordMessageResponse>({
            response: `dummy-response-c`,
          });
          discordMessageResponses = [discordMessageResponseA, discordMessageResponseB, discordMessageResponseC];
          discordCommandFlagsResponse = _.concat<IDiscordCommandFlagResponse>(
            discordMessageResponses,
            discordCommandFlagsSuccess
          );

          executeAllSpy.mockResolvedValue(discordCommandFlagsResponse);
        });

        it(`should return four Discord message response wth the flag success in first`, async (): Promise<void> => {
          expect.assertions(4);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result).toHaveLength(4);
          expect(result[1]).toStrictEqual(discordMessageResponseA);
          expect(result[2]).toStrictEqual(discordMessageResponseB);
          expect(result[3]).toStrictEqual(discordMessageResponseC);
        });

        it(`should return a Discord message response embed with a description indicating that three errors have been found`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result[0].options.embed?.description).toStrictEqual(`**3** release notes feature options updated.`);
        });

        it(`should return a Discord message response embed with 3 fields`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result[0].options.embed?.fields).toHaveLength(3);
        });

        it(`should return a Discord message response embed with the fields containing the flags success`, async (): Promise<void> => {
          expect.assertions(3);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result[0].options.embed?.fields?.[0]).toStrictEqual({
            inline: false,
            name: discordCommandFlagsSuccess[0].name,
            value: discordCommandFlagsSuccess[0].description,
          } as EmbedFieldData);

          expect(result[0].options.embed?.fields?.[1]).toStrictEqual({
            inline: false,
            name: discordCommandFlagsSuccess[1].name,
            value: discordCommandFlagsSuccess[1].description,
          } as EmbedFieldData);

          expect(result[0].options.embed?.fields?.[2]).toStrictEqual({
            inline: false,
            name: discordCommandFlagsSuccess[2].name,
            value: discordCommandFlagsSuccess[2].description,
          } as EmbedFieldData);
        });

        it(`should return a Discord message response embed with a footer containing an icon and a text`, async (): Promise<void> => {
          expect.assertions(1);
          discordSoniaServiceGetImageUrlSpy.mockReturnValue(`dummy-image-url`);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result[0].options.embed?.footer).toStrictEqual({
            iconURL: `dummy-image-url`,
            text: `Release notes feature successfully updated`,
          } as MessageEmbedFooter);
        });

        describe(`when the Sonia image url is null`, (): void => {
          beforeEach((): void => {
            discordSoniaServiceGetImageUrlSpy.mockReturnValue(null);
          });

          it(`should return a Discord message response embed with a footer but without an icon`, async (): Promise<void> => {
            expect.assertions(1);

            const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

            expect(result[0].options.embed?.footer).toStrictEqual({
              iconURL: undefined,
              text: `Release notes feature successfully updated`,
            } as MessageEmbedFooter);
          });
        });

        describe(`when the Sonia image url is "image-url"`, (): void => {
          beforeEach((): void => {
            discordSoniaServiceGetImageUrlSpy.mockReturnValue(`image-url`);
          });

          it(`should return a Discord message response embed with a footer containing an icon and a text`, async (): Promise<void> => {
            expect.assertions(1);

            const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

            expect(result[0].options.embed?.footer).toStrictEqual({
              iconURL: `image-url`,
              text: `Release notes feature successfully updated`,
            } as MessageEmbedFooter);
          });
        });

        it(`should return a Discord message response embed with a thumbnail`, async (): Promise<void> => {
          expect.assertions(1);
          discordMessageCommandFeatureReleaseNotesConfigServiceGetReleaseNotesConfigImageUrlSpy.mockReturnValue(
            IconEnum.NEW_PRODUCT
          );

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result[0].options.embed?.thumbnail).toStrictEqual({
            url: IconEnum.NEW_PRODUCT,
          } as MessageEmbedThumbnail);
        });

        it(`should return a Discord message response embed with a timestamp`, async (): Promise<void> => {
          expect.assertions(2);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(moment(result[0].options.embed?.timestamp).isValid()).toStrictEqual(true);

          expect(moment(result[0].options.embed?.timestamp).fromNow()).toStrictEqual(`a few seconds ago`);
        });

        it(`should return a Discord message response embed with a title`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result[0].options.embed?.title).toStrictEqual(`Release notes feature updated.`);
        });

        it(`should return a Discord message response not split`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result[0].options.split).toStrictEqual(false);
        });

        it(`should return a Discord message response without a response text`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getMessageResponse(anyDiscordMessage, messageFlags);

          expect(result[0].response).toStrictEqual(``);
        });
      });
    });
  });
});
