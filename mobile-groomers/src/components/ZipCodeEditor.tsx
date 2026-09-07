"use client";

import { useState } from "react";
import { updateZipCodes } from "@/lib/actions/listing";

export default function ZipCodeEditor({
  groomerId,
  zipCodes,
}: {
  groomerId: string;
  zipCodes: string[];
}) {
  const [value, setValue] = useState(zipCodes.join(", "));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function action(formData: FormData) {
    setPending(true);
    setMessage("");
    setError("");
    const result = await updateZipCodes(formData);
    setPending(false);
    if (result?.error) setError(result.error);
    else setMessage(`Saved — your van now covers ${result?.count} zip codes.`);
  }

  return (
    <form action={action}>
      <input type="hidden" name="groomerId" value={groomerId} />
      <label className="field-label" htmlFor={`zips-${groomerId}`}>
        Zip codes your van covers
      </label>
      <textarea
        id={`zips-${groomerId}`}
        name="zipCodes"
        rows={3}
        className="field font-mono text-sm"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="90210, 90211, 90212"
      />
      <p className="mt-1.5 text-xs text-ink-soft">
        Separate with commas or spaces. These decide which local searches you
        appear in.
      </p>

      {error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}
      {message && <p className="mt-2 text-sm text-teal-dark">{message}</p>}

      <button type="submit" className="btn btn-primary btn-sm mt-4" disabled={pending}>
        {pending ? "Saving…" : "Save coverage"}
      </button>
    </form>
  );
}
