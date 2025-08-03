import DatePickerSingle from './date-picker-single'

type DatePickerRangeProps = {
  startDate: Date | null
  endDate: Date | null
  onChange: (startDate: Date | null, endDate: Date | null) => void
}
const DatePickerRange = ({ startDate, endDate, onChange }: DatePickerRangeProps) => {
  return (
    <>
      <DatePickerSingle
        selected={startDate}
        onChange={(date) => onChange(date, endDate)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
      />
      <span>~</span>
      <DatePickerSingle
        selected={endDate}
        onChange={(date) => onChange(startDate, date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate ?? new Date(0)}
      />
    </>
  )
}

export default DatePickerRange
