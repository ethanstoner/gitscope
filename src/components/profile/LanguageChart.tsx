import { useState } from 'react';
import type { LanguageStat } from '../../utils/types';

interface LanguageChartProps {
  languages: LanguageStat[];
}

// Map GitHub language names to devicon names
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
  React: 'react',
  Angular: 'angularjs',
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
        className="w-3 h-3 rounded-full inline-block"
        style={{ backgroundColor: color }}
      />
    );
  }

  return (
    <img
      src={url}
      alt={lang}
      className="w-4 h-4"
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

  const maxPct = languages[0]?.percentage || 1;

  return (
    <div className="bg-[#161b22] rounded-md border border-[#30363d] p-4">
      <h2 className="text-base font-semibold text-[#e6edf3] mb-4">Languages</h2>

      <div className="space-y-3">
        {languages.map((lang) => (
          <div key={lang.name} className="group">
            <div className="flex items-center gap-2.5 mb-1">
              {/* Icon or color dot */}
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <LanguageIcon lang={lang.name} color={lang.color} />
              </div>

              {/* Language name */}
              <span className="text-sm text-[#e6edf3] flex-1">
                {lang.name}
              </span>

              {/* Percentage */}
              <span className="font-mono text-xs text-[#8b949e] tabular-nums">
                {lang.percentage}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="ml-[30px] h-1.5 rounded-full bg-[#21262d] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(lang.percentage / maxPct) * 100}%`,
                  backgroundColor: lang.color,
                  opacity: 0.8,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
