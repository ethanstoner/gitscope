import type { LanguageStat } from '../../utils/types';

interface LanguageChartProps {
  languages: LanguageStat[];
}

// Map language names to Simple Icons slugs
const iconSlugs: Record<string, string> = {
  JavaScript: 'javascript',
  TypeScript: 'typescript',
  Python: 'python',
  Java: 'oracle',
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
  Shell: 'gnubash',
  HTML: 'html5',
  CSS: 'css3',
  SCSS: 'sass',
  Vue: 'vuedotjs',
  Svelte: 'svelte',
  'Jupyter Notebook': 'jupyter',
  R: 'r',
  Scala: 'scala',
  Haskell: 'haskell',
  Elixir: 'elixir',
  Perl: 'perl',
  'Objective-C': 'apple',
  Dockerfile: 'docker',
  PowerShell: 'powershell',
  TeX: 'latex',
  MATLAB: 'mathworks',
};

function getIconUrl(lang: string): string {
  const slug = iconSlugs[lang];
  if (!slug) return '';
  return `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${slug}.svg`;
}

export default function LanguageChart({ languages }: LanguageChartProps) {
  if (languages.length === 0) {
    return (
      <div className="bg-[#13151A] rounded-lg border border-white/6 p-6">
        <h2 className="font-display text-lg font-semibold text-[#E8E9ED] mb-4">Languages</h2>
        <p className="text-[#8B8F96] text-sm text-center py-8">No language data</p>
      </div>
    );
  }

  const maxPct = languages[0]?.percentage || 1;

  return (
    <div className="bg-[#13151A] rounded-lg border border-white/6 p-6">
      <h2 className="font-display text-lg font-semibold text-[#E8E9ED] mb-5">Languages</h2>

      <div className="space-y-3">
        {languages.map((lang) => {
          const slug = iconSlugs[lang.name];
          return (
            <div key={lang.name} className="group">
              <div className="flex items-center gap-3 mb-1.5">
                {/* Icon or color dot */}
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                  {slug ? (
                    <img
                      src={getIconUrl(lang.name)}
                      alt={lang.name}
                      className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity"
                      style={{ filter: `brightness(0) saturate(100%) invert(1)` }}
                      loading="lazy"
                    />
                  ) : (
                    <span
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: lang.color }}
                    />
                  )}
                </div>

                {/* Language name */}
                <span className="text-sm text-[#E8E9ED] font-medium flex-1">
                  {lang.name}
                </span>

                {/* Percentage */}
                <span className="font-mono text-sm text-[#E8E9ED] tabular-nums">
                  {lang.percentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="ml-9 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
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
          );
        })}
      </div>
    </div>
  );
}
