// Structured template generators - NO AI. Fully deterministic.

type Data = Record<string, string>;

const safe = (v?: string) => (v && v.trim().length > 0 ? v.trim() : '');

const todayFormatted = () => {
  const d = new Date();
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};

const joinLines = (lines: (string | false | undefined)[]) =>
  lines.filter(Boolean).join('\n');

export function renderCreditDispute(d: Data): string {
  const date = safe(d.letterDate) || todayFormatted();
  return joinLines([
    safe(d.fullName),
    safe(d.address),
    safe(d.email),
    safe(d.phone),
    '',
    date,
    '',
    safe(d.bureauName),
    safe(d.bureauAddress),
    '',
    `Subject: Dispute of Inaccurate Information — Account ${safe(d.accountNumber) || '[Account Number]'}`,
    '',
    `To Whom It May Concern,`,
    '',
    `I am writing to formally dispute an item appearing on my credit report. The disputed account is listed as follows:`,
    '',
    `    Creditor: ${safe(d.creditor) || '[Creditor Name]'}`,
    `    Account Number: ${safe(d.accountNumber) || '[Account Number]'}`,
    '',
    `Reason for dispute:`,
    safe(d.reason) || '[Describe the inaccuracy in detail.]',
    '',
    safe(d.notes) && `Additional information: ${safe(d.notes)}`,
    safe(d.notes) && '',
    `Pursuant to the Fair Credit Reporting Act, I request that you investigate this matter and remove or correct the disputed information. Please send me written confirmation of the results of your investigation.`,
    '',
    `Thank you for your attention to this matter.`,
    '',
    `Sincerely,`,
    '',
    '',
    safe(d.fullName),
  ]);
}

export function renderRentalLetter(d: Data): string {
  const date = safe(d.letterDate) || todayFormatted();
  return joinLines([
    safe(d.fullName),
    safe(d.address),
    safe(d.email),
    safe(d.phone),
    '',
    date,
    '',
    safe(d.landlordName),
    safe(d.propertyAddress),
    '',
    `Subject: ${safe(d.subject) || '[Subject]'}`,
    '',
    `Dear ${safe(d.landlordName) || '[Landlord]'},`,
    '',
    safe(d.body) || '[Write the details of your request or notice here.]',
    '',
    `Please acknowledge receipt of this letter at your earliest convenience.`,
    '',
    `Respectfully,`,
    '',
    '',
    safe(d.fullName),
  ]);
}

export function renderSimpleAgreement(d: Data): string {
  const date = safe(d.letterDate) || todayFormatted();
  const title = safe(d.subject) || 'Simple Agreement';
  return joinLines([
    title.toUpperCase(),
    '',
    `This Agreement ("Agreement") is entered into on ${date} by and between:`,
    '',
    `Party A: ${safe(d.partyA_name) || '[Party A Name]'}`,
    `Address: ${safe(d.partyA_address) || '[Party A Address]'}`,
    '',
    `Party B: ${safe(d.partyB_name) || '[Party B Name]'}`,
    `Address: ${safe(d.partyB_address) || '[Party B Address]'}`,
    '',
    `1. PURPOSE & SCOPE`,
    safe(d.terms) || '[Describe the scope, deliverables, payment, and obligations.]',
    '',
    safe(d.extra) && `2. ADDITIONAL TERMS`,
    safe(d.extra) && safe(d.extra),
    safe(d.extra) && '',
    `3. ENTIRE AGREEMENT`,
    `This document represents the entire understanding between the parties and supersedes any prior agreements, written or oral.`,
    '',
    `IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.`,
    '',
    '',
    `_______________________________`,
    `${safe(d.partyA_name) || 'Party A'}`,
    '',
    `_______________________________`,
    `${safe(d.partyB_name) || 'Party B'}`,
  ]);
}

export function renderChildcareAgreement(d: Data): string {
  const start = safe(d.startDate) || todayFormatted();
  return joinLines([
    'CHILDCARE AGREEMENT',
    '',
    `Effective Date: ${start}`,
    '',
    `This Childcare Agreement is made between:`,
    '',
    `Parent / Guardian: ${safe(d.parentName) || '[Parent Name]'}`,
    `Address: ${safe(d.parentAddress) || '[Parent Address]'}`,
    `Phone: ${safe(d.parentPhone) || '[Parent Phone]'}`,
    '',
    `Caregiver: ${safe(d.caregiverName) || '[Caregiver Name]'}`,
    safe(d.caregiverAddress) && `Address: ${safe(d.caregiverAddress)}`,
    safe(d.caregiverPhone) && `Phone: ${safe(d.caregiverPhone)}`,
    '',
    `1. CHILDREN UNDER CARE`,
    safe(d.children) || '[Child names and ages]',
    '',
    `2. SCHEDULE`,
    safe(d.schedule) || '[Days and hours]',
    '',
    `3. PAYMENT`,
    safe(d.rate) || '[Payment rate and frequency]',
    '',
    safe(d.duties) && `4. DUTIES & RESPONSIBILITIES`,
    safe(d.duties) && safe(d.duties),
    safe(d.duties) && '',
    safe(d.notes) && `5. ADDITIONAL TERMS`,
    safe(d.notes) && safe(d.notes),
    safe(d.notes) && '',
    `Both parties agree to the terms outlined above and confirm their mutual understanding by signing below.`,
    '',
    '',
    `_______________________________`,
    `Parent / Guardian`,
    '',
    `_______________________________`,
    `Caregiver`,
  ]);
}

export function renderFormalLetter(d: Data): string {
  const date = safe(d.letterDate) || todayFormatted();
  const recipientBlock = joinLines([
    safe(d.recipientName),
    safe(d.recipientOrg),
    safe(d.recipientAddress),
  ]);
  const greetingName = safe(d.recipientName) || 'Sir or Madam';
  return joinLines([
    safe(d.fullName),
    safe(d.address),
    safe(d.email),
    safe(d.phone),
    '',
    date,
    '',
    recipientBlock,
    '',
    `Subject: ${safe(d.subject) || '[Subject]'}`,
    '',
    `Dear ${greetingName},`,
    '',
    safe(d.body) || '[Letter body]',
    '',
    `Thank you for your time and consideration.`,
    '',
    `Sincerely,`,
    '',
    '',
    safe(d.fullName),
  ]);
}

export function renderDocument(typeId: string, data: Data): string {
  switch (typeId) {
    case 'credit_dispute':
      return renderCreditDispute(data);
    case 'rental_letter':
      return renderRentalLetter(data);
    case 'simple_agreement':
      return renderSimpleAgreement(data);
    case 'childcare_agreement':
      return renderChildcareAgreement(data);
    case 'formal_letter':
      return renderFormalLetter(data);
    default:
      return '';
  }
}

export function deriveDocumentTitle(typeId: string, data: Data): string {
  const s = (k: string) => (data[k] || '').trim();
  switch (typeId) {
    case 'credit_dispute':
      return s('creditor') ? `Dispute — ${s('creditor')}` : 'Credit Dispute Letter';
    case 'rental_letter':
      return s('subject') || 'Rental Letter';
    case 'simple_agreement':
      return s('subject') || 'Simple Agreement';
    case 'childcare_agreement':
      return s('caregiverName') ? `Childcare — ${s('caregiverName')}` : 'Childcare Agreement';
    case 'formal_letter':
      return s('subject') || 'Formal Letter';
    default:
      return 'Document';
  }
}
