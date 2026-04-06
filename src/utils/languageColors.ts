export const languageColors: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Lua: '#000080',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  'Jupyter Notebook': '#DA5B0B',
  R: '#198CE7',
  Scala: '#c22d40',
  Haskell: '#5e5086',
  Elixir: '#6e4a7e',
  Clojure: '#db5855',
  Perl: '#0298c3',
  'Objective-C': '#438eff',
  Zig: '#ec915c',
  Nix: '#7e7eff',
  OCaml: '#3be133',
  Dockerfile: '#384d54',
  Makefile: '#427819',
  PowerShell: '#012456',
  Vim: '#199f4b',
  TeX: '#3D6117',
  MATLAB: '#e16737',
  Assembly: '#6E4C13',
};

export function getLanguageColor(language: string): string {
  return languageColors[language] || stringToColor(language);
}

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 55%, 55%)`;
}
