import { label, severity, owner } from 'allure-js-commons';

export function annotateTest({
  feature,
  level = 'normal',
  author = 'Muhannad',
}: {
  feature: string;
  level?: 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial';
  author?: string;
}) {
  label('feature', feature);
  severity(level);
  owner(author);
}