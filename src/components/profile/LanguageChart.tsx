import { useState } from 'react';
import type { LanguageStat } from '../../utils/types';

interface LanguageChartProps {
  languages: LanguageStat[];
}

// Map GitHub language names to devicon icon names
// https://devicon.dev/ — covers most popular languages
const deviconNames: Record<string, string> = {
  JavaScript: 'javascript',
  TypeScript: 'typescript',
  Python: 'python',
  Java: 'java',
  'C++': 'cplusplus',
  C: 'c',
  'C#': 'csharp',
  Go: 'go',
  Rust: 'rust',
  Ruby: 'ruby',
  PHP: 'php',
  Swift: 'swift',
  Kotlin: 'kotlin',
  Dart: 'dart',
  Lua: 'lua',
  Shell: 'bash',
  HTML: 'html5',
  CSS: 'css3',
  SCSS: 'sass',
  Sass: 'sass',
  Vue: 'vuejs',
  Svelte: 'svelte',
  'Jupyter Notebook': 'jupyter',
  R: 'r',
  Scala: 'scala',
  Haskell: 'haskell',
  Elixir: 'elixir',
  Perl: 'perl',
  'Objective-C': 'objectivec',
  Dockerfile: 'docker',
  PowerShell: 'powershell',
  TeX: 'latex',
  Vim: 'vim',
  'Vim Script': 'vim',
  React: 'react',
  Angular: 'angularjs',
  // Additional languages with devicon support
  Ada: 'ada',
  Android: 'android',
  Ansible: 'ansible',
  Apache: 'apache',
  'Apple Script': 'apple',
  Arduino: 'arduino',
  Astro: 'astro',
  Awk: 'awk',
  Bash: 'bash',
  Clojure: 'clojure',
  CMake: 'cmake',
  CoffeeScript: 'coffeescript',
  Crystal: 'crystal',
  Cuda: 'cuda',
  D: 'd',
  Django: 'django',
  'Emacs Lisp': 'emacs',
  Elm: 'elm',
  Erlang: 'erlang',
  'F#': 'fsharp',
  Fortran: 'fortran',
  'Fortran Free Form': 'fortran',
  GDScript: 'godot',
  GraphQL: 'graphql',
  Groovy: 'groovy',
  Handlebars: 'handlebars',
  Haxe: 'haxe',
  HCL: 'terraform',
  Julia: 'julia',
  Less: 'less',
  Markdown: 'markdown',
  MATLAB: 'matlab',
  Nim: 'nimble',
  Nix: 'nixos',
  OCaml: 'ocaml',
  OpenCL: 'opencl',
  PostgreSQL: 'postgresql',
  PLpgSQL: 'postgresql',
  Processing: 'processing',
  Prolog: 'prolog',
  PureScript: 'purescript',
  Racket: 'racket',
  Redis: 'redis',
  Solidity: 'solidity',
  SQL: 'azuresqldatabase',
  Starlark: 'python',
  Terraform: 'terraform',
  Unity: 'unity',
  VBScript: 'visualbasic',
  'VB.Net': 'visualbasic',
  Verilog: 'verilog',
  WebAssembly: 'wasm',
  XML: 'xml',
  YAML: 'yaml',
  Zig: 'zig',
};

function getDeviconUrl(lang: string): string {
  const name = deviconNames[lang];
  if (!name) return '';
  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-original.svg`;
}

function LanguageIcon({ lang, color }: { lang: string; color: string }) {
  const [failed, setFailed] = useState(false);
  const url = getDeviconUrl(lang);

  if (!url || failed) {
    return (
      <span
        className="w-3 h-3 rounded-full inline-block flex-shrink-0"
        style={{ backgroundColor: color }}
      />
    );
  }

  return (
    <img
      src={url}
      alt={lang}
      className="w-4 h-4 flex-shrink-0"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export default function LanguageChart({ languages }: LanguageChartProps) {
  if (languages.length === 0) {
    return (
      <div className="bg-[#161b22] rounded-md border border-[#30363d] p-4">
        <h2 className="text-base font-semibold text-[#e6edf3] mb-4">Languages</h2>
        <p className="text-[#8b949e] text-sm text-center py-8">No language data</p>
      </div>
    );
  }

  return (
    <div className="bg-[#161b22] rounded-md border border-[#30363d] p-4">
      <h2 className="text-base font-semibold text-[#e6edf3] mb-3">Languages</h2>

      {/* GitHub-style stacked horizontal bar */}
      <div className="flex h-2 rounded-full overflow-hidden mb-4">
        {languages.map((lang) => (
          <div
            key={lang.name}
            style={{
              width: `${lang.percentage}%`,
              backgroundColor: lang.color,
            }}
            title={`${lang.name} ${lang.percentage}%`}
          />
        ))}
      </div>

      {/* Language list with icons */}
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {languages.map((lang) => (
          <div key={lang.name} className="flex items-center gap-1.5">
            <LanguageIcon lang={lang.name} color={lang.color} />
            <span className="text-xs font-semibold text-[#e6edf3]">
              {lang.name}
            </span>
            <span className="text-xs text-[#8b949e]">
              {lang.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
