# 📁 PROJECT FILE STRUCTURE GUIDE

## 🌟 UNDERSTANDING YOUR PROJECT ORGANIZATION

```
SA-Project/                          ← Root project folder
├── Database/                        ← Backend database files (Go language)
├── frontend/                        ← Frontend React application
│   ├── public/                      ← Static files (images, icons)
│   ├── src/                         ← Source code (main development folder)
│   │   ├── components/              ← Reusable UI components
│   │   ├── pages/                   ← Different website pages
│   │   ├── routes/                  ← Navigation/routing logic
│   │   ├── layout/                  ← Page layouts (header, footer, etc.)
│   │   ├── Container/               ← UI containers
│   │   ├── assets/                  ← Images, logos, etc.
│   │   ├── App.tsx                  ← Main application component
│   │   └── main.tsx                 ← Entry point (starts the app)
│   ├── package.json                 ← Project dependencies & scripts
│   ├── index.html                   ← Main HTML file
│   └── vite.config.ts              ← Build configuration
└── README.md                        ← Project documentation
```

## 🔍 KEY FILES EXPLAINED

### **1. Entry Point Files**
- **`main.tsx`** - Starts your React app (like turning on a car)
- **`App.tsx`** - Main app component (like the car's engine)
- **`index.html`** - The HTML page that loads everything

### **2. Source Code Structure (`src/` folder)**

#### **Pages (`pages/` folder)**
```
pages/
├── HomePage/                        ← Home page files
│   └── index_page/
│       └── index.tsx               ← Your current homepage
├── Authentication/                  ← Login/register pages
├── Systems/                         ← Admin system pages
└── ...
```

#### **Routes (`routes/` folder)**
```
routes/
├── HomeRoutes.tsx                   ← Public page routes
├── StaffRoutes.tsx                  ← Admin page routes
├── AuthenticationRoutes.tsx         ← Login/register routes
└── index.tsx                        ← Main routing configuration
```

#### **Layout (`layout/` folder)**
```
layout/
├── IndexLayout.tsx                  ← Public pages layout
└── FullLayout.tsx                   ← Admin pages layout
```

#### **Components (`components/` folder)**
```
components/
├── navigation/                      ← Navigation components
├── third-patry/                     ← External library components
└── ...
```

## 🔗 HOW FILES CONNECT TO EACH OTHER

### **Flow Diagram:**
```
1. index.html (browser loads this)
   ↓
2. main.tsx (starts React app)
   ↓
3. App.tsx (main app component)
   ↓
4. routes/index.tsx (decides which page to show)
   ↓
5. HomeRoutes.tsx OR StaffRoutes.tsx (specific route groups)
   ↓
6. layout/IndexLayout.tsx (page structure)
   ↓
7. pages/HomePage/index_page/index.tsx (your content)
```

## 📝 FILE NAMING CONVENTIONS

### **React Files (.tsx)**
- **Components**: `ComponentName.tsx` (PascalCase)
- **Pages**: `index.tsx` or `PageName.tsx`
- **Layouts**: `LayoutName.tsx`

### **Folders**
- **lowercase**: `components/`, `pages/`, `assets/`
- **PascalCase**: `HomePage/`, `Authentication/`

## 🎯 CURRENT FILE YOU'RE EDITING

**File**: `/pages/HomePage/index_page/index.tsx`
**Purpose**: This is your main homepage content
**Connected to**: 
- Routes: `HomeRoutes.tsx` (line 11)
- Layout: `IndexLayout.tsx` (wraps your page)
- App: `App.tsx` (main app)

## 🛠️ IMPORTANT FILES TO KNOW

### **Configuration Files**
- **`package.json`** - Lists all libraries/dependencies your project uses
- **`vite.config.ts`** - Build tool configuration (like a recipe for building your app)
- **`tsconfig.json`** - TypeScript configuration

### **Development Files**
- **`node_modules/`** - Downloaded libraries (don't edit this)
- **`.gitignore`** - Files to ignore in version control

## 🚀 HOW TO NAVIGATE

1. **To edit homepage**: `src/pages/HomePage/index_page/index.tsx`
2. **To add new routes**: `src/routes/HomeRoutes.tsx`
3. **To change layout**: `src/layout/IndexLayout.tsx`
4. **To add components**: `src/components/`
5. **To add images**: `src/assets/`

## 💡 BEGINNER TIPS

1. **Start with**: `pages/` folder - this is where your content lives
2. **Don't touch**: `node_modules/`, config files (until you're advanced)
3. **Focus on**: `.tsx` files in `src/` folder
4. **Remember**: Every `.tsx` file is a React component
5. **File structure matters**: Keep related files together

## 🔄 TYPICAL WORKFLOW

1. **Edit content** → `pages/` folder
2. **Add navigation** → `routes/` folder  
3. **Change layout** → `layout/` folder
4. **Add reusable parts** → `components/` folder
5. **Test changes** → Run `npm run dev`

---
*This guide helps you understand where everything lives in your project!*
