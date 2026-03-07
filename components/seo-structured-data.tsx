"use client";

interface StructuredDataProps {
  type: 'product' | 'breadcrumb' | 'organization';
  data: any;
}

export function SEOStructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'product':
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          ...data,
        };
      case 'breadcrumb':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data,
        };
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          ...data,
        };
      default:
        return data;
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData()),
      }}
    />
  );
}

