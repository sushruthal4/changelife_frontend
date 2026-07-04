import React from "react";

interface PageBannerProps {
  image: string;
  alt: string;
}

export const PageBanner: React.FC<PageBannerProps> = ({ image, alt }) => (
  <section className="w-full overflow-hidden bg-brand-muted">
    <img
      src={image}
      alt={alt}
      className="h-[210px] w-full object-cover sm:h-[280px] md:h-[360px]"
    />
  </section>
);
