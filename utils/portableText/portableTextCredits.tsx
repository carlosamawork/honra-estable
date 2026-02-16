import { PortableTextComponents } from "@portabletext/react";
import Link from "next/link";

type CreditsComponentsOptions = {
  paragraphClassName?: string;
};

export const portableBlockComponentsCredits = (options: CreditsComponentsOptions = {}): PortableTextComponents => {
  const { paragraphClassName = "font-xs"} = options;

  return {

    block: {
      normal: ({ children }: any) => <p className={paragraphClassName}>{children}</p>,
    },
    marks: {
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
  }
};