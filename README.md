# 🎓 Uni.io - University Event Management Platform



##  Live Demo

**Live Application**: [https://uni-io.vercel.app](https://uni-io.vercel.app)



---
## Login Credentials

**Admin Account**


    Email : zawad@example.com
    Password : qwerty
    Email : pabak@example.com
    Password : qwerty

  **Student Account**


    Email : shovon@example.com
    Password : qwerty
##  Project Description

Uni.io is a comprehensive university event management platform that connects students, clubs, and administrators in a seamless digital ecosystem. Built with modern web technologies, it provides an intuitive interface for discovering, organizing, and managing campus events while offering powerful administrative tools for event oversight.

The platform serves as a central hub where:
- **Students** can discover and register for exciting campus events
- **Club Administrators** can create, manage, and promote their events
- **System Administrators** can oversee platform operations and user management
- **Everyone** benefits from a streamlined event discovery and registration process

##  Quick Start

### Prerequisites
- **Node.js** 18.0.0 or higher
- **MySQL** 8.0 or higher
- **Git** for version control
- **npm** or **yarn** package manager
- Contact dev.pabak@gmail.com or md.iftekharzawad@gmail.com or sakibulhassan.shovon@gmail.com for assistance or .env file

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/uni.io.git
   cd uni.io
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   
   # Create a .env file with your configuration
   cp .env.example .env
   ```

3. **Configure environment variables**
   Create a `.env` file in the `backend` directory:
   ```env
   # Database Configuration
   DB_HOST=
   DB_USER=
   DB_PASS=
   DB_NAME=
   DB_PORT=
   
   # Email Configuration
   EMAIL_USER= # gmail address for sending emails
   EMAIL_PASS= # gmail 'app' password for sending emails
   
   # API Configuration
   URL_PREFIX= # base URL for API
   
   # Environment & Security
   NODE_ENV=
   SESSION_SECRET=
   
   
   ```

4. **Set up the database**
   ```bash
   # Connect to MySQL and run the schema
   mysql -u your_username -p < users.sql
   ```

5. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   
   # Create a .env file for frontend environment variables
   cp .env.example .env
   ```

6. **Configure frontend environment variables**
   Create a `.env` file in the `frontend` directory:
   ```env
   # API Configuration
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   
   # Google Gemini API (for chatbot)
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   The backend will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Access the application**
   Open your browser and navigate to `http://localhost:5173`

### Development Scripts

#### Backend
```bash
npm start          # Start development server with nodemon
npm test           # Run tests (currently not configured)
```

#### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## Features Implemented

###  Core Functionality
- **User Authentication & Authorization**
  - Secure login/signup system with role-based access control
  - User verification and email confirmation
  - Session management with MySQL session store
  - Role-based route protection (Student, Club Admin, System Admin)

- **Event Management**
  - Create, edit, and delete events with rich metadata
  - Event categorization (Technology, Arts, Sports, Career, etc.)
  - Event status tracking (Draft, Upcoming, Ongoing, Completed, Cancelled)
  - Image uploads and event descriptions
  - Registration deadlines and capacity management

- **Event Discovery & Registration**
  - Browse events by category, status, and date
  - Search and filter functionality
  - Event details with venue, time, and organizer information
  - One-click event registration and cancellation
  - View count tracking and analytics

###  User Experience Features
- **Responsive Design**
  - Mobile-first approach with Tailwind CSS
  - Dark/light theme toggle with system preference detection
  - Modern UI components built with Radix UI primitives
  - Smooth animations and transitions

- **Interactive Dashboards**
  - **Student Dashboard**: View registered events, manage registrations
  - **Admin Dashboard**: Event management, attendee tracking, analytics
  - **System Admin Dashboard**: User management, platform oversight

- **Smart Chatbot Assistant**
  - AI-powered chatbot using Google Gemini API
  - Pre-built FAQ responses for common queries
  - Context-aware assistance for event-related questions
  - Floating chat interface accessible from any page

###  Advanced Features
- **Certificate Generation**
  - Automated certificate creation for event participants
  - Customizable certificate templates
  - QR code integration for verification
  - PDF export functionality
  - Professional certificate design

- **Analytics & Reporting**
  - Event attendance tracking
  - User engagement metrics
  - Registration statistics
  - Performance insights for organizers

- **Security & Performance**
  - Password hashing with bcrypt
  - CORS configuration for production deployment
  - Environment variable management
  - Optimized database queries
  - Session-based authentication

##  Technology Stack

### Frontend
- **React 18.3.1** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Router DOM** - Client-side routing
- **React Hook Form** - Form management and validation
- **Lucide React** - Beautiful icon library
- **Google Gemini AI** - AI-powered chatbot functionality

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5.1.0** - Web application framework
- **MySQL** - Relational database
- **Passport.js** - Authentication middleware
- **bcryptjs** - Password hashing
- **Nodemailer** - Email functionality
- **Express Session** - Session management
- **CORS** - Cross-origin resource sharing

### Database
- **MySQL 8.0+** - Primary database
- **Express MySQL Session** - Session storage
- **Normalized schema** with proper foreign key relationships



## Database Schema

The application uses a normalized MySQL database with the following main tables:

- **`users`** - User accounts with role-based permissions
- **`clubEvents`** - Event information and metadata
- **`eventRegistrants`** - Event registration relationships
- **`clubAdminApplications`** - Club admin role applications

##  Authentication & Authorization

The platform implements a comprehensive role-based access control system:

- **Students** - Can browse events, register/unregister, view certificates
- **Club Admins** - Can create/manage events, view attendee lists
- **System Admins** - Can manage users, approve applications, oversee platform

##  Deployment

### Frontend (Vercel)
The frontend is configured for deployment on Vercel with:
- Automatic builds from Git
- Environment variable configuration
- Optimized production builds

### Backend
The backend is configured for deployment on Render .


##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

##  License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

##  Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/TestCase-Titans/uni.io/issues) page
2. Create a new issue with detailed information
3. Contact the development team

##  Future Enhancements

- **Real-time notifications** using WebSockets
- **Mobile app** development with React Native
- **Advanced analytics** and reporting dashboard
- **Integration** with university systems
- **Multi-language support** for international universities
- **Event recommendation engine** using AI
- **Payment integration** for paid events
- **Social features** like event sharing and reviews

---

**Built with ❤️ for the university community**

*Uni.io - Where every event meets every student*
