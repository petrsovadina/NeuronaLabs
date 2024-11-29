import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RefreshCw, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    // Zde můžete přidat logování chyb do služby jako je Sentry
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-4">
            <Alert variant="destructive">
              <AlertTitle className="text-lg font-semibold">
                Něco se pokazilo
              </AlertTitle>
              <AlertDescription className="mt-2 text-sm">
                {this.state.error?.message || 'Došlo k neočekávané chybě.'}
              </AlertDescription>
            </Alert>
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => window.location.reload()}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Obnovit stránku
              </Button>
              <Button 
                variant="outline" 
                onClick={this.handleReset}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Zkusit znovu
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
