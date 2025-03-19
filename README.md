![(pngconverter app)](https://github.com/user-attachments/assets/ea41ac64-3dae-47c1-8c1a-acf6643d1acc)

Market Basket is a demo e-commerce website that applies the Apriori algorithm for Data Mining to suggest products that customers may want to buy.

[![Open website](https://img.shields.io/badge/website-000000?style=for-the-badge&logo=About.me&logoColor=white)](https://market-basket.vercel.app/)

https://github.com/user-attachments/assets/89933858-284a-4499-9b80-eadc9877b24c

## Introduction  

Market Basket is a demo e-commerce website designed to provide a seamless, secure, and efficient shopping experience. By leveraging advanced data mining techniques, the system not only suggests relevant products to customers but also helps administrators manage sales data effectively.  

## Main Features  
- **Smart Product Recommendations:** Utilizes the Apriori algorithm to analyze purchase patterns and suggest products that customers are likely to buy together.  
- **Secure User Authentication:** Integrates Clerk for secure login and user authentication.  
- **Reliable Data Management:** Uses Prisma and Neon to manage and store data efficiently, ensuring scalability and reliability.  
- **Intuitive User Interface:** Designed for ease of use, providing a smooth shopping experience for customers.  
- **Admin Dashboard & Sales Analytics:** Allows administrators to track sales performance through interactive visual charts, making it easier to monitor trends and make data-driven decisions.
  
## Technologies Used

- **[Prisma](https://www.prisma.io/):** A powerful ORM that facilitates easy and efficient interaction with the database.
- **[Neon](https://neon.tech/):** A modern database storage solution with flexible scalability.
- **[Clerk](https://clerk.com/):** A secure platform for managing logins and authenticating users.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/l1aF-2027/AI-Assistant.git
   cd ai-assistant
   ```

2. **Install the Necessary Packages:**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**

   Create a `.env.local` file in the root directory and add the required configuration variables, for example:

   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your--public-clerk-publishable-api-key"
   CLERK_SECRET_KEY="your-clerk-api-key"
   ```
   
   Create a `.env` file in the root directory and add database variable, for example:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/dbname"
   ```
4. **Add Database:**
   
   Open terminal in the directory `PostgreSQL\17\bin` and enter the command:
   ```bash
    .\psql YOUR_DATABASE_URL
   ```
   Copy all the queries in `database.sql` and paste into the terminal and enter.
   
6. **Run the Project:**

   ```bash
   npm run dev
   ```

## Environment Configuration

- **DATABASE_URL:** The connection string for the Neon database.
- **CLERK_SECRET_KEY, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:** API key for integrating Clerk's login management service.

Make sure these environment variables are correctly configured for the system to run smoothly.

## Usage Instructions

- Visit the URL: `http://localhost:3000` (or the configured address) to start experiencing the Market Basket website.
- Sign up and log in via Clerk to access personalized features.
- Interact with the Market Basket through the `/main` for shopping, the `/admin` for managing and analysis.

(**Note:** change Metadata.public of admin user to `{"role": "admin"}`)

## Contributions

All contributions, suggestions, and bug reports are welcome. Please create a Pull Request or open an Issue on GitHub to help improve the project.
