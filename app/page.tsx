'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { generateEmployeeData, type EmployeeData } from '@/lib/utils';

export default function Home() {
    const [gender, setGender] = useState<string>('Male');
    const [suminsured, setSuminsured] = useState<number>(500000);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<EmployeeData[]>([]);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [rowCount, setRowCount] = useState<number>(5);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);

    // Update preview whenever inputs change
    useEffect(() => {
        const preview: EmployeeData[] = [];
        for (let i = 0; i < rowCount; i++) {
            preview.push(generateEmployeeData(gender, suminsured));
        }
        setPreviewData(preview);
    }, [gender, suminsured, rowCount]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
                alert('Please upload a valid Excel file (.xlsx or .xls)');
                e.target.value = '';
                return;
            }
            setUploadedFile(file);
        }
    };

    const handleGenerate = async () => {
        if (!uploadedFile) {
            alert('Please upload an Excel file first');
            return;
        }

        setIsGenerating(true);
        try {
            const formData = new FormData();
            formData.append('file', uploadedFile);
            formData.append('gender', gender);
            formData.append('suminsured', suminsured.toString());
            formData.append('rows', rowCount.toString());
            // Send preview so backend writes exactly these rows
            formData.append('preview', JSON.stringify(previewData.slice(0, rowCount)));

            const response = await fetch('/api/generate', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate Excel file');
            }

            // Convert response to blob
            const blob = await response.blob();

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            // Use uploaded file name with 'output_' prefix and force .xlsx extension
            const originalName = uploadedFile.name;
            const baseName = originalName.startsWith('output_')
                ? originalName.substring('output_'.length)
                : originalName;

            // Remove existing extension and add .xlsx
            const nameWithoutExt = baseName.replace(/\.(xlsx?|xls)$/i, '');
            const outputFileName = `output_${nameWithoutExt}.xlsx`;
            a.download = outputFileName;
            document.body.appendChild(a);
            a.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error generating Excel:', error);
            alert(error instanceof Error ? error.message : 'Failed to generate Excel file. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Auto Excel Sheet Filler</h1>
                <p className={styles.subtitle}>Upload Excel file and auto-fill the data</p>

                {/* <div className={styles.downloadTemplate}>
                    <a href="/template.xlsx" download="template.xlsx" className={styles.templateLink}>
                        📥 Download Sample Template
                    </a>
                </div> */}

                <div className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="file" className={styles.label}>
                            Upload Excel File
                        </label>
                        <div className={styles.fileInputWrapper}>
                            <input
                                id="file"
                                type="file"
                                accept=".xlsx,.xls"
                                className={styles.fileInput}
                                onChange={handleFileChange}
                            />
                            <label htmlFor="file" className={styles.fileLabel}>
                                {uploadedFile ? uploadedFile.name : 'Choose Excel File'}
                            </label>
                        </div>
                        {uploadedFile && (
                            <p className={styles.fileInfo}>✓ File uploaded: {uploadedFile.name}</p>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="gender" className={styles.label}>
                            Employee Gender
                        </label>
                        <select
                            id="gender"
                            className={styles.select}
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="suminsured" className={styles.label}>
                            Suminsured
                        </label>
                        <input
                            id="suminsured"
                            type="number"
                            className={styles.input}
                            value={suminsured}
                            onChange={(e) => setSuminsured(Number(e.target.value))}
                            min="0"
                            step="100000"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="rows" className={styles.label}>
                            Rows to Fill
                        </label>
                        <input
                            id="rows"
                            type="number"
                            className={styles.input}
                            value={rowCount}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (Number.isNaN(value)) {
                                    setRowCount(0);
                                    return;
                                }
                                const clamped = Math.min(50, Math.max(0, value));
                                setRowCount(clamped);
                            }}
                            min="0"
                            max="50"
                        />
                    </div>

                    <button
                        className={styles.button}
                        onClick={handleGenerate}
                        disabled={isGenerating || !uploadedFile}
                    >
                        {isGenerating ? 'Processing...' : 'Generate Excel'}
                    </button>
                </div>

                <div className={styles.previewSection}>
                    <div className={styles.previewHeader}>
                        <div>
                            <h2 className={styles.previewTitle}>Live Preview</h2>
                            <p className={styles.previewSubtitle}>
                                Showing {previewData.length} row{previewData.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <button
                            className={styles.editButton}
                            onClick={() => setIsEditMode(!isEditMode)}
                        >
                            {isEditMode ? '✓ Done' : '✏️ Edit'}
                        </button>
                    </div>

                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Employee Code</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Gender</th>
                                    <th>DOB</th>
                                    <th>Date of Joining</th>
                                    <th>Email</th>
                                    <th>Mobile</th>
                                    <th>Suminsured</th>
                                    <th>Relationship</th>
                                    <th>Verify Email</th>
                                    <th>Password</th>
                                </tr>
                            </thead>
                            <tbody>
                                {previewData.map((employee, index) => (
                                    <tr key={index}>
                                        <td>
                                            {isEditMode ? (
                                                <input
                                                    className={styles.editInput}
                                                    value={employee.employeeCode}
                                                    onChange={(e) => {
                                                        const updated = [...previewData];
                                                        updated[index].employeeCode = e.target.value;
                                                        setPreviewData(updated);
                                                    }}
                                                />
                                            ) : (
                                                employee.employeeCode
                                            )}
                                        </td>
                                        <td>
                                            {isEditMode ? (
                                                <input
                                                    className={styles.editInput}
                                                    value={employee.firstName}
                                                    onChange={(e) => {
                                                        const updated = [...previewData];
                                                        updated[index].firstName = e.target.value;
                                                        setPreviewData(updated);
                                                    }}
                                                />
                                            ) : (
                                                employee.firstName
                                            )}
                                        </td>
                                        <td>
                                            {isEditMode ? (
                                                <input
                                                    className={styles.editInput}
                                                    value={employee.lastName}
                                                    onChange={(e) => {
                                                        const updated = [...previewData];
                                                        updated[index].lastName = e.target.value;
                                                        setPreviewData(updated);
                                                    }}
                                                />
                                            ) : (
                                                employee.lastName
                                            )}
                                        </td>
                                        <td>
                                            {isEditMode ? (
                                                <select
                                                    className={styles.editSelect}
                                                    value={employee.gender}
                                                    onChange={(e) => {
                                                        const updated = [...previewData];
                                                        updated[index].gender = e.target.value;
                                                        setPreviewData(updated);
                                                    }}
                                                >
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            ) : (
                                                employee.gender
                                            )}
                                        </td>
                                        <td>
                                            {isEditMode ? (
                                                <input
                                                    className={styles.editInput}
                                                    value={employee.dob}
                                                    onChange={(e) => {
                                                        const updated = [...previewData];
                                                        updated[index].dob = e.target.value;
                                                        setPreviewData(updated);
                                                    }}
                                                />
                                            ) : (
                                                employee.dob
                                            )}
                                        </td>
                                        <td>
                                            {isEditMode ? (
                                                <input
                                                    className={styles.editInput}
                                                    value={employee.dateOfJoining}
                                                    onChange={(e) => {
                                                        const updated = [...previewData];
                                                        updated[index].dateOfJoining = e.target.value;
                                                        setPreviewData(updated);
                                                    }}
                                                />
                                            ) : (
                                                employee.dateOfJoining
                                            )}
                                        </td>
                                        <td>
                                            {isEditMode ? (
                                                <input
                                                    className={styles.editInput}
                                                    value={employee.email}
                                                    onChange={(e) => {
                                                        const updated = [...previewData];
                                                        updated[index].email = e.target.value;
                                                        setPreviewData(updated);
                                                    }}
                                                />
                                            ) : (
                                                employee.email
                                            )}
                                        </td>
                                        <td>
                                            {isEditMode ? (
                                                <input
                                                    className={styles.editInput}
                                                    value={employee.mobile}
                                                    onChange={(e) => {
                                                        const updated = [...previewData];
                                                        updated[index].mobile = e.target.value;
                                                        setPreviewData(updated);
                                                    }}
                                                />
                                            ) : (
                                                employee.mobile
                                            )}
                                        </td>
                                        <td>
                                            {isEditMode ? (
                                                <input
                                                    className={styles.editInput}
                                                    type="number"
                                                    value={employee.suminsured}
                                                    onChange={(e) => {
                                                        const updated = [...previewData];
                                                        updated[index].suminsured = Number(e.target.value);
                                                        setPreviewData(updated);
                                                    }}
                                                />
                                            ) : (
                                                employee.suminsured
                                            )}
                                        </td>
                                        <td>
                                            {isEditMode ? (
                                                <input
                                                    className={styles.editInput}
                                                    value={employee.relationship}
                                                    onChange={(e) => {
                                                        const updated = [...previewData];
                                                        updated[index].relationship = e.target.value;
                                                        setPreviewData(updated);
                                                    }}
                                                />
                                            ) : (
                                                employee.relationship
                                            )}
                                        </td>
                                        <td>
                                            {isEditMode ? (
                                                <input
                                                    className={styles.editInput}
                                                    value={employee.shouldVerifyEmail}
                                                    onChange={(e) => {
                                                        const updated = [...previewData];
                                                        updated[index].shouldVerifyEmail = e.target.value;
                                                        setPreviewData(updated);
                                                    }}
                                                />
                                            ) : (
                                                employee.shouldVerifyEmail
                                            )}
                                        </td>
                                        <td>
                                            {isEditMode ? (
                                                <input
                                                    className={styles.editInput}
                                                    value={employee.defaultPassword}
                                                    onChange={(e) => {
                                                        const updated = [...previewData];
                                                        updated[index].defaultPassword = e.target.value;
                                                        setPreviewData(updated);
                                                    }}
                                                />
                                            ) : (
                                                employee.defaultPassword
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
