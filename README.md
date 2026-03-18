# Invoice Generator (from Jira/Tempo csv)
### Generates your monthly invoice, email and timesheet using your monthly Tempo report to generate an invoice for your clients

--------------------------------------------------------

## Input
- Monthly report (.csv file)
- User configuration file [config.yaml](config.yaml) (clone the [example.config.yaml](example.config.yaml))
- (optional) Easy to modify handlebars templates (src/templates)

## Output (./dist-templates/mail/... -- will be opened in a browser automatically)
- Invoice PDF
- Timesheet PDF
- Email text in a handy format

## Overview
This project is a TypeScript-based application that handles invoice generation and configuration.
It:
- calculates invoice total
- generates an invoice file with + a timesheet, both in PDF format
- allows to configure: sender and recipient, services, email details etc.

## Technologies Used
- **TypeScript**
- **etsc** (for TypeScript compilation)
- **date-fns** (for date manipulation)
- **handlebars** (for template rendering)

## Project Structure
- `tempor-teport.csv`: Put your CSV monthly report here (I use export from JIRA)
- `src/templates/template-tax-invoice.hbs`: Invoice template
- `config.yaml`: The main configuration file for generating invoices, including details about the sender, recipient, 
  and services provided. Needs to be cloned from [example.config.yaml](example.config.yaml)

## Usage
1. **Configuration**:
    - Create [config.yaml](config.yaml) from the [example.config.yaml](example.config.yaml)
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run the Application**:
   ```bash
   npm start
   ```