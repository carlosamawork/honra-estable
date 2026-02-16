import { PortableTextComponents } from "@portabletext/react";
import Link from "next/link";


export const portableBlockComponentsAbout: PortableTextComponents = {

  block: {
    normal: ({ children }: any) => <p className="font-about">{children}</p>,
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
  list: {},
  listItem: {},

};