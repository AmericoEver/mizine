import React, { useEffect } from 'react';

interface LightboxProps {
  isOpen: boolean;
  title: string;
  videoUrl?: string;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  title,
  videoUrl,
  onClose
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`lb ${isOpen ? 'open' : ''}`}
      id="lb"
      role="dialog"
      aria-modal="true"
      aria-label="Reprodutor de vídeo"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        className="x"
        id="x"
        aria-label="Fechar"
        onClick={onClose}
      >
        ✕
      </button>

      <div className="box" id="box">
        {videoUrl ? (
          <video
            src={videoUrl}
            controls
            autoPlay
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <p>
            <strong>{title}</strong>: adicione o ficheiro ou link do vídeo no painel de administração.
          </p>
        )}
      </div>
    </div>
  );
};

