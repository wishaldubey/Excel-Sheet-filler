# Auto Excel Sheet Filler

A full-stack web application built with Next.js that processes Excel files and fills employee data with a beautiful neobrutalism UI.

## Features

- 🎨 Modern neobrutalism design with vibrant colors and bold borders
- 📤 Upload your own Excel file with employee data
- 📊 Live preview of generated employee data
- 📥 Download processed Excel file with filled data
- ⚡ Built with Next.js 14 and React 18
- 🚀 Deployable on Vercel

## Tech Stack

- **Frontend**: React 18, Next.js 14 (App Router)
- **Backend**: Vercel Serverless Functions
- **Excel Processing**: ExcelJS
- **Styling**: CSS Modules (No Tailwind)
- **Font**: Google Fonts (Fredoka)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository or download the project files

2. Install dependencies:
```bash
npm install
```

3. Generate the template.xlsx file (optional - for reference):
```bash
node create-template.js
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Upload Excel File**: Click "Choose Excel File" and select your Excel file (.xlsx or .xls)
   - Your Excel file should have headers in the first row
   - The file should have empty rows where you want data to be filled
   
2. **Select Employee Gender**: Choose from Male, Female, or Other

3. **Enter Suminsured**: Specify the insurance amount

4. **Preview**: View a live preview of sample data that will be generated

5. **Generate Excel**: Click the button to process and download the filled Excel file

## Excel Template

The application expects an Excel file with the following columns (103 total columns). You can use the included `template.xlsx` as a reference.

### Columns That Will Be Auto-Filled

The application will automatically fill these columns for each row:

- **Employee Code** → Random 5 uppercase letters + 4 digits (e.g., "AQRWE7362")
- **Employee First Name** → Random alphabetic name
- **Employee Last Name** → Random alphabetic name
- **Employee Gender** → Selected from dropdown
- **Employee DOB** → "29-04-2002"
- **Employee Date of Joining** → Today's date (dd-mm-yyyy format)
- **Employee Email** → employeeCode@fyntune.com
- **Employee Mobile Number** → "9999999999"
- **Suminsured** → From input field
- **Relationship with Employee** → "Self"
- **Should Verify Email** → "No"
- **Default Password** → "Test@123"

### All Other Columns

All other columns in your Excel file will remain unchanged. The application only fills the 12 columns listed above.

## Deployment

### Deploy to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your repository in Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Click "Deploy"

3. Vercel will automatically detect Next.js and configure the build settings

4. Your app will be live at `https://your-project-name.vercel.app`

## Project Structure

```
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # API endpoint for Excel generation
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Main page component
│   └── page.module.css            # Neobrutalism styles
├── lib/
│   └── utils.ts                   # Utility functions for data generation
├── public/
│   └── template.xlsx              # Excel template file
├── create-template.js             # Script to generate template
├── next.config.js                 # Next.js configuration
├── package.json                   # Dependencies
└── tsconfig.json                  # TypeScript configuration
```

## License

MIT

## Author

Built with ❤️ using Next.js and ExcelJS
