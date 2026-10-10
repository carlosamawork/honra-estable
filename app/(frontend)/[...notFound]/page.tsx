import { notFound } from 'next/navigation'

// Catch-all for unknown routes so the (frontend) not-found page renders
// with the site header and footer.
export default function CatchAll(): never {
  notFound()
}
