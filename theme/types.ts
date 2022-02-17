import theme, { colorthemes } from './theme';

export enum ThemesEnum {
  LIGHT = 0,
  DARK = 1,
}

export type themeType = typeof theme &
  typeof colorthemes.light & {
    theme: ThemesEnum;
    [key: string]: any;
  };
