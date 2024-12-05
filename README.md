# Invoice Generator (from Jira/Tempo csv)
### Will help you generate your monthly invoice, email and timesheet using your monthly Tempo report to generate an invoice for your clients

--------------------------------------------------------

## Input
- Monthly report (.csv file)
- User configuration file (userConfig.ts)
- (optional) Easy to modify handlebars templates (src/templates)

## Output
- Invoice PDF
- Timesheet PDF
- Email text in a handy format

## Overview

This project is a TypeScript-based application that handles invoice generation and configuration. It includes functionalities for calculating invoice numbers, generating invoice, and configuring email details for sending invoices.

## Technologies Used

- **TypeScript**
- **etsc** (for TypeScript compilation)
- **date-fns** (for date manipulation)
- **handlebars** (for template rendering)

## Project Structure

- `src/templates/tempor-teport.csv`: Put your CSV monthly report here
- `src/templates/template-tax-invoice.hbs`: Invoice template
- `src/userConfig.ts`: The main configuration file for generating invoices, including details about the sender, recipient, and services provided.

## Key Features

- **Invoice Number Calculation**: Calculates the invoice number based on the end date of the invoice period.
- **Invoice Title Generation**: Generates a title for the invoice based on the end date of the invoice period.
- **Email Configuration**: Configures the email details, including recipients, title, and body of the email.
- **Service Details**: Configures the details of the services provided, including type, period, hourly rate, and total hours.

## Usage

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run the Application**:
   ```bash
   npm start
   ```

3. **Configuration**:
    - Modify `src/userConfig.ts` to update the invoice and email details as per your requirements.

## License

This project is licensed under the MIT License.