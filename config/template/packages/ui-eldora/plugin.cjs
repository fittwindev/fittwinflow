/** Tailwind plugin to add Eldora utilities */
module.exports = function({ addComponents, addUtilities }){
  addComponents({
    '.e-container':{ maxWidth:'1120px', margin:'0 auto', padding:'0 1rem' },
    '.e-grid':{ display:'grid', gap:'1rem' }
  });
  addUtilities({
    '.e-shadow':{ boxShadow:'0 1px 2px rgba(0,0,0,.05), 0 6px 20px rgba(0,0,0,.06)' }
  });
};
