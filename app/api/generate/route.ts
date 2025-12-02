import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';
import {
    generateEmployeeCode,
    generateRandomFirstName,
    generateRandomLastName,
    getTodayFormatted,
    generateEmail,
    type EmployeeData,
} from '@/lib/utils';

export async function POST(request: NextRequest) {
    try {
        // Parse FormData
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const gender = formData.get('gender') as string;
        const suminsured = formData.get('suminsured') as string;
        const rowsToFillRaw = formData.get('rows') as string | null;
        const previewRaw = formData.get('preview') as string | null;

        // Validate inputs
        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        if (!gender || !suminsured) {
            return NextResponse.json(
                { error: 'Missing required fields: gender, suminsured' },
                { status: 400 }
            );
        }

        let rowsToFill = rowsToFillRaw ? Number(rowsToFillRaw) : 0;
        if (!rowsToFill || Number.isNaN(rowsToFill) || rowsToFill <= 0) {
            return NextResponse.json(
                { error: 'Invalid rows value. Please provide a positive number of rows to fill.' },
                { status: 400 }
            );
        }

        // Hard cap to 50 rows on the backend as a safety guard
        rowsToFill = Math.min(50, rowsToFill);

        console.log('File name:', file.name);
        console.log('File type:', file.type);
        console.log('File size:', file.size);

        // Get file as buffer
        const fileBuffer = await file.arrayBuffer();
        console.log('Buffer size:', fileBuffer.byteLength);

        let workbookExcelJS: ExcelJS.Workbook;
        let worksheet: ExcelJS.Worksheet;

        // Check if file is .xls or .xlsx
        if (file.name.endsWith('.xls')) {
            // Handle .xls files using xlsx library
            console.log('Processing .xls file');

            // Read .xls file using xlsx library
            const xlsWorkbook = XLSX.read(fileBuffer, { type: 'array' });
            const firstSheetName = xlsWorkbook.SheetNames[0];
            const xlsWorksheet = xlsWorkbook.Sheets[firstSheetName];

            // Convert to ExcelJS workbook
            workbookExcelJS = new ExcelJS.Workbook();
            worksheet = workbookExcelJS.addWorksheet(firstSheetName);

            // Get the range of the worksheet
            const range = XLSX.utils.decode_range(xlsWorksheet['!ref'] || 'A1');

            // Copy data from xlsx worksheet to ExcelJS worksheet
            for (let R = range.s.r; R <= range.e.r; ++R) {
                const row = worksheet.getRow(R + 1);
                for (let C = range.s.c; C <= range.e.c; ++C) {
                    const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                    const cell = xlsWorksheet[cellAddress];
                    if (cell) {
                        row.getCell(C + 1).value = cell.v;
                    }
                }
                row.commit();
            }
        } else if (file.name.endsWith('.xlsx')) {
            // Handle .xlsx files using ExcelJS
            console.log('Processing .xlsx file');
            workbookExcelJS = new ExcelJS.Workbook();
            const nodeBuffer = Buffer.from(fileBuffer);
            // @ts-expect-error - Node.js Buffer<ArrayBuffer> is not assignable to ExcelJS's expected Buffer type due to library type definition differences
            await workbookExcelJS.xlsx.load(nodeBuffer);
            worksheet = workbookExcelJS.worksheets[0];

            if (!worksheet) {
                return NextResponse.json(
                    { error: 'No worksheet found in uploaded file' },
                    { status: 500 }
                );
            }
        } else {
            return NextResponse.json(
                { error: 'Only .xls and .xlsx files are supported' },
                { status: 400 }
            );
        }

        // Find the header row (assuming it's row 1)
        const headerRow = worksheet.getRow(1);

        // Create a map of column names to column numbers
        const columnMap: { [key: string]: number } = {};
        headerRow.eachCell((cell, colNumber) => {
            const headerValue = cell.value?.toString().trim();
            if (headerValue) {
                columnMap[headerValue] = colNumber;
            }
        });

        // Parse preview data if provided so Excel matches live preview
        let previewRows: EmployeeData[] | null = null;
        if (previewRaw) {
            try {
                previewRows = JSON.parse(previewRaw) as EmployeeData[];
            } catch (e) {
                console.warn('Failed to parse preview JSON, falling back to server-side generation');
                previewRows = null;
            }
        }

        // We always fill from row 2 to row (1 + rowsToFill)
        const startRow = 2;
        const endRow = 1 + rowsToFill;
        console.log('Filling rows from', startRow, 'to', endRow);

        for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
            const row = worksheet.getRow(rowIndex);

            const previewIndex = rowIndex - startRow;
            const previewEmployee = previewRows && previewRows[previewIndex];

            const employeeCode = previewEmployee?.employeeCode ?? generateEmployeeCode();
            const employeeGender = previewEmployee?.gender ?? gender;
            const firstName = previewEmployee?.firstName ?? generateRandomFirstName(employeeGender);
            const lastName = previewEmployee?.lastName ?? generateRandomLastName();
            const dob = previewEmployee?.dob ?? '29-04-2002';
            const doj = previewEmployee?.dateOfJoining ?? getTodayFormatted();
            const email = previewEmployee?.email ?? generateEmail(employeeCode);
            const mobile = previewEmployee?.mobile ?? '9999999999';
            const sumInsuredValue = previewEmployee?.suminsured ?? Number(suminsured);
            const relationship = previewEmployee?.relationship ?? 'Self';
            const shouldVerify = previewEmployee?.shouldVerifyEmail ?? 'No';
            const defaultPassword = previewEmployee?.defaultPassword ?? 'Test@123';

            if (columnMap['Employee Code']) {
                row.getCell(columnMap['Employee Code']).value = employeeCode;
            }

            if (columnMap['Employee First Name']) {
                row.getCell(columnMap['Employee First Name']).value = firstName;
            }

            if (columnMap['Employee Last Name']) {
                row.getCell(columnMap['Employee Last Name']).value = lastName;
            }

            if (columnMap['Employee Gender']) {
                row.getCell(columnMap['Employee Gender']).value = employeeGender;
            }

            if (columnMap['Employee DOB']) {
                row.getCell(columnMap['Employee DOB']).value = dob;
            }

            if (columnMap['Employee Date of Joining']) {
                row.getCell(columnMap['Employee Date of Joining']).value = doj;
            }

            if (columnMap['Employee Email']) {
                row.getCell(columnMap['Employee Email']).value = email;
            }

            if (columnMap['Employee Mobile Number']) {
                row.getCell(columnMap['Employee Mobile Number']).value = mobile;
            }

            if (columnMap['Suminsured']) {
                row.getCell(columnMap['Suminsured']).value = sumInsuredValue;
            }

            if (columnMap['Relationship with Employee']) {
                row.getCell(columnMap['Relationship with Employee']).value = relationship;
            }

            if (columnMap['Should Verify Email']) {
                row.getCell(columnMap['Should Verify Email']).value = shouldVerify;
            }

            if (columnMap['Default Password']) {
                row.getCell(columnMap['Default Password']).value = defaultPassword;
            }

            // Commit the row
            row.commit();
        }

        // Generate Excel buffer
        const outputBuffer = await workbookExcelJS.xlsx.writeBuffer();

        // Return the Excel file as a downloadable response
        return new NextResponse(outputBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename=output.xlsx',
                'Content-Length': outputBuffer.byteLength.toString(),
            },
        });
    } catch (error) {
        console.error('Error processing Excel file:', error);
        return NextResponse.json(
            { error: 'Failed to process Excel file', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
