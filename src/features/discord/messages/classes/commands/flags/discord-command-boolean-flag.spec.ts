import { createMock } from "ts-auto-mock";
import { DiscordCommandFlagTypeEnum } from "../../../enums/commands/discord-command-flag-type.enum";
import { IDiscordCommandFlag } from "../../../interfaces/commands/discord-command-flag";
import { DiscordMessageCommandFeatureNoonFlagEnum } from "../../../services/command/feature/features/noon/enums/discord-message-command-feature-noon-flag.enum";
import { DiscordCommandBooleanFlag } from "./discord-command-boolean-flag";

describe(`DiscordCommandBooleanFlag`, (): void => {
  let discordCommandFlag: DiscordCommandBooleanFlag<DiscordMessageCommandFeatureNoonFlagEnum>;

  describe(`constructor()`, (): void => {
    describe(`when the class is created with a description`, (): void => {
      it(`should update the description inside the class`, (): void => {
        expect.assertions(1);

        discordCommandFlag = new DiscordCommandBooleanFlag<
          DiscordMessageCommandFeatureNoonFlagEnum
        >(
          createMock<
            IDiscordCommandFlag<DiscordMessageCommandFeatureNoonFlagEnum>
          >({
            description: `dummy-description`,
          })
        );

        expect(discordCommandFlag.getDescription()).toStrictEqual(
          `dummy-description`
        );
      });
    });

    describe(`when the class is created with a name`, (): void => {
      it(`should update the name inside the class`, (): void => {
        expect.assertions(1);

        discordCommandFlag = new DiscordCommandBooleanFlag<
          DiscordMessageCommandFeatureNoonFlagEnum
        >(
          createMock<
            IDiscordCommandFlag<DiscordMessageCommandFeatureNoonFlagEnum>
          >({
            name: DiscordMessageCommandFeatureNoonFlagEnum.ENABLED,
          })
        );

        expect(discordCommandFlag.getName()).toStrictEqual(
          DiscordMessageCommandFeatureNoonFlagEnum.ENABLED
        );
      });
    });

    describe(`when the class is created with some shortcuts`, (): void => {
      describe(`when there is no shortcuts`, (): void => {
        it(`should remove the shortcuts inside the class`, (): void => {
          expect.assertions(1);

          discordCommandFlag = new DiscordCommandBooleanFlag<
            DiscordMessageCommandFeatureNoonFlagEnum
          >(
            createMock<
              IDiscordCommandFlag<DiscordMessageCommandFeatureNoonFlagEnum>
            >({
              shortcuts: undefined,
            })
          );

          expect(discordCommandFlag.getShortcuts()).toBeUndefined();
        });
      });

      describe(`when there is some shortcuts`, (): void => {
        it(`should update the shortcuts inside the class`, (): void => {
          expect.assertions(1);

          discordCommandFlag = new DiscordCommandBooleanFlag<
            DiscordMessageCommandFeatureNoonFlagEnum
          >(
            createMock<
              IDiscordCommandFlag<DiscordMessageCommandFeatureNoonFlagEnum>
            >({
              shortcuts: [DiscordMessageCommandFeatureNoonFlagEnum.E],
            })
          );

          expect(discordCommandFlag.getShortcuts()).toStrictEqual([
            DiscordMessageCommandFeatureNoonFlagEnum.E,
          ]);
        });
      });
    });
  });

  describe(`getDescription()`, (): void => {
    beforeEach((): void => {
      discordCommandFlag = new DiscordCommandBooleanFlag<
        DiscordMessageCommandFeatureNoonFlagEnum
      >(
        createMock<
          IDiscordCommandFlag<DiscordMessageCommandFeatureNoonFlagEnum>
        >()
      );
    });

    it(`should return the description`, (): void => {
      expect.assertions(1);
      discordCommandFlag.setDescription(`dummy-description`);

      const result = discordCommandFlag.getDescription();

      expect(result).toStrictEqual(`dummy-description`);
    });
  });

  describe(`setDescription()`, (): void => {
    beforeEach((): void => {
      discordCommandFlag = new DiscordCommandBooleanFlag<
        DiscordMessageCommandFeatureNoonFlagEnum
      >(
        createMock<
          IDiscordCommandFlag<DiscordMessageCommandFeatureNoonFlagEnum>
        >()
      );
    });

    it(`should update the description with the given one`, (): void => {
      expect.assertions(1);

      discordCommandFlag.setDescription(`dummy-description`);

      expect(discordCommandFlag.getDescription()).toStrictEqual(
        `dummy-description`
      );
    });
  });

  describe(`getName()`, (): void => {
    beforeEach((): void => {
      discordCommandFlag = new DiscordCommandBooleanFlag<
        DiscordMessageCommandFeatureNoonFlagEnum
      >(
        createMock<
          IDiscordCommandFlag<DiscordMessageCommandFeatureNoonFlagEnum>
        >()
      );
    });

    it(`should return the name`, (): void => {
      expect.assertions(1);
      discordCommandFlag.setName(
        DiscordMessageCommandFeatureNoonFlagEnum.ENABLED
      );

      const result = discordCommandFlag.getName();

      expect(result).toStrictEqual(
        DiscordMessageCommandFeatureNoonFlagEnum.ENABLED
      );
    });
  });

  describe(`getLowerCaseName()`, (): void => {
    beforeEach((): void => {
      discordCommandFlag = new DiscordCommandBooleanFlag<
        DiscordMessageCommandFeatureNoonFlagEnum
      >(
        createMock<
          IDiscordCommandFlag<DiscordMessageCommandFeatureNoonFlagEnum>
        >()
      );
    });

    it(`should return the lower case name`, (): void => {
      expect.assertions(1);
      discordCommandFlag.setName(
        DiscordMessageCommandFeatureNoonFlagEnum.ENABLED
      );

      const result = discordCommandFlag.getLowerCaseName();

      expect(result).toStrictEqual(`enabled`);
    });
  });

  describe(`setName()`, (): void => {
    beforeEach((): void => {
      discordCommandFlag = new DiscordCommandBooleanFlag<
        DiscordMessageCommandFeatureNoonFlagEnum
      >(
        createMock<
          IDiscordCommandFlag<DiscordMessageCommandFeatureNoonFlagEnum>
        >()
      );
    });

    it(`should update the name with the given one`, (): void => {
      expect.assertions(1);

      discordCommandFlag.setName(
        DiscordMessageCommandFeatureNoonFlagEnum.ENABLED
      );

      expect(discordCommandFlag.getName()).toStrictEqual(
        DiscordMessageCommandFeatureNoonFlagEnum.ENABLED
      );
    });
  });

  describe(`getShortcuts()`, (): void => {
    beforeEach((): void => {
      discordCommandFlag = new DiscordCommandBooleanFlag<
        DiscordMessageCommandFeatureNoonFlagEnum
      >(
        createMock<
          IDiscordCommandFlag<DiscordMessageCommandFeatureNoonFlagEnum>
        >()
      );
    });

    it(`should return the shortcuts`, (): void => {
      expect.assertions(1);
      discordCommandFlag.setShortcuts([
        DiscordMessageCommandFeatureNoonFlagEnum.E,
      ]);

      const result = discordCommandFlag.getShortcuts();

      expect(result).toStrictEqual([
        DiscordMessageCommandFeatureNoonFlagEnum.E,
      ]);
    });
  });

  describe(`getLowerCaseShortcuts()`, (): void => {
    beforeEach((): void => {
      discordCommandFlag = new DiscordCommandBooleanFlag<
        DiscordMessageCommandFeatureNoonFlagEnum
      >(
        createMock<
          IDiscordCommandFlag<DiscordMessageCommandFeatureNoonFlagEnum>
        >()
      );
    });

    it(`should return the shortcuts as lower case`, (): void => {
      expect.assertions(1);
      discordCommandFlag.setShortcuts([
        DiscordMessageCommandFeatureNoonFlagEnum.ENABLED,
        DiscordMessageCommandFeatureNoonFlagEnum.E,
      ]);

      const result = discordCommandFlag.getShortcuts();

      expect(result).toStrictEqual([`enabled`, `e`]);
    });
  });

  describe(`setShortcuts()`, (): void => {
    beforeEach((): void => {
      discordCommandFlag = new DiscordCommandBooleanFlag<
        DiscordMessageCommandFeatureNoonFlagEnum
      >(
        createMock<
          IDiscordCommandFlag<DiscordMessageCommandFeatureNoonFlagEnum>
        >()
      );
    });

    it(`should update the shortcuts with the given one`, (): void => {
      expect.assertions(1);

      discordCommandFlag.setShortcuts([
        DiscordMessageCommandFeatureNoonFlagEnum.E,
      ]);

      expect(discordCommandFlag.getShortcuts()).toStrictEqual([
        DiscordMessageCommandFeatureNoonFlagEnum.E,
      ]);
    });
  });

  describe(`getType()`, (): void => {
    beforeEach((): void => {
      discordCommandFlag = new DiscordCommandBooleanFlag<
        DiscordMessageCommandFeatureNoonFlagEnum
      >(
        createMock<
          IDiscordCommandFlag<DiscordMessageCommandFeatureNoonFlagEnum>
        >()
      );
    });

    it(`should return the type`, (): void => {
      expect.assertions(1);
      discordCommandFlag.setType(DiscordCommandFlagTypeEnum.BOOLEAN);

      const result = discordCommandFlag.getType();

      expect(result).toStrictEqual(DiscordCommandFlagTypeEnum.BOOLEAN);
    });
  });

  describe(`setType()`, (): void => {
    beforeEach((): void => {
      discordCommandFlag = new DiscordCommandBooleanFlag<
        DiscordMessageCommandFeatureNoonFlagEnum
      >(
        createMock<
          IDiscordCommandFlag<DiscordMessageCommandFeatureNoonFlagEnum>
        >()
      );
    });

    it(`should update the type with the given one`, (): void => {
      expect.assertions(1);

      discordCommandFlag.setType(DiscordCommandFlagTypeEnum.BOOLEAN);

      expect(discordCommandFlag.getType()).toStrictEqual(
        DiscordCommandFlagTypeEnum.BOOLEAN
      );
    });
  });

  describe(`getLowerCaseNameAndShortcutsExample()`, (): void => {
    beforeEach((): void => {
      discordCommandFlag = new DiscordCommandBooleanFlag<
        DiscordMessageCommandFeatureNoonFlagEnum
      >(
        createMock<
          IDiscordCommandFlag<DiscordMessageCommandFeatureNoonFlagEnum>
        >({
          name: DiscordMessageCommandFeatureNoonFlagEnum.ENABLED,
        })
      );
    });

    describe(`when the shortcuts are undefined`, (): void => {
      beforeEach((): void => {
        discordCommandFlag.setShortcuts(undefined);
      });

      it(`should return only the lower case name`, (): void => {
        expect.assertions(1);

        const result = discordCommandFlag.getLowerCaseNameAndShortcutsExample();

        expect(result).toStrictEqual(`--enabled`);
      });
    });

    describe(`when there is no shortcuts`, (): void => {
      beforeEach((): void => {
        discordCommandFlag.setShortcuts([]);
      });

      it(`should return only the lower case name`, (): void => {
        expect.assertions(1);

        const result = discordCommandFlag.getLowerCaseNameAndShortcutsExample();

        expect(result).toStrictEqual(`--enabled`);
      });
    });

    describe(`when there is one shortcut`, (): void => {
      beforeEach((): void => {
        discordCommandFlag.setShortcuts([
          DiscordMessageCommandFeatureNoonFlagEnum.E,
        ]);
      });

      it(`should return the lower case name and the shortcut wrapped in parentheses`, (): void => {
        expect.assertions(1);

        const result = discordCommandFlag.getLowerCaseNameAndShortcutsExample();

        expect(result).toStrictEqual(`--enabled (or -e)`);
      });
    });

    describe(`when there is two shortcuts`, (): void => {
      beforeEach((): void => {
        discordCommandFlag.setShortcuts([
          DiscordMessageCommandFeatureNoonFlagEnum.E,
          DiscordMessageCommandFeatureNoonFlagEnum.E,
        ]);
      });

      it(`should return the lower case name and the shortcuts wrapped in parentheses and separator with comma`, (): void => {
        expect.assertions(1);

        const result = discordCommandFlag.getLowerCaseNameAndShortcutsExample();

        expect(result).toStrictEqual(`--enabled (or -e, -e)`);
      });
    });
  });
});