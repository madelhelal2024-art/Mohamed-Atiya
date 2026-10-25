import settings from '../data/template-settings.json';
/** Change storageNamespace when creating a second app on the same domain. */
export const storageKey = (suffix: string): string => `${settings.storageNamespace}:${suffix}`;
