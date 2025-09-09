import { DEFAULT_THEME, STORAGE_KEY, THEME_ATTRIBUTE } from './constants';

// вставляем скрип в тег head, чтобы  "прокинуть" сохранённую тему ещё до рендера React — то есть на этапе SSR/до гидратации
// чтобы не мигала тема при перезагрузке
export function getInitThemeScript({
  storageKey = STORAGE_KEY,
  defaultTheme = DEFAULT_THEME,
  attribute = THEME_ATTRIBUTE,
  enableSystem = true,
}: {
  storageKey?: string;
  defaultTheme?: string;
  attribute?: string;
  enableSystem?: boolean;
}) {
  return `
(function() {
  try {
    var storageKey = '${storageKey}';
    var defaultTheme = '${defaultTheme}';
    var attribute = '${attribute}';
    var enableSystem = ${enableSystem};

    var stored = localStorage.getItem(storageKey);
    var system = enableSystem && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    var theme = stored || (enableSystem ? system : null) || defaultTheme;

    if (attribute === "class") {
      document.documentElement.classList.remove("light","dark");
      document.documentElement.classList.add(theme);
    } else {
      document.documentElement.setAttribute(attribute, theme);
    }
  } catch (e) {}
})();
`;
}
