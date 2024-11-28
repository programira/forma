
# **Autodesk Monorepo Project**

A monorepo setup for a full-stack React project with the following structure:

- **Frontend**: A React application built with Vite and TypeScript.
- **Backend**: Placeholder for backend services or mock APIs.
- **Testing**: End-to-end testing setup using Playwright.

---

## **Project Structure**

```
project-root/
├── backend/                # Placeholder for backend logic (e.g., mock APIs)
├── frontend/               # React application with Vite and Material-UI
├── testing/                # Playwright end-to-end testing setup
├── pnpm-workspace.yaml     # Workspace configuration for pnpm
└── README.md               # Project documentation
```

---

## **Features**

- **Frontend**:
  - React with TypeScript.
  - Vite for fast builds and development.
  - Material-UI (MUI) for a modern UI design.
  - State management using Redux Toolkit.
- **Backend**:
  - Placeholder for future backend logic or mock APIs.
- **Testing**:
  - End-to-end testing with Playwright.
  - Sample tests included for UI and routing validation.

---

## **Getting Started**

### **Prerequisites**

- Node.js (>= 16.x)
- pnpm (>= 7.x)

---

### **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/programira/forma.git
   cd forma
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

---

### **Running the Project**

#### Frontend:
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Start the development server:
   ```bash
   pnpm run dev
   ```

3. Build for production:
   ```bash
   pnpm run build
   ```

4. Preview the production build:
   ```bash
   pnpm run preview
   ```

#### Backend:
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```


#### Testing:
1. Navigate to the `testing` directory:
   ```bash
   cd testing
   ```

2. Run Playwright tests:
   ```bash
   pnpm run test
   ```

---

## **Scripts**

Here are the available scripts for the project:

- **Root:**
  - `pnpm recursive run build`: Build all workspaces.
  - `pnpm recursive run lint`: Lint all workspaces.

- **Frontend:**
  - `pnpm --filter frontend dev`: Start the development server.
  - `pnpm --filter frontend build`: Build the frontend for production.

- **Backend:**
  - (Add backend-specific scripts as needed.)

- **Testing:**
  - `pnpm --filter testing test`: Run Playwright tests.

---

## **Technologies Used**

- **Frontend**:
  - React, TypeScript, Redux Toolkit
  - Vite for build and dev server
  - Material-UI for styling
- **Backend**:
  - Placeholder
- **Testing**:
  - Playwright for end-to-end testing

---

## **Customization**

### Adding a New Package:
To add a dependency to a specific workspace, use:
```bash
pnpm add <package-name> --filter <workspace>
```

To add a shared dependency across all workspaces:
```bash
pnpm add <package-name> -w
```

---

## **Contributing**

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature description"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## **License**

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## **Contact**

For questions or collaboration, feel free to contact:

- **Name**: [Mirjana Milosevic]
- **Email**: [mira.milosevic@gmail.com]
- **GitHub**: [[GitHub Profile](https://github.com/programira)]
