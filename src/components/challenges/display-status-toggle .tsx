import type { DisplayStatus } from '@/api/challenge'
import { useForm } from 'react-hook-form'
import { RadioGroup, RadioGroupItem } from '../shadcn/radio-group'
import { Label } from '../shadcn/label'
import { useId } from 'react'

interface DisplayStatusToggleProps {
  value: DisplayStatus
  onChange: (value: DisplayStatus) => void | Promise<void>
  challengeId: number
  challengeType: 'individual' | 'team'
}
const DisplayStatusToggle = ({ value: propsValue, onChange }: DisplayStatusToggleProps) => {
  const radioInputIdVisible = useId()
  const radioInputIdHidden = useId()
  const f = useForm({
    defaultValues: {
      displayStatus: propsValue,
    },
  })
  return (
    <form>
      <RadioGroup className="flex gap-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="VISIBLE"
            id={radioInputIdVisible}
            checked={f.watch('displayStatus') === 'VISIBLE'}
            onClick={() => {
              f.setValue('displayStatus', 'VISIBLE')
              onChange('VISIBLE')
            }}
          />
          <Label htmlFor={radioInputIdVisible} className="cursor-pointer">
            전시
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="HIDDEN"
            id={radioInputIdHidden}
            checked={f.watch('displayStatus') === 'HIDDEN'}
            onClick={() => {
              f.setValue('displayStatus', 'HIDDEN')
              onChange('HIDDEN')
            }}
          />
          <Label htmlFor={radioInputIdHidden} className="cursor-pointer">
            비전시
          </Label>
        </div>
      </RadioGroup>
    </form>
  )
}

export default DisplayStatusToggle
