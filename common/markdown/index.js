import MarkdownIt from 'markdown-it';
import mdEmoji from 'markdown-it-emoji/light';
import mdEmojiLight from 'markdown-it-emoji/lib/data/light.json';
import createDOMPurify from 'dompurify';
import { compose } from 'redux';

import stampDefs from 'stamps';

import normTabs from './plugin-tabs';
import { normLinkHook, normLink } from './plugin-link';
import normCountdown from './plugin-countdown';
import normNewline from './plugin-newline';

export { changeTabularTab } from './plugin-tabs.js';

const REMOVE_HTML_REGEXP = new RegExp('<[^<>\n]+>', 'g');

const DOMPurifyParamsText = {
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|chat):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  FORCE_BODY: true,
};

const DOMPurifyParamsLine = {
  ...DOMPurifyParamsText,
  FORBID_ATTR: ['style'],
  FORBID_TAGS: ['style', 'iframe'],
};

let DOMPurify = createDOMPurify;
if (!process.browser) {
  const { JSDOM } = require('jsdom');
  const window = new JSDOM('').window;
  DOMPurify = createDOMPurify(window);
}

DOMPurify.addHook('afterSanitizeAttributes', normLinkHook);

const HtmlPurify = (html, config) =>
  DOMPurify.isSupported ? DOMPurify.sanitize(html, config) : html;

const md = MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
})
  .enable(['table', 'strikethrough'])
  .use(mdEmoji, {
    defs: Object.assign({}, mdEmojiLight, stampDefs),
  });

const PreNorm = string => {
  return compose(
    normTabs,
    normNewline,
  )(string);
};

const PostNorm = string => {
  if (!HtmlPurify.isSupported) {
    return normLink(string);
  }
  return string;
};

export const line2md = string => {
  const rendered = md
    .render(PreNorm(string))
    .replace(/<p>/g, '')
    .replace(/<\/p>\s*$/g, '')
    .replace(/<\/p>/g, '<br style="margin-bottom: 10px" />');
  const purified = HtmlPurify(rendered, DOMPurifyParamsLine);
  return PostNorm(purified);
};

export const text2md = string => {
  const rendered = md.render(PreNorm(string));
  const purified = HtmlPurify(rendered, DOMPurifyParamsText);
  return PostNorm(purified);
};

export const text2raw = string =>
  text2md(puzzle.content).replace(REMOVE_HTML_REGEXP, '');