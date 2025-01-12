# Financial Analysis Dashboard

A React-based financial dashboard that displays and analyzes Apple Inc.'s financial data using the Financial Modeling Prep API.


Features:

- View and analyze Apple's financial statements
- Filter data by date range, revenue, and net income
- Sort data by various metrics
- Responsive design with dark theme
- Interactive charts showing revenue and operating margin trends

Prerequisites:
Before running this project, you need to have installed

- Node.js (v16 or higher)
- npm (comes with Node.js)

Setup Instructions:

- Clone the repository

      git clone https://github.com/yourusername/financial-dashboard.git
  
      cd financial-dashboard

- Install dependencies

      npm install

- Set up environment variables:

  - Create a .env file in the root directory
  - Add your Financial Modeling Prep API key:

        VITE_API_KEY=your_api_key_here

  - You can get an API key from [Financial Modeling Prep]([url](https://site.financialmodelingprep.com/developer/docs#income-statements-financial-statements))


- Start the development server

      npm run dev

- Open your browser and navigate to http://localhost:5173

- Deployed App using Vercel - https://financial-dashboard-red.vercel.app/
