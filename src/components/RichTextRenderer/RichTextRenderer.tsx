import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import type { Document } from '@contentful/rich-text-types';
import type { ReactNode } from 'react';
import styles from './RichTextRenderer.module.scss';

interface RichTextRendererProps {
  document: Document;
}

function assetUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.startsWith('//') ? `https:${url}` : url;
}

export default function RichTextRenderer({ document }: RichTextRendererProps) {
  return (
    <div className={styles.richtext}>
      {documentToReactComponents(document, {
        renderMark: {
          [MARKS.BOLD]: (text: ReactNode) => <strong>{text}</strong>,
          [MARKS.ITALIC]: (text: ReactNode) => <em>{text}</em>,
          [MARKS.UNDERLINE]: (text: ReactNode) => <u>{text}</u>,
        },
        renderNode: {
          [BLOCKS.HEADING_2]: (_node: unknown, children: ReactNode) => (
            <h2>{children}</h2>
          ),
          [BLOCKS.HEADING_3]: (_node: unknown, children: ReactNode) => (
            <h3>{children}</h3>
          ),
          [BLOCKS.PARAGRAPH]: (_node: unknown, children: ReactNode) => (
            <p>{children}</p>
          ),
          [BLOCKS.UL_LIST]: (_node: unknown, children: ReactNode) => (
            <ul>{children}</ul>
          ),
          [BLOCKS.OL_LIST]: (_node: unknown, children: ReactNode) => (
            <ol>{children}</ol>
          ),
          [BLOCKS.LIST_ITEM]: (_node: unknown, children: ReactNode) => (
            <li>{children}</li>
          ),
          [BLOCKS.QUOTE]: (_node: unknown, children: ReactNode) => (
            <blockquote>{children}</blockquote>
          ),
          [BLOCKS.EMBEDDED_ASSET]: (node: unknown) => {
            const asset = (
              node as {
                data: {
                  target: {
                    fields?: {
                      file?: { url?: string; details?: { image?: { width?: number; height?: number } } };
                      title?: string;
                      description?: string;
                    };
                  };
                };
              }
            ).data.target;
            const url = assetUrl(asset?.fields?.file?.url);
            const alt = asset?.fields?.description ?? asset?.fields?.title ?? '';
            const width = asset?.fields?.file?.details?.image?.width;
            const height = asset?.fields?.file?.details?.image?.height;
            if (!url) return null;
            return (
              <figure className={styles.richtext__figure}>
                <img
                  src={url}
                  alt={alt}
                  width={width}
                  height={height}
                  className={styles.richtext__image}
                />
              </figure>
            );
          },
          [INLINES.HYPERLINK]: (
            node: unknown,
            children: ReactNode
          ) => {
            const uri = (node as { data: { uri: string } }).data.uri;
            const isExternal =
              uri.startsWith('http://') || uri.startsWith('https://');
            return (
              <a
                href={uri}
                {...(isExternal
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {children}
              </a>
            );
          },
        },
      })}
    </div>
  );
}
