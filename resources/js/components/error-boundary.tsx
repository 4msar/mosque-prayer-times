import * as React from 'react';

export class ErrorBoundary extends React.Component<React.PropsWithChildren> {
    state = {
        hasError: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static getDerivedStateFromError(error: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex p-6">
                    <h1 className="text-2xl font-semibold">Something went wrong.</h1>
                </div>
            );
        }

        return this.props.children;
    }
}
