import type { Message, MultipleFieldErrors } from 'react-hook-form'

export const RenderMessage = (data: { message: Message; messages?: MultipleFieldErrors }) => {
  return <p className="self-start text-red-500">{data.message}</p>
}
