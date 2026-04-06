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
        className="w-3.5 h-3.5 rounded-full inline-block"
        style={{ backgroundColor: color }}
      />
    );
  }

  return (
    <img
      src={url}
      alt={lang}
      className="w-5 h-5"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export default function LanguageChart({ languages }: LanguageChartProps) {
  if (languages.length === 0) {
    return (
      <div className="bg-[#161B22] rounded-lg border border-[#30363D] p-6">
        <h2 className="font-display text-lg font-semibold text-[#E6EDF3] mb-4">Languages</h2>
        <p className="text-[#8B949E] text-sm text-center py-8">No language data</p>
      </div>
    );
  }

  const maxPct = languages[0]?.percentage || 1;

  return (
    <div className="bg-[#161B22] rounded-lg border border-[#30363D] p-6">
      <h2 className="font-display text-lg font-semibold text-[#E6EDF3] mb-5">Languages</h2>

      <div className="space-y-3">
        {languages.map((lang) => (
          <div key={lang.name} className="group">
            <div className="flex items-center gap-3 mb-1.5">
              {/* Icon or color dot */}
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                <LanguageIcon lang={lang.name} color={lang.color} />
              </div>

              {/* Language name */}
              <span className="text-sm text-[#E6EDF3] font-medium flex-1">
                {lang.name}
              </span>

              {/* Percentage */}
              <span className="font-mono text-sm text-[#E6EDF3] tabular-nums">
                {lang.percentage}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="ml-9 h-1.5 rounded-full bg-[#21262D] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(lang.percentage / maxPct) * 100}%`,
                  backgroundColor: lang.color,
                  opacity: 0.7,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
