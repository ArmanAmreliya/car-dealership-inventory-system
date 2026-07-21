# DealerFlow Development Plan

## Project

DealerFlow — Car Dealership Inventory Management System

This project is being developed as part of the Incubyte Software Craftsperson Assessment.

---

# Primary Goal

This project is NOT intended to maximize features.

The primary goal is to demonstrate:

- Test Driven Development
- Clean Code
- SOLID Principles
- Separation of Concerns
- Maintainability
- Incremental Development
- Small meaningful commits
- Engineering Thinking

Every implementation decision must optimize for code quality rather than speed.

---

# Development Philosophy

Always follow:

Red
↓

Green
↓

Refactor

Every new behavior starts with a failing test.

Never write production code before writing a failing test.

---

# Architecture

Backend

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- JWT
- Jest
- Supertest

Frontend

- React
- TypeScript
- TailwindCSS
- React Router
- TanStack Query
- React Hook Form
- Zod

---

# Folder Structure

backend/

frontend/

docs/

README.md

PROMPTS.md

---

# Engineering Principles

Every class should have one responsibility.

Avoid duplicate logic.

Prefer composition over inheritance.

Functions should remain small.

Variable names must reveal intent.

Avoid comments whenever expressive code can replace them.

Never create utility functions without a clear need.

Avoid premature abstraction.

---

# Testing Rules

All backend business logic must be developed using TDD.

Each behavior should have:

- failing test
- implementation
- refactor

Coverage matters more than quantity.

Test names should describe behavior.

---

# Git Rules

Never commit generated code blindly.

One commit should represent one logical behavior.

Preferred workflow:

test

↓

implementation

↓

refactor

↓

commit

Commit messages should follow Conventional Commits.

Examples

test(auth): add failing registration test

feat(auth): implement registration

refactor(auth): simplify validation

---

# AI Usage

AI is an engineering assistant.

AI must never make architecture decisions automatically.

All generated code must be reviewed.

Every dependency must be understood.

No copied code.

No blind acceptance.

Record every significant AI interaction inside PROMPTS.md.

---

# Coding Style

Strict TypeScript.

No any unless justified.

Prefer dependency injection.

Use async/await.

Never ignore errors.

Meaningful error messages.

Consistent formatting.

---

# Done Criteria

A task is complete only when:

✓ Tests pass

✓ Lint passes

✓ Code reviewed

✓ Refactored

✓ Documentation updated

✓ Commit created

---

# Extra Features

After core requirements:

1. Wishlist

2. Purchase History

3. Low Stock Dashboard

Only after all mandatory requirements are complete.

# Incubyte Engineering References

The following public resources are used only as learning references to understand Incubyte's engineering culture and workflow.

## AI Plugins

https://github.com/incubyte/ai-plugins

Purpose

- Learn AI-assisted development workflow
- Improve prompt engineering
- Understand Incubyte's preferred AI development style

These plugins should assist development, not replace engineering decisions.

---

## Incubyte Open Source

https://github.com/incubyteservices

Purpose

Study engineering practices including:

- project structure
- testing approach
- commit history
- coding conventions
- documentation
- architecture
- CI/CD
- engineering culture

Never copy implementation.

Use repositories only for learning software craftsmanship principles.

---

# Final Goal

Produce a repository that demonstrates software craftsmanship rather than feature quantity.