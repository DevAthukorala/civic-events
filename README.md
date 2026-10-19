# CivicEvents

Municipal event management and registration platform built with **React, ASP.NET Core, and SQL Server** for a Kandy Municipal Council case study in CSE5013 — Service Oriented Computing.

## Features

- Public event browsing, search, and event details.
- Organizer dashboard, event creation and editing, and participant lists.
- Participant registration, cancellation, and registration history.
- JWT authentication, role-based authorization, and event ownership checks.
- Capacity limits, duplicate registration prevention, and past-event validation.
- REST API with Swagger documentation for external integrations.

## Technology Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router, Axios, Tailwind CSS |
| Backend | C#, ASP.NET Core Web API, .NET 10 |
| Database | SQL Server / LocalDB, Entity Framework Core 9 |
| Security | JWT bearer tokens, BCrypt password hashing |

The source targets `net10.0`, despite earlier coursework documentation referring to .NET 8.

## Architecture

The backend separates controllers, business services, and repositories, using DTOs and dependency injection. The React client communicates with the API through Axios. The coursework compares monolithic and service-oriented architectures against scalability, integration, security, maintainability, and fault-handling requirements. This implementation contains one backend API project and one frontend application.

- `KMC.API/`: API, business services, repositories, entities, and database migrations.
- `KMC.Client/`: React pages, components, API client, and static assets.

## Run Locally

Requires the **.NET 10 SDK**, **Node.js 22.12+**, npm, and **SQL Server** or Windows **SQL Server Express LocalDB**.

```powershell
git clone https://github.com/DevAthukorala/civic-events.git
cd civic-events
```

### Backend

The default connection in `KMC.API/appsettings.json` uses LocalDB and the database `KMCEventPlatformDb`. For another SQL Server instance, set the environment variable `ConnectionStrings__DefaultConnection`.

Generate a private signing key in PowerShell and start the API:

```powershell
cd KMC.API
$jwtBytes = New-Object byte[] 48
$jwtRng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$jwtRng.GetBytes($jwtBytes)
$jwtRng.Dispose()
$env:Jwt__Key = [Convert]::ToBase64String($jwtBytes)
dotnet restore
dotnet run --urls "http://localhost:5000"
```

Keep the signing key private and stable between runs if existing tokens should remain valid. Database migrations and demo data seeding run at startup; SQL Server must be available.

API: `http://localhost:5000/api`
Swagger: `http://localhost:5000/swagger`

### Frontend

In another terminal at the repository root:

```powershell
cd KMC.Client
npm ci
npm run dev -- --port 5173
```

Open `http://localhost:5173`. The Axios client uses `http://localhost:5000/api`.

### Local Demo Accounts

The database initializer creates these accounts when the users table is empty:

| Role | Email | Password |
| --- | --- | --- |
| Organizer | organizer@kmc.gov.lk | Password123! |
| Participant | perera@gmail.com | Password123! |

These are academic demonstration accounts. Replace demo credentials and review deployment settings before public hosting.

## Development Checks

From `KMC.Client`, run `npm run build` and `npm run lint`. From `KMC.API`, run `dotnet build`.

The coursework report documents manual API checks for role restrictions, event ownership, capacity, duplicate registration, and past events. No automated test suite is included.
