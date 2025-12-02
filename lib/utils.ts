// Generate random uppercase letters
export function generateRandomLetters(count: number): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < count; i++) {
        result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return result;
}

// Generate random digits
export function generateRandomDigits(count: number): string {
    let result = '';
    for (let i = 0; i < count; i++) {
        result += Math.floor(Math.random() * 10);
    }
    return result;
}

// Generate random employee code: 5 uppercase letters + 4 digits
export function generateEmployeeCode(): string {
    return generateRandomLetters(5) + generateRandomDigits(4);
}

// Generate random first name
export function generateRandomFirstName(gender?: string): string {
    const maleNames = [
        'Vishal', 'RamPrakash', 'Suraj', 'Nitesh', 'Raj', 'Rohit', 'Prashant', 'Rohan', 'Sanket', 'Jidnesh',
        'Sahil', 'Prem', 'Roshan', 'Sonu', 'Mayuresh', 'Vinayak', 'Rohan', 'Amit', 'Nitin', 'Amar',
        'Krishan', 'Karan', 'Pankaj', 'Deepak', 'Vikram'
    ];

    const femaleNames = [
        'Shraddha', 'Janhavi', 'Resham', 'Parul', 'Pratiksha ', 'Diya', 'Myra', 'Sara', 'Jiya',
        'Aaradhya', 'Anvi', 'Riya', 'Avni', 'Saanvi', 'Priya', 'Neha', 'Pooja', 'Kavya', 'Meera',
        'Simran', 'Tanya', 'Nisha', 'Anjali', 'Shreya'
    ];

    let pool: string[];
    if (gender === 'Male') {
        pool = maleNames;
    } else if (gender === 'Female') {
        pool = femaleNames;
    } else {
        pool = maleNames.concat(femaleNames);
    }

    return pool[Math.floor(Math.random() * pool.length)];
}

// Generate random last name
export function generateRandomLastName(): string {
    const lastNames = [
        'Sharma', 'Chauhan', 'Yadav', 'Namdev', 'Singh', 'Gupta', 'Reddy', 'Rao', 'Nair', 'Iyer',
        'Mehta', 'Joshi', 'Dubey', 'Shah', 'Agarwal', 'Bansal', 'Malhotra', 'Kapoor', 'Chopra', 'Bhatia',
        'Khanna', 'Sethi', 'Arora', 'Sinha', 'Jain', 'Pandey', 'Mishra', 'Tiwari', 'Dubey', 'Saxena',
        'Pillai', 'Menon', 'Krishnan', 'Raman', 'Bose', 'Das', 'Ghosh', 'Mukherjee', 'Chatterjee', 'Roy',
        'Kulkarni', 'Deshpande', 'Patil', 'Jadhav', 'Pawar', 'Shinde', 'Naik', 'Kadam', 'Sawant', 'More'
    ];
    return lastNames[Math.floor(Math.random() * lastNames.length)];
}

// Format date as dd-mm-yyyy
export function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// Get today's date formatted as dd-mm-yyyy
export function getTodayFormatted(): string {
    return formatDate(new Date());
}

// Generate employee email from employee code
export function generateEmail(employeeCode: string): string {
    return `${employeeCode}@fyntune.com`;
}

// Generate employee row data
export interface EmployeeData {
    employeeCode: string;
    firstName: string;
    lastName: string;
    gender: string;
    dob: string;
    dateOfJoining: string;
    email: string;
    mobile: string;
    suminsured: number;
    relationship: string;
    shouldVerifyEmail: string;
    defaultPassword: string;
}

export function generateEmployeeData(gender: string, suminsured: number): EmployeeData {
    const employeeCode = generateEmployeeCode();
    return {
        employeeCode,
        firstName: generateRandomFirstName(gender),
        lastName: generateRandomLastName(),
        gender,
        dob: '29-04-2002',
        dateOfJoining: getTodayFormatted(),
        email: generateEmail(employeeCode),
        mobile: '9999999999',
        suminsured,
        relationship: 'Self',
        shouldVerifyEmail: 'No',
        defaultPassword: 'Test@123'
    };
}
