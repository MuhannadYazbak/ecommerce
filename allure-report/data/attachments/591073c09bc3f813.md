# Page snapshot

```yaml
- alert
- button "Open Next.js Dev Tools":
  - img
- button "Open issues overlay": 1 Issue
- navigation:
  - button "previous" [disabled]:
    - img "previous"
  - text: 1/1
  - button "next" [disabled]:
    - img "next"
- img
- link "Next.js 15.3.3 (stale) Webpack":
  - /url: https://nextjs.org/docs/messages/version-staleness
  - img
  - text: Next.js 15.3.3 (stale) Webpack
- img
- dialog "Build Error":
  - text: Build Error
  - button "Copy Stack Trace":
    - img
  - link "Go to related documentation":
    - /url: https://nextjs.org/docs/messages/module-not-found
    - img
  - link "Learn more about enabling Node.js inspector for server code with Chrome DevTools":
    - /url: https://nextjs.org/docs/app/building-your-application/configuring/debugging#server-side-code
    - img
  - paragraph: "Module not found: Can't resolve '@/components/admin/AdminBarChart'"
  - img
  - text: ./src/app/admin/chart/page.tsx (1:1)
  - button "Open in editor":
    - img
  - text: "Module not found: Can't resolve '@/components/admin/AdminBarChart' > 1 | import AdminBarChart from \"@/components/admin/AdminBarChart\"; | ^ 2 | 3 | export const metadata = { 4 | title: \"TechMart Admin | Bar Chart\","
  - link "https://nextjs.org/docs/messages/module-not-found":
    - /url: https://nextjs.org/docs/messages/module-not-found
- contentinfo:
  - paragraph: This error occurred during the build process and can only be dismissed by fixing the error.
```