import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 text-center">
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 max-w-md">
            <h2 className="text-2xl font-bold text-red-400 mb-4 uppercase tracking-tighter">System Error</h2>
            <p className="text-white/60 mb-6">
              An unexpected error occurred in the digital twin simulation.
            </p>
            <pre className="text-xs bg-black/50 p-4 rounded-xl overflow-auto max-h-40 text-left text-red-300 mb-6">
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-emerald-500 text-black font-bold py-3 rounded-xl uppercase tracking-widest"
            >
              Restart Simulation
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
