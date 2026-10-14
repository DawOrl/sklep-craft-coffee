"use client";

import { type FormEvent, useState } from "react";

import Magnetic from "@/components/motion/Magnetic";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Mock contact form - no backend. Validates inline (Polish messages) and on
 * success swaps to an inline confirmation state.
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const next: FormErrors = {};
    if (!name.trim()) next.name = "Podaj swoje imię";
    if (!EMAIL_RE.test(email.trim()))
      next.email = "Podaj poprawny adres e-mail";
    if (message.trim().length < 10)
      next.message = "Wiadomość powinna mieć co najmniej 10 znaków";

    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  }

  if (sent) {
    return (
      <div
        role="status"
        className="border-line bg-roast rounded-2xl border p-8 md:p-10"
      >
        <p className="text-gold font-mono text-[11px] uppercase tracking-[0.2em]">
          Wiadomość wysłana
        </p>
        <p className="font-display text-crema mt-5 text-2xl leading-snug font-light md:text-3xl">
          Dziękujemy. Odpowiemy w 24 godziny
        </p>
        <p className="text-latte mt-4 text-sm leading-relaxed md:text-base">
          Kopia wiadomości trafiła na adres {email.trim()}. Piszemy od
          poniedziałku do piątku, między 8:00 a 16:00.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <Input
        label="Imię"
        name="name"
        autoComplete="given-name"
        placeholder="np. Anna"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />
      <Input
        label="E-mail"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="anna@przyklad.pl"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <Textarea
        label="Wiadomość"
        name="message"
        rows={6}
        placeholder="O czym chcesz porozmawiać?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        error={errors.message}
      />
      <Magnetic>
        <Button type="submit" size="lg">
          Wyślij wiadomość
        </Button>
      </Magnetic>
    </form>
  );
}

export default ContactForm;
