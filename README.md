# Empower Her

## Project Overview

**Empower Her** is a dedicated job posting platform designed with a core mission to empower women in their professional journeys. This platform facilitates connections between job providers and women seeking employment opportunities, fostering a supportive environment for career growth. It includes robust **user authentication** and **role-based access control**, ensuring that registered job providers can post new listings and job seekers can find relevant opportunities.

---

## Features

Empower Her offers a comprehensive suite of features for both job seekers and job providers, powered by a full-stack Next.js architecture.

* **User Authentication & Authorization:**
    * Secure **Login** and **Sign Up** for all users (`pages/AuthForm.js`).
    * **Role-Based Access Control** (RBAC) differentiates users as `job-seeker` or `job-provider`, granting specific permissions (e.g., only providers can post jobs, only seekers can apply).
    * User data (`name`, `email`, `phone`, `role`, `city`, `imageUrl`) is managed via a global **User Context** (`context/UserContext.js`) and persisted in `localStorage`.
    * Users can **Edit their Profile** (`pages/profile.js`), including updating personal details and uploading a profile picture.

* **Job Posting & Management (for Job Providers):**
    * **Post New Jobs** (`pages/post-job.js`): Authorized job providers can create detailed job listings. Job provider's name is denormalized and stored directly with the job for easy display.
    * **Edit Existing Jobs**: Providers can update their previously posted job listings (`pages/post-job.js` with `?edit=<jobId>` query parameter).
    * **View Posted Jobs** (`pages/posted-job.js`): Providers get a dedicated page to see all their job listings.
    * **Applicant Management**: For each posted job, providers can view a list of all applicants, see their details (name, email, phone), and **update their application status** (e.g., `pending`, `reviewed`, `interview`, `rejected`, `hired`).

* **Job Discovery & Application (for Job Seekers):**
    * **Find Jobs** (`pages/find-jobs.js`): Job seekers can browse all available job postings.
    * **Job Filtering**: Users can filter job listings by **Job Title**, **Location**, **City**, and **Minimum Salary** for precise searches.
    * **View Job Details** (`pages/job/[jobId].js`): Access comprehensive information for a specific job listing.
    * **Apply for Jobs**: Job seekers can easily apply to jobs from the job details page. The system prevents duplicate applications.
    * **Track Applied Jobs** (`pages/applied-jobs.js`): Job seekers can view a history of all jobs they've applied for, along with their current application status updates.

* **Notifications System:**
    * **Real-time Alerts**: A dynamic notification system (`pages/notifications.js`) keeps users informed about important updates.
    * **Visual Cues**: The Navbar's bell icon changes (`belliconUpdate.png`) and displays a badge count for unread notifications, providing immediate visual feedback.
    * **Event-Driven Notifications**:
        * **For Providers**: Notified when a new applicant applies to their job.
        * **For Seekers**: Notified when their job application status is updated by a provider.
    * **Management**: Users can mark individual notifications as read or clear all unread notifications.

* **User Feedback & Queries:**
    * **Feedback Mechanism** (`pages/feedback.js`): Users can submit feedback on the platform, including a visually engaging **star rating system**.
    * **General Queries**: A contact form (`components/sections/QuerySection.js`) allows users to submit general inquiries. All queries are stored for later addressing.

* **Interactive UI Elements:**
    * **Customer Reviews Carousel** (`components/sections/CarouselSection.jsx`): Visually showcases testimonials or images in an interactive, auto-sliding format using optimized Next.js Images and Bootstrap's carousel.
    * **Central Content Blocks** (`components/sections/CentralContentSection.jsx`): Prominently displays calls-to-action with responsive layouts and engaging styling.

---

## Technologies Used

* **Frontend:**
    * **Next.js:** React framework for server-side rendering, routing, and API routes.
    * **React:** JavaScript library for building dynamic user interfaces.
    * **Bootstrap:** For responsive design, a mobile-first approach, and pre-built UI components.
    * **Lucide React:** A library for modern, customizable SVG icons.
    * **@next/font/google:** For optimized Google Fonts loading.

* **Backend (Next.js API Routes):**
    * **Node.js:** JavaScript runtime environment for server-side logic.
    * **Mongoose:** MongoDB object data modeling (ODM) library for Node.js, simplifying database interactions.
    * **MongoDB Atlas:** Cloud-hosted NoSQL database for flexible and scalable data storage.
    * **Cloudinary:** Cloud-based image and video management solution for storing user profile pictures and other media.
    * **Google Generative AI SDK (`@google/generative-ai`):** Used for integrating AI capabilities (e.g., the AI Chatbot).

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

* Node.js (LTS version recommended)
* npm (Node Package Manager) or Yarn
* Access to a MongoDB Atlas cluster (recommended for easy setup and scalability)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/ChitranshGuha/Empower-Her-MERN.git](https://github.com/ChitranshGuha/Empower-Her-MERN.git)
    cd Empower-Her-MERN # Navigate to the project root directory
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Variables:**
    Create a `.env.local` file at the **root of your project directory**. Add necessary environment variables for database connection and API keys:

    ```
    # MongoDB Connection String
    MONGODB_URI=your_mongodb_connection_string_from_atlas

    # Cloudinary API Credentials (for image uploads)
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret

    # Google Gemini AI API Key (for the AI Chatbot)
    GEMINI_API_KEY=your_gemini_api_key

    # JWT Secret (for future authentication/authorization)
    JWT_SECRET=a_very_long_and_random_secret_key_for_jwt
    ```
    **Important:** Do **not** commit your `.env.local` file to version control. It should be listed in your `.gitignore`.

### Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
2.  Open your browser and navigate to `http://localhost:3000`.

## Usage

* **Sign Up**: Register as either a `job-seeker` or `job-provider`.
* **Login**: Access your account to use role-specific features.
* **Job Providers**: Post new job listings, view your posted jobs, and manage applicants by updating their application statuses.
* **Job Seekers**: Browse job listings, filter by various criteria, view job details, apply for jobs, and track the status of your applications.
* **Notifications**: Stay informed with updates on application statuses (for seekers) and new applicants (for providers) via the Navbar icon and a dedicated notifications page.
* **Feedback**: Share your thoughts and rate the platform on the feedback page.
* **AI Chatbot**: Get assistance and information about the website or current page content from the AI assistant.

---

## Future Enhancements (Roadmap)

We have ambitious plans to evolve **Empower Her** into an even more powerful and intelligent platform. Here's a glimpse into our future goals:

* **Robust Authentication & Authorization**: Implement JWT-based token verification on all protected API routes to ensure secure and authorized access.
* **Job Management Enhancements**: Add functionality for job providers to directly **delete** their job postings.
* **Rich Application Submissions**: Allow job seekers to **upload resumes and cover letters** during the application process.
* **Advanced AI Features**:
    * **AI-Driven Job Generalization**: Utilize AI to optimize job descriptions for providers and present personalized, generalized job options for seekers.
    * **AI-Powered Job Matching**: Smarter matching of job seekers to relevant roles.
* **Improved User Experience**:
    * Implement **Pagination / Infinite Scrolling** for job listings and applications for better performance with large datasets.
    * Enhance **Error Handling & Form Validation** with more user-friendly inline feedback and toast notifications.
    * Develop a comprehensive **Admin Panel** for platform administrators to manage users, jobs, applications, feedback, and queries.

These future goals are aimed at making **Empower Her** an even more intuitive, supportive, and efficient platform for women in their careers.

---

## Contributing

Contributions are welcome! If you'd like to contribute to Empower Her, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeatureName`).
3.  Make your changes and commit them (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/YourFeatureName`).
5.  Open a Pull Request.

---

## License

(Consider adding a license, e.g., MIT, Apache 2.0. You can choose one from [Choose an Open Source License](https://choosealicense.com/).)