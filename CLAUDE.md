# Claude Code Configuration

This file contains configuration and notes for Claude Code assistance with this project.

## Project Overview
Tiny Models in Browser - A React application for running small-tiny machine learning models directly in the browser with a non-technical user friendly interface. The application provides simplified, task-focused inference views for various NLP tasks including summarization, payment detection, sentiment analysis, and more.

## Tech Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Router**: TanStack Router with auto code splitting
- **Styling**: Tailwind CSS 4.x
- **UI Components**: Radix UI primitives
- **ML Framework**: Hugging Face Transformers.js
- **State Management**: React Context/Providers
- **Form Handling**: React Hook Form with Zod validation
- **Package Manager**: Bun (with npm fallback)

## Project Structure
```
src/
├── assets/              # Static assets (images, icons)
├── components/          # Reusable UI components
│   ├── Model/          # Model-specific components
│   │   ├── ModelAddPopup/         # Add new models
│   │   ├── ModelGroup/            # Model grouping
│   │   ├── ModelInferenceView/    # Model inference interface (legacy)
│   │   ├── ModelInferenceViewV2/  # Main model detail view (non-tech user friendly)
│   │   ├── InferenceForm/         # User input forms for inference (legacy - needs v2 implementation)
│   │   └── ModelList/             # Model listing
│   ├── common/         # Shared components
│   │   ├── AppHeader/             # Application header
│   │   ├── AppLayout/             # Main layout wrapper
│   │   ├── AppSidebar/            # Navigation sidebar
│   │   ├── AppSidebarV2/          # Updated sidebar (non-tech user friendly)
│   │   ├── AudioRecorder/         # Audio recording components
│   │   ├── ExamplePrompts*/       # Example prompt components
│   │   ├── Form/                  # Form components
│   │   └── SidebarItem/           # Sidebar navigation items
│   └── ui/             # Base UI components (Radix UI wrappers)
├── constants/          # Application constants
│   ├── model.ts               # Model configurations & example prompts
│   ├── model.json             # Model definitions (14 pre-configured models)
│   ├── event.ts               # Event type definitions
│   └── example-prompts.json   # Example prompts for different tasks
├── hooks/              # Custom React hooks
│   ├── inference/             # ML inference hooks for different tasks
│   └── useIsMobile.ts         # Mobile detection hook
├── lib/                # Utility libraries
├── pages/              # Page components
│   ├── Home/                  # Main application page
│   └── Test/                  # Testing page
├── provider/           # Context providers
│   ├── ModelWorkerProvider/   # Web Worker utilities for model inference communication
│   └── ModelsProvider/        # Hardcoded model constants and state management
├── routes/             # TanStack Router configuration
│   ├── (app)/                 # Main app routes
│   └── (expired_app)/         # Legacy app routes
├── schema/             # TypeScript schemas
│   ├── model.ts               # Model type definitions
│   └── params.ts              # Parameter schemas
└── utils/              # Utility functions
    ├── format.ts              # Formatting utilities
    ├── model.ts               # Model-related utilities
    └── worker.ts              # Web Worker utilities
```

## Development Commands
- **Dev Server**: `bun run dev` or `npm run dev`
- **Build**: `bun run build` or `npm run build` (tsc + vite build)
- **Lint**: `bun run lint` or `npm run lint`
- **Preview**: `bun run preview` or `npm run preview`

## Supported ML Tasks
The application supports 14 pre-configured models for various NLP tasks:

### Language Processing Models
1. **Zero-Shot Classification**
   - Xenova/distilbert-base-uncased-mnli
   - Xenova/mobilebert-uncased-mnli

2. **Summarization**
   - Xenova/bart-large-cnn
   - Xenova/distilbart-cnn-6-6

3. **Named Entity Recognition**
   - Xenova/bert-base-multilingual-cased-ner-hrl

4. **Sentiment Analysis**
   - Xenova/distilbert-base-uncased-finetuned-sst-2-english
   - Xenova/bert-base-multilingual-uncased-sentiment
   - Xenova/finbert (financial sentiment)

5. **Content Moderation**
   - Xenova/toxic-bert

6. **Speech Recognition**
   - Xenova/whisper-tiny
   - Xenova/whisper-small
   - Xenova/whisper-tiny.en
   - onnx-community/whisper-base

7. **Text Generation**
   - onnx-community/Qwen2.5-0.5B
   - onnx-community/Qwen2.5-0.5B-Instruct

## Key Features
- **Browser-based ML**: All models run directly in the browser using Web Workers
- **Non-technical User Interface**: Simplified, task-focused UI designed for non-technical users
- **Task-focused Inference**: Specialized interfaces for specific tasks (summarization, payment detection, etc.)
- **Model Management**: Load, unload, and switch between models
- **Interactive Inference**: Real-time inference with various input types
- **Audio Processing**: Speech recognition with audio recording capabilities
- **Responsive UI**: Mobile-friendly interface with sidebar navigation
- **Performance Optimized**: Dtype recommendations (q4, q8, fp16) for optimal performance
- **Example Prompts**: Pre-configured examples for each task type

## Architecture Notes
- **Web Workers**: ML models run in separate threads to avoid blocking UI
- **Provider Pattern**: Context providers manage model state and worker communication
  - **ModelWorkerProvider**: Provides utilities for sending requests to worker threads
  - **ModelsProvider**: Provides hardcoded model constants and state management
- **Inference Logic**: Custom hooks in `hooks/inference/` handle model-specific inference logic
- **Task-focused UI**: Version 2 components focus on specific tasks rather than generic model operations
- **Route-based Code Splitting**: Automatic code splitting via TanStack Router
- **TypeScript**: Strict typing with Zod schema validation
- **Modern React**: Uses React 19 features with proper suspense boundaries

## Current Branch Status
- **Branch**: feat/new-app-layout
- **Recent Changes**:
  - Updated model constants and schema definitions
  - Added new example prompts configuration
  - Modified model JSON structure
  - Enhanced layout components

## Development Notes
- Models are lazy-loaded when first accessed
- Each model has dtype recommendations for optimal performance
- Audio input is supported for speech recognition tasks
- **Migration in Progress**: The app includes both v1 and v2 versions of components
  - **ModelInferenceViewV2**: Main model detail view for non-technical users
  - **InferenceForm**: Legacy user input forms - needs reimplementation as v2 with simplified UI
  - **V2 Philosophy**: Focus on specific tasks (summarization, payment detection) rather than generic model operations
- Web Workers handle model loading and inference to maintain responsive UI
- Real model inference runs on worker threads with communication handled by ModelWorkerProvider

## Performance Issues & Solutions

### Bundle Size Issues
**Problem**: The `useInferenceTextGeneration` hook generates a 1.1MB chunk after build due to bundling all inference-related code together.

**Root Causes**:
1. **Heavy Dependency Chain**: `ModelInferenceViewV2.tsx` imports ALL inference hooks and form components at once
2. **UI Component Bundling**: Includes Lucide React icons, Radix UI components, and all InferenceFormV2 components
3. **No Code Splitting**: Components are eagerly loaded instead of being split by task type

**Solutions**:
1. **Task-based Lazy Loading**: Only import specific inference hook and form component needed for each model's task
2. **Component Code Splitting**: Move form components to separate lazy-loaded chunks using React.lazy()
3. **Dynamic Imports**: Use dynamic imports in ModelInferenceViewV2 based on model task type
4. **Dependency Optimization**: Replace heavy dependencies (e.g., uuid v4) with lighter alternatives
5. **Route-level Splitting**: Ensure each model task gets its own route chunk