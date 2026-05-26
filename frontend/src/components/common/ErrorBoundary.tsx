import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props { children: ReactNode; }
interface State { error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '40px 24px', textAlign: 'center', fontFamily: 'inherit' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: 12, color: '#1a2744' }}>
            Algo deu errado
          </h2>
          <p style={{ color: '#5a6d85', marginBottom: 8, fontSize: '0.9rem' }}>
            {this.state.error.message}
          </p>
          <button
            onClick={() => { this.setState({ error: null }); window.history.back(); }}
            style={{
              marginTop: 20, padding: '12px 28px', borderRadius: 12,
              background: '#3a7bd5', color: '#fff', border: 'none',
              fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            ← Voltar
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 20, marginLeft: 12, padding: '12px 28px', borderRadius: 12,
              background: 'transparent', color: '#5a6d85',
              border: '2px solid #cfe0f5', fontWeight: 800, fontSize: '0.95rem',
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
