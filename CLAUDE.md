# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React TypeScript application that runs machine learning models directly in the browser using Hugging Face Transformers.js. The app allows users to load and test various NLP models for tasks like sentiment analysis, text classification, summarization, and more.

## Development Commands

- **Start development server**: `bun run dev` (accessible at http://localhost:5173)
- **Build for production**: `bun run build` (TypeScript compilation + Vite build)  
- **Lint code**: `bun run lint` (ESLint with TypeScript and React rules)
- **Preview production build**: `bun run preview`
- **Install dependencies**: `bun install`

## Core Architecture

### Model Worker System
The app uses a sophisticated Web Worker-based architecture for ML model management:
- `ModelWorkerProvider` - Context provider managing worker communication 
- `ModelFactory` - Handles model loading and inference execution
- `loadModelWorker.ts` - Web Worker that runs models in background thread
- Models are loaded via Hugging Face Transformers.js pipelines

### Component Structure
- **Model Management**: `ModelList`, `ModelItem`, `ModelAddPopup` for model CRUD operations
- **Inference Interface**: `ModelInferenceView` with specialized forms for each task type
- **Task-specific Forms**: `SentimentAnalysisForm`, `TextClassificationForm`, `SummarizeInferenceForm`, etc.
- **Result Panels**: Corresponding result displays for each inference type

### Key Technical Details
- Uses `@` path alias pointing to `./src` (configured in tsconfig and vite.config)
- Shadcn/ui components with Radix UI primitives
- TailwindCSS for styling
- React Hook Form with Zod validation
- Web Workers for non-blocking ML inference

### Model Task Types
The app supports these ML tasks:
- `text-classification` - Categorize text into predefined classes
- `sentiment-analysis` - Analyze emotional sentiment 
- `zero-shot-classification` - Classify without training data
- `summarization` - Generate text summaries
- `text2text-generation` - General text generation
- `token-classification` - Named entity recognition
- `none-pipeline-supported` - Custom low-level model API

### State Management
- `ModelsProvider` - Global model state management
- `ModelWorkerProvider` - Worker communication state
- Individual hook-based inference state management

### Git Workflow
- Main branch: `main`
- Development branch: `dev`
- Release process managed via Makefile with `make release` command

### Example Prompts System
The app includes predefined example prompts for each task type in `constants/model.ts` to help users test models quickly.