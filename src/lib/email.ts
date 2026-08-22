/**
 * Encodes an address so it does not appear as literal text in the served HTML.
 *
 * Assembling the address from parts in the template achieves nothing here: this
 * is a static site, so any concatenation happens at build time and the finished
 * address is what ships in the file. Encoding is the part that survives to the
 * output — the bytes on the wire never contain the plain string, while browsers
 * decode both the href and the visible text before a human ever sees them, with
 * no JavaScript involved.
 *
 * This stops naive scrapers that regex the raw HTML. It stops nothing that
 * renders the page. That is the honest ceiling for a static page, and the
 * alternative — assembling in client JavaScript — would hide the address from
 * readers without JavaScript too.
 */

/** Percent-encodes every character, which is legal anywhere in a mailto URL. */
export function encodeMailto(address: string): string {
  return `mailto:${[...address]
    .map((char) => `%${char.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0")}`)
    .join("")}`;
}

/** Numeric character references, decoded by the parser before display. */
export function encodeText(address: string): string {
  return [...address].map((char) => `&#${char.charCodeAt(0)};`).join("");
}
