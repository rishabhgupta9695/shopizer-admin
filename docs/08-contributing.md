# 08 — Contributing

## Branching Strategy

Use feature branches off `main` (or `develop` if the team uses gitflow):

```
main
 └── feature/your-feature-name
 └── fix/bug-description
 └── chore/task-description
```

Keep branch names lowercase and hyphenated. Example: `feature/add-product-discount-form`.

---

## Before You Start Coding

1. Pull latest from `main`
2. Create your branch
3. Run `npm install --legacy-peer-deps` if `package.json` changed
4. Make sure `ng serve` starts without errors

---

## Code Style

### TypeScript

- ESLint is configured via `.eslintrc.json`
- Run `npm run lint` before committing
- Auto-fix with `npm run lint:fix`
- Avoid `any` types where possible — use proper interfaces from `pages/shared/models/`

### SCSS

- Stylelint is configured via `.stylelintrc.json`
- Run `npm run lint:styles` before committing
- Component styles go in the component's `.scss` file
- Global/shared styles go in `@theme/styles/`

### General rules

- One component per file
- Keep components thin — business logic belongs in services
- Use `CrudService` for all HTTP calls, never `HttpClient` directly in components
- Use `ConfigService` for common lookups (countries, languages, currencies)
- Always unsubscribe from Observables in `ngOnDestroy` (or use `async` pipe in templates)

---

## Adding a New Feature Module

1. Create the folder under `src/app/pages/your-feature/`
2. Create `your-feature.module.ts`, `your-feature-routing.module.ts`, `your-feature.component.ts`
3. Add the lazy-loaded route in `pages-routing.module.ts`:
   ```ts
   {
     path: 'your-feature',
     loadChildren: 'app/pages/your-feature/your-feature.module#YourFeatureModule'
   }
   ```
4. Add menu items in `pages-menu.ts` with appropriate role guards
5. Create a service in `your-feature/services/your-feature.service.ts` that uses `CrudService`

---

## Adding a New Menu Item

Edit `src/app/pages/pages-menu.ts`:

```ts
{
  title: 'COMPONENTS.YOUR_FEATURE',   // i18n key
  key: 'COMPONENTS.YOUR_FEATURE',
  icon: 'icon-name',                  // Eva icon name
  link: '/pages/your-feature',
  hidden: false,
  guards: [IsAdmin]                   // role guard functions
}
```

Then add the translation key to `src/assets/i18n/en.json` (and other language files).

---

## i18n (Translations)

Translation files are in `src/assets/i18n/`. The app uses `@ngx-translate`.

- Add new keys to `en.json` first
- Mirror the key in `fr.json` (and any other supported languages)
- Use the `translate` pipe in templates: `{{ 'COMPONENTS.YOUR_KEY' | translate }}`
- Use `TranslateService.instant('KEY')` in TypeScript

---

## CI/CD

The project uses **CircleCI** (`.circleci/config.yml`). The pipeline runs:

1. `npm install --legacy-peer-deps`
2. `npm run lint:ci`
3. `ng build --prod`
4. Docker image build and push

Make sure your code passes lint and builds without errors before opening a PR.

---

## PR Checklist

Before opening a pull request:

- [ ] `ng build` succeeds with no errors
- [ ] `npm run lint:ci` passes (TS + SCSS lint)
- [ ] New menu items have i18n keys in all language files
- [ ] Role guards are applied to new routes and menu items
- [ ] No `console.log` statements left in code
- [ ] Component styles are scoped to the component file, not added to global styles
- [ ] Observables are properly unsubscribed

---

## Useful Commands Cheatsheet

```bash
ng serve -o                          # Start dev server
ng build                             # Production build
npm run lint                         # Lint TypeScript
npm run lint:fix                     # Auto-fix lint issues
npm run lint:styles                  # Lint SCSS
ng test                              # Run unit tests
ng generate component pages/feature/my-component  # Generate component
ng generate service pages/feature/services/my     # Generate service
```
