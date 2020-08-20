import _ from "lodash";
import { IAnyObject } from "../../types/any-object";
import { getInterpolationRegexp } from "./get-interpolation-regexp";

export function replaceInterpolation(
  text: Readonly<string>,
  replacement: Readonly<IAnyObject>
): string {
  return _.reduce(
    replacement,
    (
      updatedText: Readonly<string>,
      value: unknown,
      key: Readonly<string>
    ): string =>
      _.replace(updatedText, getInterpolationRegexp(key), _.toString(value)),
    text
  );
}
