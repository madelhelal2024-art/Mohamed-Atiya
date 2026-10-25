import React, { Component, ErrorInfo, ReactNode } from 'react';

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
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div style={{ padding: '3rem 1.5rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#b91c1c', marginBottom: '1rem' }}>
            حدث خطأ غير متوقع أثناء تحميل الصفحة
          </h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            يرجى إعادة المحاولة أو العودة إلى الصفحة الرئيسية.
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              this.setState({ hasError: false });
              window.location.hash = '#/';
            }}
          >
            العودة للرئيسية
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
