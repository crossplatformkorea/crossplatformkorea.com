import * as React from 'react';
import { buttonStyles, type ButtonVariant, type ButtonSize } from './buttonStyles';

export type { ButtonVariant, ButtonSize } from './buttonStyles';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => (
    <button className={buttonStyles({ variant, size, className })} ref={ref} {...props} />
  ),
);
Button.displayName = 'Button';

export { Button };
