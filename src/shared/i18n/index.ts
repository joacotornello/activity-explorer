import en from './locales/en.json';

export const defaultLocale = 'en' as const;

export type TranslationValue = string | number;
export type TranslationValues = Record<string, TranslationValue>;
export type TranslationDictionary = {
  readonly [key: string]: string | TranslationDictionary;
};

type JoinKey<
  TPrefix extends string,
  TSegment extends string,
> = TPrefix extends '' ? TSegment : `${TPrefix}.${TSegment}`;

export type TranslationKey<
  TDictionary,
  TPrefix extends string = '',
> = TDictionary extends TranslationDictionary
  ? {
      [TSegment in keyof TDictionary & string]: TDictionary[TSegment] extends string
        ? JoinKey<TPrefix, TSegment>
        : TDictionary[TSegment] extends TranslationDictionary
          ? TranslationKey<TDictionary[TSegment], JoinKey<TPrefix, TSegment>>
          : never;
    }[keyof TDictionary & string]
  : never;

type TranslatorOptions = {
  locale?: string;
};

const placeholderExpression = /{{\s*(\w+)\s*}}/g;

const isTranslationDictionary = (
  value: string | TranslationDictionary | undefined,
): value is TranslationDictionary =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const resolveTranslation = (
  dictionary: TranslationDictionary,
  key: string,
): string | undefined => {
  const segments = key.split('.');
  let current: string | TranslationDictionary | undefined = dictionary;

  for (const segment of segments) {
    if (!isTranslationDictionary(current)) {
      return undefined;
    }

    current = current[segment];
  }

  return typeof current === 'string' ? current : undefined;
};

const interpolateTranslation = (
  message: string,
  values?: TranslationValues,
): string =>
  message.replace(placeholderExpression, (match, token: string) => {
    const value = values?.[token];

    return value === undefined ? match : String(value);
  });

export const createTranslator = <TDictionary extends TranslationDictionary>(
  dictionary: TDictionary,
  options: TranslatorOptions = {},
) => {
  const locale = options.locale ?? defaultLocale;

  const t = (key: TranslationKey<TDictionary> | string, values?: TranslationValues) => {
    const translation = resolveTranslation(dictionary, key);

    if (translation === undefined) {
      return key;
    }

    return interpolateTranslation(translation, values);
  };

  return {
    dictionary,
    locale,
    t,
  };
};

export const initializeI18n = (
  rootElement: Pick<HTMLElement, 'lang'> = document.documentElement,
) => {
  rootElement.lang = defaultLocale;
};

export type AppMessages = typeof en;
export type AppTranslationKey = TranslationKey<AppMessages>;

const appTranslator = createTranslator(en, {
  locale: defaultLocale,
});

export const messages = appTranslator.dictionary;
export const t = appTranslator.t;
