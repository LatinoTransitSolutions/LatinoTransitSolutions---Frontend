export default function Input({ label, value, placeholder, error, onUpdateValue, options }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-medium leading-none">{label}</label>
      <div className="w-full">
        <select onChange={({ target }) => onUpdateValue(target.value)} value={value} placeholder={placeholder}>
          <option hidden>{placeholder}</option>
          {(options || []).map((option, index) => (
            <option key={"option_" + index} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
        <span className="text-red-500 text-right block">{error}</span>
      </div>
    </div>
  )
}
