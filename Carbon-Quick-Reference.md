# Carbon Design System - Quick Implementation Guide for AI

**For VS Code AI Integration | Use with Main Reference Guide**

---

## Instant Lookup Tables

### CSS Variables Reference (All Common Tokens)

```css
/* SPACING - Use with margin/padding */
--spacing-01: 2px;
--spacing-02: 4px;
--spacing-03: 8px;
--spacing-04: 12px;
--spacing-05: 16px;  /* MOST COMMON */
--spacing-06: 24px;
--spacing-07: 32px;
--spacing-08: 40px;
--spacing-09: 48px;
--spacing-10: 64px;
--spacing-11: 80px;
--spacing-12: 96px;
--spacing-13: 160px;

/* TYPOGRAPHY */
--font-family-sans: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;
--font-size-12: 0.75rem (12px);
--font-size-14: 0.875rem (14px);  /* COMMON BODY */
--font-size-16: 1rem (16px);      /* DEFAULT BODY */
--font-size-20: 1.25rem (20px);
--font-size-24: 1.5rem (24px);
--font-size-32: 2rem (32px);
--font-weight-regular: 400;
--font-weight-semibold: 600;  /* HEADERS */

/* COLORS - LIGHT THEME (White) */
--background: #ffffff;
--text-primary: #161616;  /* Dark gray for text */
--text-secondary: #525252;  /* Medium gray */
--text-disabled: #a8a8a8;  /* Light gray */
--interactive: #0f62fe;  /* Blue 60 - PRIMARY ACTION */
--support-error: #da1e28;  /* Red - ERRORS */
--support-success: #24a148;  /* Green - SUCCESS */
--support-warning: #f1c21b;  /* Yellow - WARNING */
--support-info: #0043ce;  /* Blue - INFO */

/* COLORS - DARK THEME (Gray 100) */
--background-dark: #161616;
--text-primary-dark: #f4f4f4;
--interactive-dark: #78a9ff;  /* Blue - lighter for dark bg */

/* COMPONENT TOKENS */
--layer: #f4f4f4;
--layer-hover: #e8e8e8;
--layer-active: #d0d0d0;
--layer-selected: #d9d9d9;
--border-subtle: #e0e0e0;
--border-strong: #a8a8a8;
--field-01: #f4f4f4;  /* Input background */

/* FOCUS & STATES */
--focus: #0f62fe;  /* Blue - focus indicator */
--focus-inset: 2px inset;
--focus-width: 2px;
```

### Component Quick Guide

| Component | Size | When to Use | Key Variants |
|-----------|------|-------------|--------------|
| **Button** | md (40px) default | Actions, form submission | Primary, Secondary, Tertiary, Ghost, Danger |
| **Input** | md (40px) default | Text entry | Default, Fluid, Error, Disabled |
| **Dropdown** | md (40px) default | Single select | Dropdown, Multiselect, Combo box |
| **Modal** | Medium (default) | Focus attention | Transactional, Passive, Danger, Progress |
| **Data Table** | md (48px) rows | Display/organize data | With selection, With expansion |
| **Checkbox** | Standard | Multiple selections | Checked, Unchecked, Indeterminate |
| **Radio** | Standard | Single selection | Checked, Unchecked |
| **Toggle** | Standard | On/off binary | On, Off |
| **Toast** | Auto-dismiss | Success/error feedback | Auto-positions |
| **Notification** | Inline | Persistent feedback | Error, Warning, Success, Info |

### Typography Sizing Reference

```
PRODUCTIVE TYPE (Product UI):
Display              → 2.625rem (42px) [Plex 42]
Heading 01           → 2rem (32px) [Plex 32]      (h1)
Heading 02           → 1.75rem (28px) [Plex 28]   (h2)
Heading 03           → 1.5rem (24px) [Plex 24]    (h3)
Heading 04           → 1.125rem (18px) [Plex 18]  (h4)
Body text            → 1rem (16px) [Plex 16]      (body)
Button text          → 0.875rem (14px) [Plex 14]  (labels)
Helper text          → 0.875rem (14px) [Plex 14]  (captions)
Label text           → 0.75rem (12px) [Plex 12]   (small labels)

EXPRESSIVE TYPE (Editorial/Marketing):
Display              → 3.75rem (60px) [Plex 60]   (LARGE)
Heading 01           → 2.625rem (42px) [Plex 42]  (h1)
Heading 02           → 2rem (32px) [Plex 32]      (h2)
Heading 03           → 1.75rem (28px) [Plex 28]   (h3)
Body text            → 1.25rem (20px) [Plex 20]   (readable)
```

### Color Contrast Quick Check

```
WCAG AA - SMALL TEXT (<24px): Need 4.5:1 ratio
WCAG AA - LARGE TEXT (≥24px): Need 3:1 ratio

Using Carbon tokens? → AUTOMATICALLY COMPLIANT

Common Safe Combinations:
✓ Black text on White background (21:1)
✓ Blue 60 on White background (7:1)
✓ Blue 60 on Gray 10 background (8.8:1)
✓ White text on Gray 100 background (12:1)
✓ White text on Blue 60 background (10.5:1)

Always avoid:
✗ Gray 50 on White (not enough contrast)
✗ Blue 20 on White (not enough contrast)
✗ Light colors on light backgrounds
```

### Grid Breakpoint Responsive Values

```css
/* MOBILE FIRST APPROACH */

/* Small (320px) - 4 columns */
.container { padding: 0; margin: 0; }

/* Medium (672px) - 8 columns */
@media (min-width: 672px) {
  .container { padding: var(--spacing-04); margin: var(--spacing-04); }
}

/* Large (1056px) - 16 columns, MOST COMMON */
@media (min-width: 1056px) {
  .container { padding: var(--spacing-05); margin: var(--spacing-05); }
}

/* X-Large (1312px) - 16 columns */
@media (min-width: 1312px) {
  .container { padding: var(--spacing-05); margin: var(--spacing-05); }
}

/* Max (1584px) - 16 columns */
@media (min-width: 1584px) {
  .container { padding: var(--spacing-06); margin: var(--spacing-06); }
}
```

### Button Sizing Quick Reference

| Size | Height | When to Use |
|------|--------|-------------|
| XS | 24px | Tight spaces, inline |
| SM | 32px | Compact forms |
| **MD** | **40px** | **DEFAULT - use this** |
| LG | 48px | Spacious layouts |
| XL | 56px | Full-width modals |
| 2XL | 64px | Large tearsheets |

### Form Sizing (Inputs, Selects, Dropdowns)

| Size | Height | Typical Use |
|------|--------|------------|
| Small | 32px | Constricted space, with SM buttons |
| **Medium** | **40px** | **DEFAULT - most common** |
| Large | 48px | Spacious forms, with LG buttons |

---

## Code Snippets - Copy & Paste Ready

### Basic Button with Handler
```jsx
import { Button } from '@carbon/react';

<Button onClick={() => console.log('Clicked')}>
  Click me
</Button>
```

### Form with Validation
```jsx
import { TextInput, Button } from '@carbon/react';
import { useState } from 'react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    // Submit logic here
    setError('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        invalid={!!error}
        invalidText={error}
      />
      
      <TextInput
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <Button type="submit">Sign in</Button>
    </form>
  );
}
```

### Dropdown (Select One)
```jsx
import { Dropdown } from '@carbon/react';
import { useState } from 'react';

export function SelectRole() {
  const [selected, setSelected] = useState(null);

  return (
    <Dropdown
      id="role-select"
      label="Select Role"
      placeholder="Choose a role"
      items={[
        { id: 'admin', label: 'Admin' },
        { id: 'user', label: 'User' },
        { id: 'guest', label: 'Guest' },
      ]}
      selectedItem={selected}
      onSelectionChange={({ selectedItem }) => setSelected(selectedItem)}
    />
  );
}
```

### Data Table
```jsx
import { DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@carbon/react';

export function UsersTable({ users }) {
  return (
    <TableContainer title="Users">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Role</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
```

### Modal (Transactional)
```jsx
import { Modal, Button } from '@carbon/react';
import { useState } from 'react';

export function ConfirmDelete() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} kind="danger">
        Delete Item
      </Button>

      <Modal
        modalHeading="Delete Item?"
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        danger={true}
        open={isOpen}
        onRequestClose={() => setIsOpen(false)}
        onRequestSubmit={() => {
          // Delete logic here
          setIsOpen(false);
        }}
      >
        This action cannot be undone. Are you sure?
      </Modal>
    </>
  );
}
```

### Inline Notification (Error)
```jsx
import { InlineNotification } from '@carbon/react';

<InlineNotification
  kind="error"
  title="Error!"
  subtitle="Something went wrong. Please try again."
  onClose={() => console.log('Closed')}
/>
```

### Toast Notification (Success)
```jsx
import { ToastNotification } from '@carbon/react';

<ToastNotification
  kind="success"
  title="Success!"
  subtitle="Your changes have been saved."
/>
```

### Checkbox Group
```jsx
import { Checkbox } from '@carbon/react';
import { useState } from 'react';

export function Permissions() {
  const [perms, setPerms] = useState({
    read: false,
    write: false,
    admin: false,
  });

  return (
    <fieldset>
      <legend>Permissions</legend>
      
      <Checkbox
        id="read"
        checked={perms.read}
        onChange={(e) => setPerms({...perms, read: e.target.checked})}
        labelText="Read"
      />
      
      <Checkbox
        id="write"
        checked={perms.write}
        onChange={(e) => setPerms({...perms, write: e.target.checked})}
        labelText="Write"
      />
      
      <Checkbox
        id="admin"
        checked={perms.admin}
        onChange={(e) => setPerms({...perms, admin: e.target.checked})}
        labelText="Administrator"
      />
    </fieldset>
  );
}
```

### Radio Button Group
```jsx
import { RadioButton, RadioButtonGroup } from '@carbon/react';
import { useState } from 'react';

export function SelectTheme() {
  const [theme, setTheme] = useState('light');

  return (
    <RadioButtonGroup
      legend="Select Theme"
      name="theme"
      defaultSelected="light"
      onChange={(value) => setTheme(value)}
    >
      <RadioButton value="light" id="light" labelText="Light" />
      <RadioButton value="dark" id="dark" labelText="Dark" />
      <RadioButton value="auto" id="auto" labelText="System Default" />
    </RadioButtonGroup>
  );
}
```

---

## Common Patterns

### Success Message Flow
```
User Action → Processing → ✓ Toast (Success) → Auto-dismiss in 5-8s
```

### Error Handling Pattern
```
Form Submit → Validation → ✗ Inline error below field → User corrects → Retry
```

### Multi-Step Wizard
```
Step 1 → [Previous] [Next] → Step 2 → [Previous] [Complete] → Done
```

### Confirmation for Destructive Action
```
User clicks Delete → Modal appears → "Are you sure?" → [Cancel] [Delete]
```

### Empty State Pattern
```
No data message → Icon + Illustration → Call-to-action button
Example: "No items yet. Create your first item"
```

### Loading State Pattern
```
Before Data → Skeleton State (don't use spinner) → After Data Loaded
```

---

## Accessibility Checklist

- [ ] All interactive elements keyboard accessible (Tab, Enter, Space, Arrows)
- [ ] Focus indicators visible on all interactive elements
- [ ] Form labels associated with inputs (for/id or wrap)
- [ ] Color not sole indicator (also use icon, text, pattern)
- [ ] Images have alt text
- [ ] Headings in logical order (h1, h2, h3, not skipping levels)
- [ ] 4.5:1 contrast for small text, 3:1 for large text
- [ ] Modal focus trapped (Tab within modal only)
- [ ] Error messages describe problem + solution
- [ ] Tested with screen reader (VoiceOver, NVDA, JAWS)
- [ ] Tested keyboard-only (no mouse)
- [ ] Tested at all 5 breakpoints
- [ ] Color blindness simulation (Stark plugin)

---

## Common Pitfalls to Avoid

❌ **DON'T:**
- Hardcode colors (use CSS variables/tokens)
- Mix button sizes in same group
- Use placeholder text only (need label)
- Skip label for inputs
- Truncate button text
- Use generic "OK" labels
- Center button labels
- Use color alone for status
- Nest dropdowns
- Forget focus management in modals
- Use flashing animations (accessibility hazard)
- Put critical info in placeholder text

✓ **DO:**
- Use design tokens for everything
- Keep buttons same size in groups
- Always include visible labels
- Use {verb} + {noun} for labels
- Wrap long button text to 2 lines
- Use specific action words
- Left-align button labels
- Combine color + icon + text
- Keep dropdowns simple
- Trap focus in modals
- Static, subtle animations
- Keep important info in labels/instructions

---

## Responsive Design Quick Rules

1. **Mobile First:** Design smallest screen (320px) first
2. **Test All Breakpoints:**
   - 320px (Mobile)
   - 672px (Tablet)
   - 1056px (Desktop - MOST COMMON)
   - 1312px (Large desktop)
   - 1584px (Extra large)

3. **Flexible vs Fixed:**
   - Columns: Flexible (scale with screen)
   - Components: Mostly fixed height, fluid width
   - Margins/Padding: Fixed at breakpoints

4. **Touch-Friendly Sizes:**
   - Minimum tap target: 40px × 40px
   - Button height: 40px minimum
   - Spacing: 16px minimum between tappable elements

---

## Performance Tips

- ✓ Import only needed components
- ✓ Use React.memo for expensive components
- ✓ Lazy load modals, complex tables
- ✓ Optimize images before using
- ✓ Use CSS variables (cached)
- ✓ Code split large pages
- ✓ Test with Lighthouse

---

## File Structure Suggestion

```
src/
├── components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── Sidebar.jsx
│   └── common/
│       ├── Button.jsx
│       ├── Modal.jsx
│       └── Toast.jsx
├── styles/
│   ├── tokens.css
│   ├── global.css
│   └── components.css
├── pages/
│   ├── Dashboard.jsx
│   ├── Users.jsx
│   └── Settings.jsx
├── utils/
│   ├── api.js
│   ├── validation.js
│   └── constants.js
└── App.jsx
```

---

## Theme Switching Example

```jsx
import { useState } from 'react';

export function ThemeSwitcher() {
  const [theme, setTheme] = useState('white');

  const toggleTheme = () => {
    const newTheme = theme === 'white' ? 'g100' : 'white';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-carbon-theme', newTheme);
  };

  return (
    <Button onClick={toggleTheme}>
      {theme === 'white' ? '🌙 Dark' : '☀️ Light'}
    </Button>
  );
}

// In your main CSS or _document.html:
// [data-carbon-theme="g100"] { 
//   background: var(--background-dark);
//   color: var(--text-primary-dark);
// }
```

---

## Installation Commands Reference

```bash
# React
npm install @carbon/react @carbon/icons-react

# Next.js
npm install @carbon/react @carbon/icons-react

# With CSS
npm install @carbon/styles

# Development
npm install -D @carbon/eslint-config-carbon

# All together
npm install @carbon/react @carbon/icons-react @carbon/styles
```

---

## Documentation Resources

| Resource | Purpose |
|----------|---------|
| https://carbondesignsystem.com | Main docs (design + code) |
| https://carbondesignsystem.com/components | Component library |
| https://carbondesignsystem.com/patterns | Pattern solutions |
| https://carbondesignsystem.com/guidelines | Accessibility, content |
| GitHub carbon repo | Source code, issues, PRs |
| Storybook | Interactive component showcase |
| Figma kits | Design mockups, prototypes |

---

**Last Updated:** November 29, 2025  
**Use with:** Carbon-Design-System-AI-Context.md (main comprehensive guide)  
**Quick Ref Version:** 1.0