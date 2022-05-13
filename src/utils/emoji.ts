import type { Emoji } from '@types';

export function renderEmoji(text: string, emojis: Emoji[]) {
  return emojis.reduce((acc, emoji) => {
    return acc.replace(
      `:${emoji.shortcode}:`,
      `<img class="emoji" src="${emoji.url}" alt="">`
    );
  }, text);
}
