"use client";

/** A <select> that submits its form on change (progressive enhancement). */
export function AutoSubmitSelect({ id, name, label, value, options }: { id: string; name: string; label: string; value: string; options: [string, string][] }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[0.8125rem] font-medium text-forest">
        {label}
      </label>
      <select
        id={id}
        name={name}
        defaultValue={value}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="ui-select h-10 appearance-none rounded-sm border border-line-strong bg-white pr-9 pl-3 text-sm focus:border-forest focus:outline-none"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}
