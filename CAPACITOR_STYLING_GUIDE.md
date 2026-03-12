# 📱 Capacitor-Specific Styling Guide

## Problem Solved ✅

You wanted to apply `mt-5` only in the Android app (to avoid status bar overlap) but not on the web version.

## Solution Implemented

### Method 1: JavaScript Detection (Implemented)

**Added:**

- `@capacitor/device` package
- `hooks/useCapacitor.ts` - Custom hook to detect Capacitor
- Updated `app/page.tsx` with conditional styling

**Code:**

```typescript
const { isCapacitor } = useCapacitor()

<div className={`relative flex min-h-dvh ${isCapacitor ? 'mt-5' : 'md:mt-0'}`}>
```

**Result:**

- ✅ **Android App:** Gets `mt-5` (20px top margin)
- ✅ **Web Browser:** Gets `md:mt-0` (no margin on desktop)

### Method 2: CSS-Only Alternative

You can also use CSS media queries to detect Capacitor:

```css
/* In globals.css */
.capacitor-margin {
  margin-top: 0;
}

/* Only apply margin in Capacitor WebView */
@media (display-mode: standalone) {
  .capacitor-margin {
    margin-top: 1.25rem; /* 20px */
  }
}
```

### Method 3: CSS Custom Properties

```css
/* In globals.css */
:root {
  --status-bar-height: 0px;
}

/* Capacitor sets this automatically */
@supports (padding-top: env(safe-area-inset-top)) {
  :root {
    --status-bar-height: env(safe-area-inset-top);
  }
}

.status-bar-safe {
  padding-top: var(--status-bar-height);
}
```

## How It Works

### JavaScript Detection (Current Implementation)

1. **`useCapacitor()` hook** detects if running in Capacitor
2. **Conditional className** applies different styles
3. **Real-time detection** works immediately

### Benefits:

- ✅ **Precise control** - Only applies to Capacitor
- ✅ **TypeScript support** - Full type safety
- ✅ **Flexible** - Can detect Android vs iOS specifically
- ✅ **Dynamic** - Can change based on runtime conditions

## Usage Examples

### Basic Platform Detection

```typescript
const { isCapacitor, isAndroid, isIOS, isWeb } = useCapacitor()

return (
  <div className={`
    ${isCapacitor ? 'mt-5' : ''}
    ${isAndroid ? 'android-specific' : ''}
    ${isIOS ? 'ios-specific' : ''}
    ${isWeb ? 'web-only' : ''}
  `}>
)
```

### Conditional Rendering

```typescript
{isCapacitor && (
  <div className="mobile-only-element">
    This only shows in the mobile app
  </div>
)}

{isWeb && (
  <div className="web-only-element">
    This only shows in the browser
  </div>
)}
```

### Safe Area Handling

```typescript
<header className={`
  sticky top-0 z-10
  ${isCapacitor ? 'pt-safe-area-top' : ''}
`}>
```

## Testing

### Web Browser:

- Should have no top margin
- `isCapacitor` should be `false`

### Android App:

- Should have 20px top margin (`mt-5`)
- `isCapacitor` should be `true`
- `isAndroid` should be `true`

## Advanced: Safe Area Support

For even better mobile support, you can use CSS safe areas:

```css
/* In globals.css */
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
```

Then use:

```typescript
<div className={`${isCapacitor ? 'safe-area-top' : ''}`}>
```

## Deployment

After making these changes:

1. **Deploy to Vercel** (for web changes)
2. **Sync Capacitor**: `npx cap sync android`
3. **Rebuild APK** in Android Studio
4. **Test both versions**

## Files Modified

- ✅ `hooks/useCapacitor.ts` - Platform detection hook
- ✅ `app/page.tsx` - Conditional styling applied
- ✅ `package.json` - Added @capacitor/device dependency

## Result

Your app now automatically detects when it's running in the Android app and applies the top margin only there, while keeping the web version clean!
