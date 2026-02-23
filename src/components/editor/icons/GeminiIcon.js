import Image from 'next/image';

export const GeminiIcon = ({ className, size = 24, ...props }) => (
  <div className={`relative ${className}`} style={{ width: size, height: size }} {...props}>
    <Image
      src="/aiicon.png"
      alt="AI"
      fill
      className="object-contain"
      sizes={`${size}px`}
    />
  </div>
);
