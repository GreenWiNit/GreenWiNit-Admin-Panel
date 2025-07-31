import originalQueryString, { type StringifyOptions } from 'query-string'

export const extract = originalQueryString.extract
export const parse = originalQueryString.parse
export const parseUrl = originalQueryString.parseUrl
export const stringifyUrl = originalQueryString.stringifyUrl
export const pick = originalQueryString.pick
export const exclude = originalQueryString.exclude

const QUERY_STRING_DEFAULT_STRINGIFY_OPTION: StringifyOptions = {
  skipNull: true,
}

export function stringify(...args: Parameters<typeof originalQueryString.stringify>) {
  return originalQueryString.stringify(args[0], {
    ...QUERY_STRING_DEFAULT_STRINGIFY_OPTION,
    ...args[1],
  })
}
