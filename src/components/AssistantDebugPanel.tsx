import React from 'react';
import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom';

interface DebugPanelProps {
  children?: React.ReactNode;
}

export const AssistantDebugPanel: React.FC<DebugPanelProps> = ({ children }) => {
  return (
    <div id="assistant-debug-panel" className="assistant-debug">
      {children}
    </div>
  );
};

// Перехватываем оригинальный ReactDOM.render
const originalRender = ReactDOM.render;
let isPatched = false;

const patchReactDOM = () => {
  if (isPatched) return null;
  
  // Создаем контейнер и root один раз
  const container = document.createElement('div');
  container.id = 'assistant-debug-panel-container';
  document.body.appendChild(container);
  const root = createRoot(container);

  // Заменяем ReactDOM.render
  (ReactDOM as any).render = function(
    element: Parameters<typeof ReactDOM.render>[0],
    container: Parameters<typeof ReactDOM.render>[1]
  ) {
    if (container instanceof Element && container.id === 'assistant-debug-panel') {
      root.render(
        <AssistantDebugPanel>
          {element}
        </AssistantDebugPanel>
      );
      return;
    }
    return originalRender.call(this, element, container);
  };

  isPatched = true;

  // Возвращаем функцию очистки
  return () => {
    try {
      root.unmount();
      container.remove();
      (ReactDOM as any).render = originalRender;
      isPatched = false;
    } catch (error) {
      console.error('Error cleaning up debug panel:', error);
    }
  };
};

export const setupDebugPanel = (): (() => void) | null => {
  if (typeof window === 'undefined') return null;
  
  // Патчим ReactDOM только один раз
  return patchReactDOM();
}; 