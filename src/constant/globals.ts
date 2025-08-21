import { QueryClient } from '@tanstack/react-query'
import _dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

export const queryClient = new QueryClient()

_dayjs.extend(customParseFormat)
_dayjs.extend(isSameOrBefore)
_dayjs.extend(isSameOrAfter)

export const dayjs = _dayjs
