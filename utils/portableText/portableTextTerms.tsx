import { PortableTextComponents } from "@portabletext/react";
import Link from "next/link";


export const portableBlockComponentsTerms: PortableTextComponents = {

  block: {
    normal: ({ children }: any) => <p>{children}</p>,
    h3: ({ children }) => <h3>{children}</h3>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,

    annotationLinkExternal: ({ value, children }) => {
      const href = value?.url; // ← field name from your schema

      return (
        <Link href={href} target={`${value.newWindow ? '_blanck' : '_self'}`} rel="noopener noreferrer">
          {children}
        </Link>
      );
    },
    annotationLinkEmail: ({ value, children }) => {
      if (!value?.email) return <>{children}</>;

      const href = `mailto:${value?.email}`; // ← field name from your schema

      return (
        <Link href={href} target='_blank' rel="noopener noreferrer">
          {children}
        </Link>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul style={{ marginLeft: "calc(var(--margin) / 2)" }}>
        {children}
      </ul>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li style={{ listStyle: "disc" }}>{children}</li>
  },

};