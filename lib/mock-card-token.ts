/** Test card the mock gateway always declines (4000 0000 0000 0002). */
export const DECLINED_TEST_CARD = "4000000000000002";

/** Prefix of the tokens the mock gateway declines. */
export const DECLINED_TOKEN_PREFIX = "mock_tok_declined_";

/**
 * Stand-in for the gateway's browser-side tokenizer: the card digits never leave the browser,
 * the server only sees this token. The decline test card gets a token the mock gateway declines.
 */
export function mockCardToken(digits: string): string {
  const prefix = digits === DECLINED_TEST_CARD ? DECLINED_TOKEN_PREFIX : "mock_tok_";
  return `${prefix}${crypto.randomUUID()}`;
}
