# 🎨 IBM Carbon Design System - Comprehensive Guide
**Generated:** January 14, 2026
**Purpose:** Reference documentation for AI and developers working with Carbon Design System
**Application:** IBM watsonx Alerts NOC Dashboard

---

## 📋 Table of Contents

1. [SCSS/Sass Theming](#1-scsssass-theming)
2. [Design Tokens](#2-design-tokens)
3. [Component Patterns](#3-component-patterns)
4. [Grid System](#4-grid-system)
5. [Layer Component](#5-layer-component)
6. [Icons & Indicators](#6-icons--indicators)
7. [Notifications](#7-notifications)
8. [Carbon Charts](#8-carbon-charts)
9. [Accessibility](#9-accessibility)
10. [Form Patterns](#10-form-patterns)
11. [Best Practices](#11-best-practices)

---

## 1. SCSS/Sass Theming

### Import Structure (CRITICAL)

```scss
// ✅ CORRECT - Use @use with namespaces
@use '@carbon/react/scss/spacing' as *;      // Spacing tokens ($spacing-01 to $spacing-13)
@use '@carbon/react/scss/theme' as *;        // Theme tokens ($text-primary, $layer-01, etc.)
@use '@carbon/react/scss/type' as *;         // Typography tokens
@use '@carbon/react' as react;               // Components and mixins
@use '@carbon/colors' as *;                  // Color palette ($red-60, $blue-60, etc.)

// ❌ WRONG - Don't use @import (deprecated)
@import '@carbon/styles';
```

### Type Styles (Typography)

```scss
// ✅ CORRECT - Use namespaced mixin
.my-heading {
    @include react.type-style('heading-compact-02');
}

.my-body {
    @include react.type-style('body-compact-01');
}

.my-label {
    @include react.type-style('label-01');
}

// ❌ WRONG - Without namespace
.my-heading {
    @include type-style('heading-compact-02');  // Will fail!
}
```

### Available Type Styles

| Token | Use Case |
|-------|----------|
| `heading-01` to `heading-07` | Page/section headings |
| `heading-compact-01/02` | Compact headings (cards, tiles) |
| `body-01`, `body-02` | Body text |
| `body-compact-01/02` | Compact body text |
| `label-01`, `label-02` | Form labels, captions |
| `helper-text-01/02` | Helper/hint text |
| `code-01`, `code-02` | Code snippets |

---

## 2. Design Tokens

### Spacing Scale (Use Instead of Magic Numbers!)

```scss
// ✅ CORRECT - Use spacing tokens
.my-component {
    padding: $spacing-05;           // 1rem (16px)
    margin-bottom: $spacing-04;     // 0.75rem (12px)
    gap: $spacing-03;               // 0.5rem (8px)
}

// ❌ WRONG - Magic numbers
.my-component {
    padding: 16px;
    margin-bottom: 12px;
    gap: 8px;
}
```

### Spacing Token Reference

| Token | Value | Pixels |
|-------|-------|--------|
| `$spacing-01` | 0.125rem | 2px |
| `$spacing-02` | 0.25rem | 4px |
| `$spacing-03` | 0.5rem | 8px |
| `$spacing-04` | 0.75rem | 12px |
| `$spacing-05` | 1rem | 16px |
| `$spacing-06` | 1.5rem | 24px |
| `$spacing-07` | 2rem | 32px |
| `$spacing-08` | 2.5rem | 40px |
| `$spacing-09` | 3rem | 48px |
| `$spacing-10` | 4rem | 64px |
| `$spacing-11` | 5rem | 80px |
| `$spacing-12` | 6rem | 96px |
| `$spacing-13` | 10rem | 160px |

### Theme Color Tokens

```scss
// Text colors
color: $text-primary;        // Main text
color: $text-secondary;      // Secondary/muted text
color: $text-placeholder;    // Placeholder text
color: $text-helper;         // Helper text
color: $text-error;          // Error messages
color: $text-on-color;       // Text on colored backgrounds

// Background/Layer colors
background: $layer-01;       // First layer (cards on page)
background: $layer-02;       // Second layer (nested cards)
background: $layer-03;       // Third layer

// Border colors
border-color: $border-subtle-01;   // Subtle borders
border-color: $border-strong-01;   // Strong borders

// Interactive colors
color: $link-primary;        // Links
background: $button-primary; // Primary buttons
```

### Severity Colors (From Carbon Palette)

```scss
@use '@carbon/colors' as *;

// Severity mapping
$severity-critical: $red-60;      // #da1e28
$severity-major: $orange-40;      // #ff832b
$severity-minor: $yellow-30;      // #f1c21b
$severity-info: $blue-60;         // #4589ff

// Usage with transparency
background: rgba($red-60, 0.2);   // 20% opacity critical bg
```

---

## 3. Component Patterns

### Functional Component Structure

```tsx
/**
 * Component Name
 * 
 * Brief description of what this component does.
 * 
 * @example
 * <MyComponent prop1="value" onAction={handleAction} />
 */

import { useState, useEffect, useMemo } from 'react';
import { Button, Tag } from '@carbon/react';
import { Add } from '@carbon/icons-react';
import '@/styles/MyComponent.scss';

// ==========================================
// Types
// ==========================================

export interface MyComponentProps {
    title: string;
    variant?: 'default' | 'compact';
    onAction?: () => void;
}

// ==========================================
// Constants (outside component)
// ==========================================

const VARIANT_CONFIG = {
    default: { size: 'lg', padding: 'large' },
    compact: { size: 'sm', padding: 'small' },
} as const;

// ==========================================
// Component
// ==========================================

export function MyComponent({
    title,
    variant = 'default',
    onAction,
}: MyComponentProps) {
    // 1. State
    const [isLoading, setIsLoading] = useState(false);
    
    // 2. Derived/Memoized values
    const config = useMemo(() => VARIANT_CONFIG[variant], [variant]);
    
    // 3. Handlers
    const handleClick = () => {
        setIsLoading(true);
        onAction?.();
    };
    
    // 4. Effects
    useEffect(() => {
        // Side effects here
    }, []);
    
    // 5. Render
    return (
        <div className={`my-component my-component--${variant}`}>
            <h3>{title}</h3>
            <Button 
                kind="primary" 
                size={config.size}
                renderIcon={Add}
                onClick={handleClick}
            >
                Action
            </Button>
        </div>
    );
}

export default MyComponent;
```

### Barrel Exports Pattern

```tsx
// src/components/index.ts
export { MyComponent } from './common/MyComponent';
export type { MyComponentProps } from './common/MyComponent';

export { KPICard } from './shared/KPICard';
export type { KPICardData } from './shared/KPICard';

// Re-export for convenience
export * from './layout';
```

---

## 4. Grid System

### 16-Column Responsive Grid

```tsx
import { Grid, Column } from '@carbon/react';

function MyLayout() {
    return (
        <Grid>
            {/* Full width on mobile, half on medium, third on large */}
            <Column sm={4} md={4} lg={5}>
                <Tile>Content 1</Tile>
            </Column>
            <Column sm={4} md={4} lg={5}>
                <Tile>Content 2</Tile>
            </Column>
            <Column sm={4} md={8} lg={6}>
                <Tile>Content 3</Tile>
            </Column>
        </Grid>
    );
}
```

### Breakpoint Reference

| Breakpoint | Prefix | Min Width | Columns |
|------------|--------|-----------|---------|
| Small | `sm` | 320px | 4 |
| Medium | `md` | 672px | 8 |
| Large | `lg` | 1056px | 16 |
| X-Large | `xlg` | 1312px | 16 |
| Max | `max` | 1584px | 16 |

### Grid SCSS Utilities

```scss
@use '@carbon/react/scss/breakpoint' as *;

.my-component {
    // Mobile first
    padding: $spacing-03;
    
    @include breakpoint('md') {
        padding: $spacing-05;
    }
    
    @include breakpoint('lg') {
        padding: $spacing-07;
    }
}
```

---

## 5. Layer Component

### Purpose
`<Layer>` provides theming context for nested components. Each layer automatically adjusts background colors.

```tsx
import { Layer, Tile } from '@carbon/react';

function NestedContent() {
    return (
        <Tile>  {/* layer-01 background */}
            <p>First level content</p>
            
            <Layer>
                <Tile>  {/* layer-02 background (automatic!) */}
                    <p>Nested content</p>
                    
                    <Layer>
                        <Tile>  {/* layer-03 background */}
                            <p>Deeply nested</p>
                        </Tile>
                    </Layer>
                </Tile>
            </Layer>
        </Tile>
    );
}
```

### When to Use Layer
- Nested cards/tiles
- Modal content
- Dropdown menus
- Popover content
- Any UI that "floats" above other content

---

## 6. Icons & Indicators

### Icon Import Pattern

```tsx
// ✅ CORRECT - Direct imports (tree-shakeable)
import { 
    ErrorFilled,
    WarningFilled,
    WarningAlt,
    InformationFilled,
    Checkmark,
    Close,
} from '@carbon/icons-react';

// Usage with size
<ErrorFilled size={24} />
<WarningFilled size={20} className="warning-icon" />
```

### Severity Icon Mapping

| Severity | Icon | Color Token |
|----------|------|-------------|
| Critical | `ErrorFilled` | `$red-60` |
| Major/Warning | `WarningFilled` | `$orange-40` |
| Minor/Caution | `WarningAlt` | `$yellow-30` |
| Info | `InformationFilled` | `$blue-60` |
| Success | `CheckmarkFilled` | `$green-60` |

### Icon Button Pattern

```tsx
<Button
    kind="ghost"
    size="sm"
    renderIcon={View}
    hasIconOnly
    iconDescription="View details"  // Required for accessibility!
    tooltipPosition="bottom"
    onClick={handleView}
/>
```

### StatusIcon Component Pattern

```tsx
// Reusable status indicator
interface StatusIconProps {
    status: 'failed' | 'caution-major' | 'caution-minor' | 'succeeded' | 'normal';
    size?: number;
}

const STATUS_ICONS = {
    failed: { icon: ErrorFilled, color: '$red-60' },
    'caution-major': { icon: WarningFilled, color: '$orange-40' },
    'caution-minor': { icon: WarningAlt, color: '$yellow-30' },
    succeeded: { icon: CheckmarkFilled, color: '$green-60' },
    normal: { icon: InformationFilled, color: '$blue-60' },
};

export function StatusIcon({ status, size = 20 }: StatusIconProps) {
    const { icon: Icon, color } = STATUS_ICONS[status];
    return <Icon size={size} style={{ color }} />;
}
```

---

## 7. Notifications

### Toast Notifications

```tsx
import { ToastNotification } from '@carbon/react';

// In component
<ToastNotification
    kind="success"           // success | error | warning | info
    title="Action completed"
    subtitle="Your changes have been saved"
    timeout={5000}           // Auto-dismiss after 5s
    onClose={() => {}}       // Called when dismissed
    lowContrast              // Optional: softer colors
/>
```

### Inline Notifications

```tsx
import { InlineNotification } from '@carbon/react';

<InlineNotification
    kind="error"
    title="Error"
    subtitle="Failed to save changes. Please try again."
    hideCloseButton={false}
    onClose={() => setShowError(false)}
/>
```

### Actionable Notifications

```tsx
import { ActionableNotification } from '@carbon/react';

<ActionableNotification
    kind="warning"
    title="Session expiring"
    subtitle="Your session will expire in 5 minutes"
    actionButtonLabel="Extend Session"
    onActionButtonClick={handleExtendSession}
    onClose={() => {}}
/>
```

### Toast Provider Pattern (Recommended)

```tsx
// src/contexts/ToastContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import { ToastNotification } from '@carbon/react';

interface Toast {
    id: string;
    kind: 'success' | 'error' | 'warning' | 'info';
    title: string;
    subtitle?: string;
}

interface ToastContextValue {
    addToast: (kind: Toast['kind'], title: string, subtitle?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (kind: Toast['kind'], title: string, subtitle?: string) => {
        const id = `toast-${Date.now()}`;
        setToasts(prev => [...prev, { id, kind, title, subtitle }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="toast-container">
                {toasts.map(toast => (
                    <ToastNotification
                        key={toast.id}
                        kind={toast.kind}
                        title={toast.title}
                        subtitle={toast.subtitle}
                        timeout={5000}
                        onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};
```

---

## 8. Carbon Charts

### Installation & Setup

```tsx
import { DonutChart, LineChart, StackedBarChart, StackedAreaChart } from '@carbon/charts-react';
import '@carbon/charts-react/styles.css';
```

### Data Format

```tsx
// Time series data
const timeSeriesData = [
    { group: 'Critical', date: new Date('2024-01-01'), value: 45 },
    { group: 'Critical', date: new Date('2024-01-02'), value: 52 },
    { group: 'Major', date: new Date('2024-01-01'), value: 88 },
    { group: 'Major', date: new Date('2024-01-02'), value: 95 },
];

// Distribution data
const distributionData = [
    { group: 'Critical', value: 12 },
    { group: 'Major', value: 47 },
    { group: 'Minor', value: 68 },
    { group: 'Info', value: 120 },
];
```

### Chart Options Pattern

```tsx
import { ScaleTypes } from '@carbon/charts';

// Area/Line Chart Options
const areaChartOptions = {
    axes: {
        left: {
            stacked: true,
            scaleType: ScaleTypes.LINEAR,
            mapsTo: 'value',
        },
        bottom: {
            scaleType: ScaleTypes.TIME,
            mapsTo: 'date',
        },
    },
    height: '320px',
    color: {
        scale: {
            Critical: '#da1e28',
            Major: '#ff832b',
            Minor: '#f1c21b',
            Info: '#4589ff',
        },
    },
    curve: 'curveMonotoneX',
    theme: 'g100',  // or 'white' for light theme
    toolbar: { enabled: true },
    legend: {
        position: 'top',
        alignment: 'center',
    },
};

// Donut Chart Options
const donutOptions = {
    resizable: true,
    donut: {
        center: { label: 'Total' },
        alignment: 'center',
    },
    legend: {
        position: 'bottom',
        alignment: 'center',
    },
    theme: 'g100',
    toolbar: { enabled: false },
};

// Bar Chart Options
const barChartOptions = {
    axes: {
        left: { mapsTo: 'value', stacked: true },
        bottom: { mapsTo: 'key', scaleType: ScaleTypes.LABELS },
    },
    height: '400px',
    theme: 'g100',
};
```

### Theme Integration

```tsx
// Detect and sync with app theme
useEffect(() => {
    const detectTheme = () => {
        const themeSetting = document.documentElement.getAttribute('data-theme-setting');
        if (themeSetting === 'light') {
            setChartTheme('white');
        } else if (themeSetting === 'dark') {
            setChartTheme('g100');
        } else {
            // System preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setChartTheme(prefersDark ? 'g100' : 'white');
        }
    };

    detectTheme();
    
    // Watch for theme changes
    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme-setting'],
    });

    return () => observer.disconnect();
}, []);
```

### Chart Wrapper Component

```tsx
// Handles loading states and empty data
interface ChartWrapperProps {
    ChartComponent: React.ComponentType<any>;
    data: any[];
    options: any;
    height?: string;
}

export function ChartWrapper({ ChartComponent, data, options, height = '300px' }: ChartWrapperProps) {
    if (!data || data.length === 0) {
        return (
            <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--cds-text-secondary)' }}>No data available</p>
            </div>
        );
    }

    return <ChartComponent data={data} options={{ ...options, height }} />;
}
```

---

## 9. Accessibility

### WCAG 2.1 AA Compliance

Carbon is built with accessibility in mind. Follow these patterns:

### Keyboard Navigation

```tsx
// All interactive elements must be keyboard accessible
<Button onClick={handleClick}>Click me</Button>  // ✅ Focusable by default

// For custom interactive elements
<div 
    role="button"
    tabIndex={0}
    onClick={handleClick}
    onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
        }
    }}
>
    Custom button
</div>
```

### ARIA Labels

```tsx
// Icon-only buttons MUST have iconDescription
<Button
    kind="ghost"
    hasIconOnly
    renderIcon={View}
    iconDescription="View alert details"  // Required!
/>

// Tables
<Table aria-label="Priority alerts table">

// Regions
<section aria-labelledby="alerts-heading">
    <h2 id="alerts-heading">Priority Alerts</h2>
</section>

// Live regions for dynamic content
<div aria-live="polite" aria-atomic="true">
    {statusMessage}
</div>
```

### Color Contrast

```scss
// Carbon tokens ensure proper contrast
// Always use semantic tokens, not raw colors

// ✅ CORRECT
color: $text-primary;
background: $layer-01;

// ❌ WRONG - May not meet contrast requirements
color: #666;
background: #f0f0f0;
```

### Focus Indicators

```scss
// Carbon provides focus styles, but you can customize
.my-interactive-element {
    &:focus {
        outline: 2px solid $focus;
        outline-offset: 2px;
    }
    
    &:focus:not(:focus-visible) {
        outline: none;  // Hide for mouse users
    }
    
    &:focus-visible {
        outline: 2px solid $focus;  // Show for keyboard users
    }
}
```

---

## 10. Form Patterns

### Basic Form Structure

```tsx
import { 
    Form, 
    TextInput, 
    TextArea, 
    Select, 
    SelectItem,
    Button,
    FormGroup,
    Stack,
} from '@carbon/react';

function MyForm() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate
        const newErrors: Record<string, string> = {};
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        // Submit
        onSubmit(formData);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Stack gap={6}>
                <TextInput
                    id="title"
                    labelText="Title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    invalid={!!errors.title}
                    invalidText={errors.title}
                    required
                />
                
                <TextArea
                    id="description"
                    labelText="Description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                />
                
                <Select
                    id="priority"
                    labelText="Priority"
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                >
                    <SelectItem value="critical" text="Critical" />
                    <SelectItem value="high" text="High" />
                    <SelectItem value="medium" text="Medium" />
                    <SelectItem value="low" text="Low" />
                </Select>
                
                <div className="form-actions">
                    <Button kind="secondary" onClick={onCancel}>Cancel</Button>
                    <Button kind="primary" type="submit">Submit</Button>
                </div>
            </Stack>
        </Form>
    );
}
```

### Form Validation States

```tsx
<TextInput
    id="email"
    labelText="Email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    
    // Validation states
    invalid={!!emailError}
    invalidText={emailError}
    
    // Warning (non-blocking)
    warn={isWeakPassword}
    warnText="Consider using a stronger password"
    
    // Helper text
    helperText="We'll never share your email"
    
    // Disabled state
    disabled={isSubmitting}
    
    // Read-only
    readOnly={!isEditing}
/>
```

---

## 11. Best Practices

### DO ✅

1. **Use Carbon tokens** - Never hardcode colors, spacing, or typography
2. **Use semantic components** - `<Button>` not `<div onClick>`
3. **Provide aria labels** - All interactive elements need descriptions
4. **Use Layer for nesting** - Proper visual hierarchy
5. **Follow component structure** - State → Constants → Handlers → Effects → Render
6. **Create reusable components** - DRY principle
7. **Use TypeScript interfaces** - Type all props and data
8. **Handle loading/empty states** - Always show feedback
9. **Use barrel exports** - Clean imports
10. **Document components** - JSDoc comments

### DON'T ❌

1. **Don't use magic numbers** - Use `$spacing-05` not `16px`
2. **Don't use @import** - Use `@use` with namespaces
3. **Don't skip iconDescription** - Required for icon-only buttons
4. **Don't nest too deeply** - Max 3 Layer levels
5. **Don't ignore keyboard nav** - All interactive elements must be focusable
6. **Don't hardcode themes** - Use CSS variables
7. **Don't create duplicate components** - Check existing first
8. **Don't skip error handling** - Always handle API failures
9. **Don't use inline styles** - Use SCSS with tokens
10. **Don't forget cleanup** - useEffect cleanup functions

### File Organization

```
src/
├── components/
│   ├── common/           # Reusable UI components
│   │   ├── StatusTag.tsx
│   │   ├── PageHeader.tsx
│   │   └── index.ts
│   ├── shared/           # Feature-specific shared components
│   │   ├── KPICard.tsx
│   │   ├── NoisyDevicesCard.tsx
│   │   └── index.ts
│   ├── layout/           # Layout components
│   │   ├── AppHeader.tsx
│   │   └── AppLayout.tsx
│   └── index.ts          # Barrel export
├── constants/            # Type definitions and constants
│   ├── alerts.tsx        # Alert types, configs, helpers
│   └── index.ts
├── services/             # API and data services
│   ├── AlertDataService.ts
│   └── index.ts
├── styles/               # Component-specific SCSS
│   ├── _variables.scss   # Custom variables
│   └── ComponentName.scss
├── hooks/                # Custom React hooks
│   └── useToast.tsx
├── contexts/             # React contexts
│   └── ToastContext.tsx
└── pages/                # Page components
    └── dashboard/
        └── index.tsx
```

---

## Quick Reference Card

### Common Imports

```tsx
// Components
import { Button, Tag, Tile, Modal, DataTable } from '@carbon/react';

// Icons
import { Add, View, Edit, Delete, ErrorFilled } from '@carbon/icons-react';

// Charts
import { DonutChart, LineChart } from '@carbon/charts-react';
import { ScaleTypes } from '@carbon/charts';
import '@carbon/charts-react/styles.css';
```

### Common SCSS

```scss
@use '@carbon/react/scss/spacing' as *;
@use '@carbon/react/scss/theme' as *;
@use '@carbon/react' as react;
@use '@carbon/colors' as *;

.my-component {
    padding: $spacing-05;
    background: $layer-01;
    color: $text-primary;
    
    h3 {
        @include react.type-style('heading-compact-02');
    }
    
    p {
        @include react.type-style('body-compact-01');
        color: $text-secondary;
    }
}
```

---

*This guide is based on IBM Carbon Design System v11. For the latest updates, refer to [carbondesignsystem.com](https://carbondesignsystem.com)*


---

## 12. Filtering Patterns

### Overview
Filtering allows users to trim down visible items when working through large data sets. Carbon supports several selection methods:

| Method | Description | Use Case |
|--------|-------------|----------|
| Single selection | User picks one attribute | Radio-button behavior |
| Multiselection | User picks multiple attributes | Checkbox behavior |
| Multiple categories | Filters across different data categories | Complex filtering |
| Batch updates | All filters applied together | Slow data, many selections |
| Instant updates | Data updates per selection | Fast data, few selections |

### Implementation Pattern (Instant Updates)

```tsx
// Filter state
const [searchQuery, setSearchQuery] = useState('');
const [selectedPriority, setSelectedPriority] = useState(PRIORITY_OPTIONS[0]);
const [selectedStatus, setSelectedStatus] = useState(STATUS_OPTIONS[0]);
const [activeQuickFilters, setActiveQuickFilters] = useState<string[]>([]);

// Filter options
const PRIORITY_OPTIONS = [
    { id: 'all', text: 'All Priorities' },
    { id: 'critical', text: 'Critical' },
    { id: 'high', text: 'High' },
];

// Filtered data (memoized for performance)
const filteredData = useMemo(() => {
    let result = [...data];
    
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(item => 
            item.title.toLowerCase().includes(query)
        );
    }
    
    if (selectedPriority.id !== 'all') {
        result = result.filter(item => item.priority === selectedPriority.id);
    }
    
    return result;
}, [data, searchQuery, selectedPriority]);
```

### Filter UI Components

```tsx
{/* Search */}
<Search
    size="lg"
    placeholder="Search..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
/>

{/* Dropdown Filter */}
<Dropdown
    id="priority-filter"
    label="Priority"
    items={PRIORITY_OPTIONS}
    itemToString={(item) => item?.text || ''}
    selectedItem={selectedPriority}
    onChange={({ selectedItem }) => setSelectedPriority(selectedItem)}
/>

{/* Quick Filter Tags */}
<div className="quick-filters">
    {QUICK_FILTERS.map((filter) => (
        <Tag
            key={filter}
            type={activeFilters.includes(filter) ? 'blue' : 'gray'}
            onClick={() => toggleFilter(filter)}
        >
            {filter}
        </Tag>
    ))}
</div>

{/* Clear Filters */}
{hasActiveFilters && (
    <Button kind="ghost" renderIcon={Close} onClick={clearAllFilters}>
        Clear filters ({activeFilterCount})
    </Button>
)}
```

### Filter Indicator Pattern

When filters are applied, show:
1. Number of active filters
2. Results count (e.g., "Showing 5 of 20 items")
3. Clear all option

```tsx
{hasActiveFilters && (
    <div className="filter-results-summary">
        Showing {filteredData.length} of {data.length} items
    </div>
)}
```

### Best Practices

1. **Start state**: All filters unselected OR all selected (based on typical use)
2. **Clear filters**: Provide easy way to reset all filters
3. **Filter indicator**: Show when filters are active
4. **Instant feedback**: Update results immediately for fast data
5. **Batch updates**: Use "Apply" button for slow data or complex filters
6. **Preserve state**: Remember filter selections across navigation
