# Listing Launchpad   Real Estate Service Management Platform

## Overview
A service management platform for real estate agents in North Texas to coordinate property maintenance and remodeling services with admin teams.

## Authentication
- Internet Identity authentication for both Realtor and Admin user roles
- Role-based access control to separate Realtor and Admin functionalities

## User Roles

### Realtor (Client)
- Manage property portfolio
- Create and track service requests
- View request status updates
- Upload photos for service requests
- Access DFW Insights dashboard with live market data

### Admin
- View and manage all service requests across all realtors
- Update request statuses
- Access comprehensive dashboard with filtering capabilities
- Access DFW Insights dashboard with live market data

## Core Features

### Property Portfolio Management
- Realtors can add and manage DFW property addresses
- City validation focused on Dallas and Collin County cities (Plano, Frisco, McKinney, Allen, Dallas)
- Properties stored in backend with realtor association
- Interactive directions map functionality where the destination address auto-fills from the property's saved data, while the starting point ("from") must be entered manually by the user before opening directions
- Map directions work correctly across both iOS (Apple Maps) and Android (Google Maps) platforms

### Service Request System
- Realtors create "Priority Tickets" linked to specific properties
- Request fields: title, description, urgency level selector (including "Inspection Showstopper"), multiple photo uploads
- Status pipeline: Pending → Scheduled → In Progress → Completed
- All requests stored in backend with status tracking

### Admin Dashboard
- Summary view of all tickets by status
- Filter tickets by Realtor and property
- Update request statuses
- View attached photos for each request
- DFW Insights section with live data

### DFW Insights Dashboard
- Live weather details prominently displayed including current temperature, weather condition, date, and time for Dallas and Collin County
- Live mortgage rate graph display (frontend API integration)
- Live real estate market trends including listing prices and volume (frontend API integration)
- Automatic refresh every few minutes for real-time accuracy
- Available on both Realtor and Admin dashboards
- Fully responsive design optimized for mobile with consistent Dallas-themed styling

### Landing Page
- Functional "Get Started" button that properly routes users to the login or profile setup flow when clicked
- Responsive layout maintained across all screen sizes

### Client Contact Module
- Display three enhanced service plans with detailed descriptions:
  - **Essential ($99/month)**: Includes basic maintenance request management, photo uploads, status tracking for up to 3 active listings, and up to 2 hours of repairs/touch-ups
  - **Pro ($199/month)**: Includes all Essential features plus priority scheduling, unlimited active listings, direct messaging with admin team, and up to 5 hours including painting and fixture installs
  - **Concierge ($299/month)**: Includes all Pro features plus custom make-ready coordination, on-site visit scheduling, 24/7 request support, and up to 10 hours with full project coordination and staging assistance
- Contact Us form with fields: name, email, phone number, inquiry message
- Quick Text/iMessage contact buttons for direct team communication using phone number 214-607-6245
- Text button opens iMessage directly on iOS devices using `sms:` URL scheme, with fallback to native texting app on Android devices
- Call button uses `tel:` scheme for phone calls
- Social media link icons (Instagram, Facebook, LinkedIn, X) in footer and contact sections
- Form submissions stored in backend
- Pricing section uses premium gold accent colors for visual distinction
- Contact form emphasizes direct communication for plan purchase inquiries

## Data Storage (Backend)
- User profiles and roles
- Property addresses with realtor associations
- Service requests with status, photos, and property links
- Contact form submissions
- Detailed plan information and descriptions for all three service tiers

## Design Requirements
- Professional aesthetic for luxury Dallas real estate market
- Fully responsive layout optimized for mobile app experience
- Color scheme: white and navy with subtle gold accents
- Premium gold accent colors for pricing section
- Polished typography
- Clean, modern interface design
- Mobile-first responsive design for all components
- Consistent Dallas-themed styling across desktop and mobile
- App-friendly responsive layout functional on all screens

## Technical Requirements
- Deploy on Internet Computer (ICP)
- Support multiple photo uploads per service request
- Real-time status updates for service requests
- Frontend API integrations for live weather, mortgage rates, and real estate market data
- Social media integration with react-icons
- Text/iMessage contact functionality with device-specific URL schemes
- Interactive map directions functionality with manual starting point entry and auto-filled destination
- Cross-platform map compatibility for iOS (Apple Maps) and Android (Google Maps)
- Automatic refresh mechanism for real-time data accuracy
- Application content in English language
