# Totaro & Sons - Full-Stack Administration Dashboard & Client Portal

A production-grade, secure, full-stack web application custom-built for **Totaro & Sons**. This software ecosystem features a responsive, public-facing promotional platform seamlessly integrated with an authenticated administrative console. The system empowers business owners to manage live operational data—including real-time customer review moderation, dynamic photo gallery streaming, and event location scheduling.

---

##  Core Features

### Public Client Portal
* **Dynamic Media Gallery:** High-performance photo gallery that pulls directly from relational storage, ensuring optimized image delivery.
* **Live Appearance Tracker:** Real-time visibility into upcoming food truck stops, community pop-ups, and private events.
* **Modern UI Layout:** Fluid user experience featuring custom interactive design states and smooth visual component transitions.

### Administrative Console & Backend Logic
* **Review Moderation Hub:** Full CRUD operations allowing administrators to inspect, approve, or securely prune user feedback before public rendering.
* **Active Asset Manager:** Streamlined image controls enabling immediate addition or removal of live database records via asynchronous API endpoint actions.
* **Guarded Routing:** Secure Angular authentication wrappers protecting internal state transitions and restricted dashboard control views.

---

##  Tech Stack & Architecture

### Frontend
* **Framework:** Angular (v17+)
* **Styling:** Custom CSS3 leveraging dynamic responsive transitions, flexbox architectures, and centralized design tokens.
* **State Management:** Reactive forms decoupled into independent, asynchronous data service modules.

### Backend & Database
* **Runtime Environment:** Python REST API Architecture
* **Database Engine:** PostgreSQL Relational Database Management System (RDBMS)
* **Data Layer:** Structured SQL connection wrappers optimized for high-reliability data persistence and transactional integrity.

---

##  System Architecture Diagram
* **[Angular Frontend Client] <---> [Python Rest API Backend]
* **[Python Rest API Backend] <---> [PostgreSQL Database]
* **(Secure Routing) (Relational Tables)

---

### Engineering Highlights & Optimization
* **TypeScript Compiler Upgrades:** Fixed Configuration bottleneks by mitigating legacy targets to `moduleResolution: "bundler"` and setting explicit root directory boundaries within `tsconfig.json` to guarantee modern framework compatibility.
* **Robust Input Fallbacks:** Implemented smart UI validation workflows to ensure that invalid or broken external URLs safely resolve to defensive graphic placeholder without disrupting interface layouts.
* **Relational Storage Design:** Built a relational data schema across distinct tables (`admin_users`, `events`, `photos`, `reviews`) ensuring transactional integrity and data pesistence.