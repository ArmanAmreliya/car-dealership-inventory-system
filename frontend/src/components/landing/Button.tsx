import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'inverse';
type ButtonSize = 'lg' | 'md' | 'sm';

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface ButtonAsButtonProps extends BaseButtonProps {
  href?: never;
}

interface ButtonAsAnchorProps extends BaseButtonProps {
  href: string;
  target?: string;
  rel?: string;
}

type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm',
  secondary: 'bg-accent-500 text-white hover:bg-accent-600 shadow-sm',
  outline: 'bg-transparent text-primary-600 border border-primary-600 hover:bg-primary-50',
  ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100',
  inverse: 'bg-white text-primary-700 hover:bg-neutral-50',
};

const sizeStyles: Record<ButtonSize, string> = {
  lg: 'h-12 px-8 text-base font-semibold',
  md: 'h-11 px-6 text-sm font-semibold',
  sm: 'h-9 px-4 text-xs font-semibold',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  const buttonContent = isLoading ? (
    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ) : (
    children
  );

  const MotionButton = motion.button;
  const MotionAnchor = motion.a;

  if ('href' in props) {
    const anchorProps = props as ButtonAsAnchorProps;
    return (
      <MotionAnchor
        href={anchorProps.href}
        target={anchorProps.target}
        rel={anchorProps.rel}
        className={combinedClassName}
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.02 }}
        aria-disabled={disabled || isLoading}
        onClick={onClick}
      >
        {buttonContent}
      </MotionAnchor>
    );
  }

  return (
    <MotionButton
      className={combinedClassName}
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      onClick={onClick}
    >
      {buttonContent}
    </MotionButton>
  );
}
