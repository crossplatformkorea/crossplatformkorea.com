import { Component, type ErrorInfo, type ReactNode } from 'react';
import { t } from '../../lib/i18n';
import { devConsole } from '../../lib/utils';
import { Button } from './Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Rendered instead of the default panel. Receives a reset callback. */
  fallback?: (reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Catches render-time throws so a failing Convex `useQuery` degrades to a
 * friendly panel instead of unmounting the whole tree to a blank page.
 *
 * The caught error is only logged, never rendered: in production Convex
 * redacts server errors to "[CONVEX Q(...)] [Request ID: ...] Server Error",
 * which is noise to a user.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    devConsole.error('Unhandled render error:', error, errorInfo.componentStack);
  }

  private reset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback(this.reset);

    return (
      <div
        role="alert"
        className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center"
      >
        <div>
          <h2 className="text-xl font-semibold tracking-[-0.02em]">{t('common.errors.title')}</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {t('common.errors.description')}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button type="button" onClick={this.reset} variant="secondary">
            {t('common.errors.retry')}
          </Button>
          <Button type="button" onClick={() => window.location.assign('/')}>
            {t('common.errors.goHome')}
          </Button>
        </div>
      </div>
    );
  }
}
