# Carbon Design System - GitHub Repository Insights

**Repository:** https://github.com/carbon-design-system/carbon  
**Main Focus:** React Implementation (packages/react)  
**Status:** Active, Production-Ready  
**Latest Version:** v11+ (as of 2025)

---

## Repository Structure Overview

```
carbon/
├── packages/
│   ├── react/                    # Main React components library
│   ├── angular/                  # Angular components
│   ├── vue/                       # Vue components
│   ├── svelte/                    # Svelte components
│   ├── web-components/            # Web Components (framework agnostic)
│   ├── styles/                    # Core CSS/SCSS files
│   ├── icons/                     # Icon library
│   ├── icons-react/               # React icon wrapper
│   ├── telemetry/                 # Analytics
│   ├── layout/                    # Layout components
│   └── grid/                      # Grid system
├── .github/                       # GitHub workflows, templates
├── docs/                          # Documentation
├── examples/                      # Example implementations
└── README.md
```

---

## React Package Deep Dive (packages/react)

### Key Directories

#### `/src/components`
Contains all component implementations:
- Button
- Input
- Select/Dropdown
- Modal
- DataTable
- Notification
- Tabs
- Accordion
- Breadcrumb
- ComposedModal
- FluidForm
- And 40+ more...

#### `/src/components/[ComponentName]/`
Standard component structure:

```
Button/
├── Button.jsx              # Main component
├── Button.module.scss      # Styles
├── Button.stories.jsx      # Storybook examples
├── Button.test.jsx         # Jest tests
├── __snapshots__/          # Test snapshots
└── index.js                # Export
```

#### `/src/components/DataTable/`
Complex component folder:
```
DataTable/
├── DataTable.jsx
├── DataTableContainer.jsx
├── DataTableHead.jsx
├── DataTableRow.jsx
├── DataTableCell.jsx
├── head/
│   ├── TableHead.jsx
│   ├── TableHeader.jsx
│   └── ...
├── body/
│   └── TableBody.jsx
├── toolbar/
│   └── Toolbar.jsx
└── ... (pagination, batch actions, etc.)
```

### Component Implementation Pattern

**Typical component structure (Button example):**

```jsx
// Button.jsx
import React from 'react';
import classnames from 'classnames';
import { composeEventHandlers } from '@carbon/react';

const Button = React.forwardRef(function Button(
  {
    as: BaseComponent = 'button',
    children,
    className,
    disabled = false,
    kind = 'primary',  // primary, secondary, tertiary, ghost, danger
    size = 'md',       // xs, sm, md, lg, xl, 2xl
    onClick,
    href,
    type = 'button',
    ...rest
  },
  ref
) {
  const buttonClasses = classnames(className, {
    'cds--btn': true,
    [`cds--btn--${kind}`]: kind,
    [`cds--btn--${size}`]: size,
    'cds--btn--disabled': disabled,
  });

  const props = {
    className: buttonClasses,
    disabled: disabled || undefined,
    ref,
    ...rest,
  };

  return (
    <BaseComponent
      as={href ? 'a' : undefined}
      href={href}
      type={href ? undefined : type}
      onClick={onClick}
      {...props}
    >
      {children}
    </BaseComponent>
  );
});

export default Button;
```

### Prop Patterns Used Across Components

```jsx
// Most Carbon components follow these patterns:

// 1. Common props
className         // For custom styling
id               // Element ID
ref              // React.forwardRef support
disabled         // Disable interaction
hidden           // Hide element
aria-*           // Accessibility attributes

// 2. State props
value            // Current value (forms)
checked          // Checked state (checkboxes)
defaultValue     // Initial value
onChange         // Change handler
onBlur           // Blur handler
onFocus          // Focus handler

// 3. Content props
label            // Visible label
placeholder      // Placeholder text
children         // Nested content
title            // Tooltip/title

// 4. Styling props
kind             // Component variant/style
size             // Component size
invalid          // Error state
invalidText      // Error message
warn             // Warning state
warnText         // Warning message

// 5. Component-specific props
items            // For dropdowns (data)
columns          // For tables (structure)
rows             // For tables (data)
modalHeading     // Modal title
primaryButtonText // Modal button
```

### Common Patterns in Code

#### 1. Classnames Management
```jsx
import classnames from 'classnames';

const buttonClasses = classnames(
  'cds--btn',                    // Base class
  {
    [`cds--btn--${kind}`]: kind,  // Conditional class
    'cds--btn--disabled': disabled,
  },
  className                      // User-provided classes
);
```

#### 2. Event Handler Composition
```jsx
import { composeEventHandlers } from '@carbon/react';

const handleClick = composeEventHandlers([
  onClick,        // User-provided handler
  internalClick   // Component logic
]);
```

#### 3. ForwardRef Pattern
```jsx
const Component = React.forwardRef((props, ref) => {
  return <div ref={ref} {...props} />;
});
Component.displayName = 'Component';
```

#### 4. Conditional Rendering
```jsx
{invalid && (
  <div className="cds--form__helper-text" role="alert">
    {invalidText}
  </div>
)}
```

---

## SCSS/CSS Architecture

### CSS Class Naming Convention

**BEM-style with `cds--` prefix:**

```scss
// Block (main component)
.cds--button { }

// Element (part of component)
.cds--button__icon { }

// Modifier (variation)
.cds--button--primary { }
.cds--button--disabled { }

// State
.cds--button:focus { }
.cds--button:hover { }

// Nested variant
.cds--button--primary:hover { }
```

### Typical Component SCSS Structure

```scss
// Button.module.scss
@use '@carbon/styles' as *;

.button {
  // Base styles using tokens
  padding: $spacing-05 $spacing-06;
  font-size: $font-size-14;
  font-weight: $font-weight-semibold;
  line-height: $line-height-dense;
  border: 1px solid $border-strong;
  border-radius: $border-radius-medium;
  cursor: pointer;
  transition: all $duration-fast motion(standard);

  // States
  &:hover {
    background-color: var(--cds-background-hover);
  }

  &:focus {
    outline: 2px solid $focus;
    outline-offset: 2px;
  }

  &:active {
    background-color: var(--cds-background-active);
  }

  // Disabled
  &:disabled,
  &[aria-disabled='true'] {
    background-color: $layer-disabled;
    cursor: not-allowed;
    opacity: 0.5;
  }

  // Variants
  &.primary {
    background-color: $interactive;
    color: $text-inverse;
  }

  &.secondary {
    background-color: $layer;
    color: $text-primary;
    border-color: $border-subtle;
  }

  // Sizes
  &.sm {
    padding: $spacing-03 $spacing-04;
    font-size: $font-size-12;
  }

  &.lg {
    padding: $spacing-06 $spacing-08;
    font-size: $font-size-16;
  }
}
```

### SCSS Variables/Mixins Used

```scss
// Import from @carbon/styles
@use '@carbon/styles' as *;

// Available:
$spacing-01 through $spacing-13
$font-size-12 through $font-size-92
$font-weight-light, $font-weight-regular, $font-weight-semibold
$interactive           // Primary blue
$text-primary          // Main text color
$text-secondary        // Secondary text
$support-error         // Error red
$support-success       // Success green
$layer                 // Component background
$border-radius-medium  // Border radius
$duration-fast         // Animation duration
motion(standard)       // Easing function
$focus                 // Focus indicator color
$line-height-dense     // Tight line height
```

---

## Development Workflow

### Setting Up Local Development

```bash
# Clone repository
git clone https://github.com/carbon-design-system/carbon.git
cd carbon

# Install dependencies (monorepo setup with lerna/yarn workspaces)
yarn install

# Build packages
yarn build

# Watch for changes
yarn dev

# Run tests
yarn test

# Run specific package
cd packages/react
yarn dev
```

### Working with React Components

```bash
# Install React package from npm
npm install @carbon/react @carbon/icons-react

# Or link local development version
cd packages/react
yarn link

# In your project
yarn link '@carbon/react'
```

### Testing Components

```bash
# Run all tests
yarn test

# Run specific component tests
yarn test Button.test.jsx

# Watch mode
yarn test --watch

# Coverage
yarn test --coverage
```

### Storybook for Development

```bash
# Start Storybook (interactive component showcase)
yarn storybook

# Build static Storybook
yarn build-storybook
```

---

## Contributing & Extending

### Adding Custom Component Props

```jsx
// Custom wrapper component
function CustomButton({ customProp, ...props }) {
  return (
    <Button 
      {...props}
      className={classnames(props.className, {
        'custom-class': customProp
      })}
    />
  );
}
```

### Theming/Customization

```jsx
// Option 1: CSS Variable Override
document.documentElement.style.setProperty(
  '--cds-interactive',
  '#custom-blue'
);

// Option 2: Custom CSS Classes
<Button className="custom-button" />

// Custom CSS
.custom-button {
  background-color: var(--my-color) !important;
}
```

### Creating New Components

Template structure (when extending):

```jsx
import React from 'react';
import classnames from 'classnames';
import styles from './MyComponent.module.scss';

const MyComponent = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={classnames(styles.myComponent, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MyComponent.displayName = 'MyComponent';
export default MyComponent;
```

---

## Performance Considerations

### Bundle Size Optimization

```jsx
// ✓ Good: Import only needed components
import { Button, Input } from '@carbon/react';

// ✗ Avoid: Importing entire library
import * as CarbonReact from '@carbon/react';

// ✓ Tree-shaking works when using named imports
```

### Component Rendering

```jsx
// Memoize expensive components
const ExpensiveTable = React.memo(function DataTable({ data }) {
  return <Table rows={data} />;
});

// Only re-render when props change
<ExpensiveTable data={memoData} />
```

### Lazy Loading

```jsx
// Lazy load modals
const Modal = React.lazy(() => import('@carbon/react').then(m => ({ default: m.Modal })));

// In component
<Suspense fallback={<div>Loading...</div>}>
  <Modal open={isOpen} />
</Suspense>
```

---

## Known Issues & Workarounds

### Common Issues in Production

1. **CSS Not Loading**
   - Solution: Import `@carbon/styles`
   ```jsx
   import '@carbon/react/lib/styles.css';
   ```

2. **Theme Not Switching**
   - Ensure you're setting `data-carbon-theme` attribute
   ```jsx
   document.documentElement.setAttribute('data-carbon-theme', 'g100');
   ```

3. **Focus Not Visible**
   - Check for CSS that removes focus styles
   - Solution: Use `outline: 2px solid` instead of `outline: none`

4. **Modal Z-index Issues**
   - Modal has high z-index by default
   - Adjust other elements' z-index if needed

---

## Version History & Breaking Changes

### v11 (Latest as of 2025)

**Major changes:**
- Improved AI presence styling
- Enhanced modal accessibility
- Data table selection improvements
- New combo box features
- Better TypeScript support

### Migration Path (v10 → v11)

Most components are backward compatible. Main changes:
- Some prop names adjusted (check migration guide)
- CSS class names unchanged (BEM prefix consistent)
- API remained largely compatible

---

## GitHub Issues & Contributing

### Finding Issues to Contribute

1. Visit: https://github.com/carbon-design-system/carbon/issues
2. Filter by labels:
   - `good first issue` - Beginner friendly
   - `help wanted` - Active requests
   - `bug` - Bug fixes
   - `enhancement` - New features

### Submitting PRs

```bash
# Fork repository
# Create feature branch
git checkout -b feature/my-feature

# Make changes
# Test locally
yarn test

# Commit with conventional commits
git commit -m "feat: add new component functionality"

# Push to fork
git push origin feature/my-feature

# Create PR with detailed description
```

### PR Checklist

- [ ] Tests added/updated
- [ ] Storybook stories added
- [ ] Accessibility tested
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Follows Carbon conventions
- [ ] Passes CI/CD checks

---

## Useful GitHub Resources

### Documentation
- Main docs: carbondesignsystem.com
- GitHub README: carbon/README.md
- Contributing guide: CONTRIBUTING.md
- Code of conduct: CODE_OF_CONDUCT.md

### Tools
- Issue templates: .github/ISSUE_TEMPLATE/
- PR template: .github/pull_request_template.md
- GitHub Actions: .github/workflows/

### Community
- Discussions: github.com/.../discussions
- Wiki: github.com/.../wiki
- Releases: github.com/.../releases

---

## Key Takeaways from Repository

1. **Component-First Architecture**
   - Each component in own folder
   - Self-contained with styles, tests, stories
   - Reusable and composable

2. **Token-Based Styling**
   - All values from design tokens
   - Centralized theme management
   - CSS variables for runtime switching

3. **Accessibility as Foundation**
   - ARIA attributes baked in
   - Keyboard navigation by default
   - Tested with assistive technology

4. **Documentation Through Code**
   - Storybook for live examples
   - JSDoc comments for props
   - Tests as documentation
   - README in each component folder

5. **Monorepo Strategy**
   - Multiple framework implementations
   - Shared design tokens
   - Consistent across React/Angular/Vue/Svelte

6. **Active Maintenance**
   - Regular updates
   - Security patches
   - Community-driven enhancements
   - Backward compatibility focus

---

## Repository Statistics (as of 2025)

- **Stars:** 7.6k+
- **Forks:** 1.8k+
- **Contributors:** 100+
- **Open Issues:** ~600+
- **Main Language:** TypeScript/JavaScript
- **License:** Apache 2.0
- **Active Development:** Yes (continuous updates)
- **Versions:** 11+ (stable)

---

## Quick Reference: File Locations

| What | Where |
|------|-------|
| Component code | `packages/react/src/components/` |
| Styles | `packages/styles/scss/` |
| Icons | `packages/icons/svg/` |
| Tests | `packages/react/src/components/__tests__/` |
| Stories | `packages/react/src/components/*.stories.jsx` |
| Types | `packages/react/src/types/` |
| Utils | `packages/react/src/utils/` |
| Docs | `docs/` |

---

**Last Updated:** November 29, 2025  
**Use with:** Other Carbon reference documents for complete knowledge base