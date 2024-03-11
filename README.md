<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/DevLeoko/liberty-invoice/assets/13747815/8aeabb25-2318-46b9-ba85-e3bf4bcfdc04">
  <source media="(prefers-color-scheme: light)" srcset="https://github.com/DevLeoko/liberty-invoice/assets/13747815/e7ff4b3e-a6d8-4150-bdf9-fd97e101b09f">
  <img alt="Shows an illustrated sun in light mode and a moon with stars in dark mode." src="https://github.com/DevLeoko/liberty-invoice/assets/13747815/b7eb88bd-b578-4c11-ab76-e8277263bbb1">
</picture>

# Liberty Invoice

Liberty Invoice is an source-available tool built for intuitive yet powerful invoicing. Aimed at freelancers, businesses, and anyone else with billing needs, Liberty Invoice provides an adaptable solution to manage invoices and generate invoice PDFs. With customizable features, multi-language and multi-currency support, efficient client and product management, and more, it offers a seamless invoicing experience.

## Features

- Multilingual UI: English and German are currently supported
- Customizable Invoice Templates: Logo and text fragments can be customized
- Invoice PDF Generation
- Client-Specific Currency
- Client-Specific Language
- Configurable Tax Rates
- Client and Product Management
- Sending Invoices via Email
- WIP: Payment Logging
- WIP: Multi-User Support

## Hosted Version

A hosted version of Liberty Invoice is available at https://liberty-invoice.com. The hosted version is updated regularly and includes the latest features and bug fixes. It is currently free to use. If you encounter any issues, please report them on GitHub.

## Self-Hosting

This repository is a monorepo containing both the frontend and backend code. The frontend is built with SvelteKit and the backend is a NodeJS Express server.

### Frontend

We do not use any SSR in SvelteKit, so the frontend can be hosted as a static site.
To build the frontend, you need to:

1. Setup the environment variables in `frontend/.env` (see `.env.example` for an example)
2. Run `npm install` and `npm run generate` in the `backend` directory.
   Note: The backend is required to build the frontend because the frontend uses the backend's tRPC types. For security reasons the backend's `.env` file should not have any sensitive data when building the frontend.
3. Run `npm install` and `npm run build` in the `frontend` directory.
4. The frontend is now built and can be hosted as a static site. The output is in the `frontend/build` directory.

### Backend

1. Navigate to the `backend` directory.
2. Setup the environment variables `.env` (see `.env.example` for an example)
3. Run `npm install`, `npm run prisma-up` and `npm run generate` to setup the database and generate the Prisma client.
4. Run `npm run start` to start the backend server.

## Community

Join our thriving community on [Discord](https://discord.gg/qTU4xKRv9C)! Contribute to our project, share ideas, or ask questions. Together, we shape the future of Liberty Invoice.

## Stack

Key technologies used in Liberty Invoice:

- SvelteKit
- Express
- tRPC: Type-safe API calls between frontend and backend
- Prisma: Next-generation ORM for TypeScript and Node.js
- Zod: TypeScript-first schema declaration and validation
- TanStack Query: Asynchronous state management, server-state utilities and data fetching
