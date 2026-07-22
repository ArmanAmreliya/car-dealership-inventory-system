interface SectionHeadingProps {
  overline?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ overline, title, description, align = 'left' }: SectionHeadingProps) {
  const alignmentClasses = align === 'center' ? 'text-center' : 'text-left';

  return (
    <div className={`${alignmentClasses} mb-12`}>
      {overline && (
        <p className="text-xs font-semibold tracking-widest uppercase text-primary-600 mb-4">
          {overline}
        </p>
      )}
      <h2 className="text-4xl font-bold text-neutral-900 mb-4 lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto lg:text-xl">
          {description}
        </p>
      )}
    </div>
  );
}
