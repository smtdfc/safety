import { parseDocument, DomUtils } from 'htmlparser2';
import {Element} from 'domhandler';
import { resolve as resolveUrl } from 'url';
import { PageContentParsed } from '../types/index.js';

export function parseHTMLContent(html: string, baseUrl: string): PageContentParsed {
  const dom = parseDocument(html);
  const result: PageContentParsed = {
    url: baseUrl,
    title: '',
    textContent: '',
    meta: {},
    links: [],
    images: [],
    scripts: [],
    forms: [],
    iframes: [],
  };

  const skipTags = new Set(['script', 'style', 'noscript', 'template']);

  const traverse = (node: any) => {
    if (node.type === 'tag') {
      const tag = node.name;
      const attribs = node.attribs || {};

      if (tag === 'title') {
        result.title = DomUtils.textContent(node).trim();
      }

      if (tag === 'meta') {
        const name = attribs.name?.toLowerCase();
        const prop = attribs.property?.toLowerCase();
        const content = attribs.content;
        if (attribs.charset) result.meta.charset = attribs.charset;
        if (name === 'description') result.meta.description = content;
        if (prop === 'og:title') result.meta.ogTitle = content;
        if (prop === 'og:image') result.meta.ogImage = content;
        if (prop === 'og:url') result.meta.ogUrl = content;
      }

      if (tag === 'a' && attribs.href) {
        result.links.push({
          href: resolveUrl(baseUrl, attribs.href),
          text: DomUtils.textContent(node).trim(),
        });
      }

      if (tag === 'img' && attribs.src) {
        result.images.push({
          src: resolveUrl(baseUrl, attribs.src),
          alt: attribs.alt,
        });
      }

      if (tag === 'script') {
        if (attribs.src) {
          result.scripts.push({ src: resolveUrl(baseUrl, attribs.src) });
        } else {
          result.scripts.push({ inlineCode: DomUtils.textContent(node).trim() });
        }
      }

      if (tag === 'iframe' && attribs.src) {
        result.iframes.push(resolveUrl(baseUrl, attribs.src));
      }

      if (tag === 'link' && attribs.rel) {
        const rel = attribs.rel.toLowerCase();
        if (rel === 'canonical') result.canonicalUrl = resolveUrl(baseUrl, attribs.href);
        if (rel.includes('icon')) result.faviconUrl = resolveUrl(baseUrl, attribs.href);
      }

      if (tag === 'form') {
        const form = {
          action: attribs.action ? resolveUrl(baseUrl, attribs.action) : undefined,
          method: attribs.method?.toUpperCase() || 'GET',
          hasPasswordField: false,
          hasEmailField: false,
          fields: [] as { name?: string; type?: string }[],
        };

        const inputNodes = DomUtils.findAll(
          (el) => el.type === 'tag' && el.name === 'input',
          [node],
        );

        inputNodes.forEach((input: Element) => {
          const type = input.attribs?.type?.toLowerCase();
          const name = input.attribs?.name;
          if (type === 'password') form.hasPasswordField = true;
          if (type === 'email') form.hasEmailField = true;
          form.fields.push({ name, type });
        });

        result.forms.push(form);
      }

      if (!skipTags.has(tag)) {
        (node.children || []).forEach(traverse);
      }
    } else if (node.type === 'text') {
      result.textContent += node.data;
    }
  };

  dom.children.forEach(traverse);
  result.textContent = result.textContent.trim().replace(/\s+/g, ' ');
  return result;
}