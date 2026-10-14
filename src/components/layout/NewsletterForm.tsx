"use client";

import { type FormEvent, useId, useState } from "react";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Demo newsletter sign-up: validates the address and confirms inline.
 * Nothing is sent anywhere (the shop is a demo); the copy says so.
 */
export function NewsletterForm() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!EMAIL.test(email.trim())) {
      setError("Podaj poprawny adres e-mail, np. imie@domena.pl");
      return;
    }
    setError(null);
    setDone(true);
  }

  if (done) {
    return (
      <p role="status" className="text-gold mt-5 text-sm leading-relaxed">
        Zapisane. To sklep demonstracyjny, więc adres nigdzie nie trafił.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-5">
      <div className="flex items-center gap-2">
        <label htmlFor={`${id}-email`} className="sr-only">
          Adres e-mail
        </label>
        <input
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="Twój adres e-mail"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) setError(null);
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`bg-roast text-crema placeholder:text-latte/80 focus:border-gold h-11 w-full rounded-full border px-5 text-sm transition-colors duration-200 motion-reduce:transition-none ${
            error ? "border-ember" : "border-line"
          }`}
        />
        <button
          type="submit"
          className="bg-gold text-espresso hover:bg-gold-soft h-11 shrink-0 rounded-full px-5 font-mono text-[10px] uppercase tracking-[0.2em] transition-[background-color,transform] duration-200 active:scale-[0.97] motion-reduce:transition-none"
        >
          Zapisz się
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="text-ember mt-2 text-xs">
          {error}
        </p>
      )}
    </form>
  );
}

export default NewsletterForm;
