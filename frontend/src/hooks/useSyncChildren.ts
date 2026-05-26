import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { http } from '../services/httpClient';
import type { Child } from '../types';

/*
  Sincroniza a lista de crianças do backend para o Zustand na montagem do app.

  Estratégia de merge:
    - Crianças do backend substituem as versões locais (mesmo id).
    - Crianças que existem somente no Zustand (ex.: criadas offline) são mantidas.

  Isso garante:
    ✓ Backend é fonte de verdade para dados já persistidos.
    ✓ Dados locais não são perdidos se o backend reiniciar em modo in-memory.
    ✓ Quando MySQL estiver ativo, não haverá mais crianças "somente-local".

  O ref evita dupla chamada em StrictMode (React monta duas vezes em dev).
*/
export function useSyncChildren(): void {
  const synced = useRef(false);

  useEffect(() => {
    if (synced.current) return;
    synced.current = true;

    http.get<Child[]>('/children')
      .then((backendChildren) => {
        const backendIds = new Set(backendChildren.map((c) => c.id));

        useStore.setState((state) => {
          const localOnly = state.children.filter((c) => !backendIds.has(c.id));
          return { children: [...backendChildren, ...localOnly] };
        });

        if (import.meta.env.DEV) {
          console.log(`[sync] ${backendChildren.length} crianças carregadas do backend`);
        }
      })
      .catch((err: Error) => {
        console.warn('[sync] backend indisponível — usando dados locais.', err.message);
      });
  }, []);
}
