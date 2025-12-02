const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

async function createTemplate() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Employees');

    // Define all column headers as per the complete list
    const headers = [
        'Employee Code',
        'Employee First Name',
        'Employee Last Name',
        'Employee Gender',
        'Employee DOB',
        'Employee Date of Joining',
        'Employee Email',
        'Employee Alternate Email',
        'Employee Mobile Number',
        'Mobile No Code',
        'Employee Designation',
        'Employee Grade',
        'Employee Annual Salary',
        'Employee Variables in Salary',
        'Employee Number of Time Salary',
        'Employee Address',
        'Employee State',
        'Employee City',
        'Employee Pin Code',
        'Suminsured',
        'Employee Premium',
        'Employer Premium',
        'OPD Suminsured',
        'OPD Employer Premium',
        'OPD Employee Premium',
        'Relationship with Employee',
        'Date of Marriage',
        'Insured Member First Name',
        'Salutation',
        'Insured Member Last Name',
        'Insured Member Gender',
        'Insured Member DOB',
        'Insured Member Email',
        'Insured Member Mobile Number',
        'Insured Member Number of Time Salary',
        'Insured Member Address',
        'Employee No of Time Suminsured',
        'Insured Member City',
        'Insured Member State',
        'Insured Member Pin Code',
        'Inception/Endorsement Date',
        'Effective Date',
        'CTC',
        'Location',
        'Zone',
        'Is VIP Employee',
        'Is Demo Email',
        'Demo Email Expiry Date',
        'Should Verify Email',
        'Default Password',
        'Is Dummy Email',
        'To Hide Email',
        'Is Dummy Mobile',
        'To Hide Mobile',
        'Is Password Reset',
        'Employee Annual Salary 2',
        'Employee Variables in Salary 2',
        'Employee Annual Salary 3',
        'Employee Variables in Salary 3',
        'Flex Plan',
        'Self SI Selection',
        'Cover Type',
        'Other 1',
        'Other 2',
        'Other 3',
        'Other 4',
        'Other 5',
        'Member Existing Claim',
        'Data Received On',
        'Insurer Endorsement Id',
        'Insurer Endorsement Date',
        'Insurer Removal Id',
        'Insurer Correction Id',
        'Insurer Correction Date',
        'Insurer Removal Date',
        'Installment',
        'Has Death Certificate',
        'Batch Id',
        'License Start Date',
        'Insurer Client Id',
        'License Expiry Date',
        'Type of license',
        'Issuing authority',
        'License Issuance date',
        'Cover Effective Date',
        'License Number',
        'Tpa Member Id',
        'Tpa Member Name',
        'Ecard Url',
        'Serial Number',
        'Occupation',
        'Aadhar Number',
        'ABHA ID',
        'Account Number',
        'VPN ID',
        'Nominee Name',
        'Nominee DOB',
        'Nominee Email',
        'Nominee Mobile Number',
        'Appointee Name',
        'Relationship With Insured',
        'Relation Of Appointee With Nominee',
        'Nominee Contribution'
    ];

    // Set up columns with headers
    worksheet.columns = headers.map(header => ({
        header: header,
        key: header.toLowerCase().replace(/\s+/g, '_'),
        width: 20
    }));

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' }
    };

    // Add 5 empty rows for data entry
    for (let i = 0; i < 5; i++) {
        worksheet.addRow({});
    }

    // Ensure public directory exists
    const publicDir = path.join(__dirname, 'public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    // Save the template
    const filePath = path.join(publicDir, 'template.xlsx');
    await workbook.xlsx.writeFile(filePath);
    console.log('Template created successfully at:', filePath);
    console.log(`Template has ${headers.length} columns and 5 empty data rows`);
}

createTemplate().catch(console.error);
