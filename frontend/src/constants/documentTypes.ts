import { FileText, Home, FileSignature, Baby, Mail } from 'lucide-react-native';

export type FieldType = 'text' | 'textarea' | 'date' | 'email' | 'phone';

export interface FieldSchema {
  key: string;
  label: string;
  placeholder?: string;
  helper?: string;
  type?: FieldType;
  required?: boolean;
  multiline?: boolean;
}

export interface StepSchema {
  title: string;
  subtitle?: string;
  fields: FieldSchema[];
}

export interface DocumentTypeSchema {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: any;
  steps: StepSchema[];
}

export const DOCUMENT_TYPES: Record<string, DocumentTypeSchema> = {
  credit_dispute: {
    id: 'credit_dispute',
    title: 'Credit Dispute Letter',
    tagline: 'Challenge an inaccurate credit report entry',
    description: 'Formally dispute incorrect information with a credit bureau or creditor.',
    icon: FileText,
    steps: [
      {
        title: 'Your Information',
        subtitle: 'The sender details on the letter.',
        fields: [
          { key: 'fullName', label: 'Full Name', placeholder: 'Jordan A. Rivera', required: true },
          { key: 'address', label: 'Street Address', placeholder: '1423 Oakwood Lane, Denver, CO 80203', required: true, multiline: true },
          { key: 'email', label: 'Email', placeholder: 'jordan.rivera@email.com', type: 'email' },
          { key: 'phone', label: 'Phone', placeholder: '(303) 555-0142', type: 'phone' },
        ],
      },
      {
        title: 'Credit Bureau',
        subtitle: 'Who are you writing to?',
        fields: [
          { key: 'bureauName', label: 'Bureau / Company Name', placeholder: 'Experian', required: true },
          { key: 'bureauAddress', label: 'Bureau Address', placeholder: 'P.O. Box 4500, Allen, TX 75013', required: true, multiline: true },
          { key: 'letterDate', label: 'Date', placeholder: 'March 14, 2026', type: 'date', required: true, helper: 'The date on the letter.' },
        ],
      },
      {
        title: 'Dispute Details',
        subtitle: 'What is being disputed?',
        fields: [
          { key: 'accountNumber', label: 'Account Number', placeholder: 'XXXX-XXXX-1234', required: true },
          { key: 'creditor', label: 'Creditor / Furnisher', placeholder: 'Silverline Bank', required: true },
          { key: 'reason', label: 'Reason for Dispute', placeholder: 'This account does not belong to me and was never opened by me.', required: true, multiline: true, helper: 'Be specific and factual.' },
        ],
      },
      {
        title: 'Additional Notes',
        subtitle: 'Optional extra context.',
        fields: [
          { key: 'notes', label: 'Supporting Details', placeholder: 'I have attached a copy of my ID and a police report.', multiline: true },
        ],
      },
    ],
  },
  rental_letter: {
    id: 'rental_letter',
    title: 'Rental / Landlord Letter',
    tagline: 'Communicate formally with your landlord',
    description: 'Notice to vacate, maintenance request, or general tenancy correspondence.',
    icon: Home,
    steps: [
      {
        title: 'Your Information',
        fields: [
          { key: 'fullName', label: 'Full Name', placeholder: 'Priya Shankar', required: true },
          { key: 'address', label: 'Your Address', placeholder: 'Apt 4B, 221 Maple Ave, Austin, TX 78701', required: true, multiline: true },
          { key: 'email', label: 'Email', placeholder: 'priya@email.com', type: 'email' },
          { key: 'phone', label: 'Phone', placeholder: '(512) 555-0199', type: 'phone' },
        ],
      },
      {
        title: 'Landlord / Property',
        fields: [
          { key: 'landlordName', label: 'Landlord Name', placeholder: 'Mr. David Chen', required: true },
          { key: 'propertyAddress', label: 'Property / Office Address', placeholder: '100 Realty Dr, Austin, TX 78702', required: true, multiline: true },
          { key: 'letterDate', label: 'Date', placeholder: 'March 14, 2026', type: 'date', required: true },
        ],
      },
      {
        title: 'Purpose',
        fields: [
          { key: 'subject', label: 'Subject Line', placeholder: '30-Day Notice to Vacate', required: true, helper: 'e.g. Notice to Vacate, Maintenance Request.' },
          { key: 'body', label: 'Details', placeholder: 'I am writing to inform you that I will be vacating the above property on April 15, 2026...', required: true, multiline: true },
        ],
      },
    ],
  },
  simple_agreement: {
    id: 'simple_agreement',
    title: 'Simple Agreement',
    tagline: 'A clean, basic contract between two parties',
    description: 'Outline terms, scope, and mutual commitments in plain language.',
    icon: FileSignature,
    steps: [
      {
        title: 'Party A',
        subtitle: 'The first party to the agreement.',
        fields: [
          { key: 'partyA_name', label: 'Full Name or Company', placeholder: 'Lena Ortiz', required: true },
          { key: 'partyA_address', label: 'Address', placeholder: '88 Harbor St, Seattle, WA 98101', required: true, multiline: true },
        ],
      },
      {
        title: 'Party B',
        subtitle: 'The second party to the agreement.',
        fields: [
          { key: 'partyB_name', label: 'Full Name or Company', placeholder: 'Northstar Studios LLC', required: true },
          { key: 'partyB_address', label: 'Address', placeholder: '500 Pine St, Seattle, WA 98104', required: true, multiline: true },
        ],
      },
      {
        title: 'Agreement Terms',
        fields: [
          { key: 'subject', label: 'Agreement Title', placeholder: 'Freelance Design Services Agreement', required: true },
          { key: 'letterDate', label: 'Effective Date', placeholder: 'March 14, 2026', type: 'date', required: true },
          { key: 'terms', label: 'Terms & Scope', placeholder: 'Party A agrees to provide graphic design services to Party B for a fee of $1,500, to be completed by April 30, 2026...', required: true, multiline: true, helper: 'Describe scope, payment, timeline, and obligations.' },
        ],
      },
      {
        title: 'Additional Clauses',
        fields: [
          { key: 'extra', label: 'Extra Conditions (optional)', placeholder: 'Either party may terminate this agreement with 14 days written notice.', multiline: true },
        ],
      },
    ],
  },
  childcare_agreement: {
    id: 'childcare_agreement',
    title: 'Childcare Agreement',
    tagline: 'Set clear terms with your caregiver',
    description: 'Document schedule, rate, and responsibilities for childcare arrangements.',
    icon: Baby,
    steps: [
      {
        title: 'Parent / Guardian',
        fields: [
          { key: 'parentName', label: 'Full Name', placeholder: 'Samuel & Grace Okafor', required: true },
          { key: 'parentAddress', label: 'Home Address', placeholder: '33 Willow Crescent, Toronto, ON M5S 1A1', required: true, multiline: true },
          { key: 'parentPhone', label: 'Phone', placeholder: '(416) 555-0134', type: 'phone', required: true },
        ],
      },
      {
        title: 'Caregiver',
        fields: [
          { key: 'caregiverName', label: 'Caregiver Full Name', placeholder: 'Ms. Eleanor Hart', required: true },
          { key: 'caregiverAddress', label: 'Caregiver Address', placeholder: '212 Bathurst St, Toronto, ON M5T 2R9', multiline: true },
          { key: 'caregiverPhone', label: 'Caregiver Phone', placeholder: '(416) 555-0177', type: 'phone' },
        ],
      },
      {
        title: 'Children',
        fields: [
          { key: 'children', label: 'Children (Names & Ages)', placeholder: 'Zara Okafor, age 5\nIdris Okafor, age 3', required: true, multiline: true, helper: 'One per line.' },
        ],
      },
      {
        title: 'Schedule & Payment',
        fields: [
          { key: 'schedule', label: 'Days & Hours', placeholder: 'Monday to Friday, 8:00 AM – 5:30 PM', required: true, multiline: true },
          { key: 'rate', label: 'Payment Rate', placeholder: '$22/hour, paid bi-weekly via e-transfer', required: true },
          { key: 'startDate', label: 'Start Date', placeholder: 'April 1, 2026', type: 'date', required: true },
        ],
      },
      {
        title: 'Responsibilities & Terms',
        fields: [
          { key: 'duties', label: 'Duties & Responsibilities', placeholder: 'Meal preparation, school drop-off and pick-up, homework supervision, light tidying of play areas.', multiline: true },
          { key: 'notes', label: 'Additional Terms', placeholder: 'Two weeks paid vacation per year. Either party may end this arrangement with 30 days notice.', multiline: true },
        ],
      },
    ],
  },
  formal_letter: {
    id: 'formal_letter',
    title: 'General Formal Letter',
    tagline: 'A polished letter for any formal purpose',
    description: 'Compose a well-structured business, request, or complaint letter.',
    icon: Mail,
    steps: [
      {
        title: 'Your Information',
        fields: [
          { key: 'fullName', label: 'Full Name', placeholder: 'Alexander Moreau', required: true },
          { key: 'address', label: 'Your Address', placeholder: '17 Rue de la Paix, Montreal, QC H3G 1T7', required: true, multiline: true },
          { key: 'email', label: 'Email', placeholder: 'alex.moreau@email.com', type: 'email' },
          { key: 'phone', label: 'Phone', placeholder: '(514) 555-0123', type: 'phone' },
        ],
      },
      {
        title: 'Recipient',
        fields: [
          { key: 'recipientName', label: 'Recipient Name', placeholder: 'Ms. Hannah Liu, HR Director', required: true },
          { key: 'recipientOrg', label: 'Organization (optional)', placeholder: 'Meridian Consulting Group' },
          { key: 'recipientAddress', label: 'Recipient Address', placeholder: '500 Bay St, Suite 2200, Toronto, ON M5G 2N8', required: true, multiline: true },
          { key: 'letterDate', label: 'Date', placeholder: 'March 14, 2026', type: 'date', required: true },
        ],
      },
      {
        title: 'Message',
        fields: [
          { key: 'subject', label: 'Subject Line', placeholder: 'Request for Letter of Reference', required: true },
          { key: 'body', label: 'Body', placeholder: 'I hope this letter finds you well. I am writing to respectfully request...', required: true, multiline: true, helper: 'Write in clear paragraphs.' },
        ],
      },
    ],
  },
};

export const DOCUMENT_TYPE_LIST: DocumentTypeSchema[] = Object.values(DOCUMENT_TYPES);
