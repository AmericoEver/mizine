import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="wrap">
        <span>© {currentYear} MIZINE. Todos os direitos reservados.</span>
        <span>Parte do Grupo Mizine</span>
      </div>
    </footer>
  );
};

