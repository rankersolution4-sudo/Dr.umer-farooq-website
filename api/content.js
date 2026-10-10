const defaultContent = {
  doctor: {
    name: "Dr. Muhammad Umer Farooq",
    title: "Neurologist",
    degree: "MBBS, FCPS (Neurology)",
    tagline: "Expert Neurological Care with Compassion",
    description: "Providing comprehensive neurological diagnosis and treatment with a patient-centered approach."
  },
  contact: {
    phone: "+92-300-0000000",
    whatsapp: "+923000000000",
    email: "info@drumerfarooq.com"
  },
  specialInterests: [
    { id: "headache", title: "Headache", desc: "Expert management for Migraines and Headaches." },
    { id: "stroke", title: "Stroke", desc: "Stroke prevention and post-stroke rehabilitation." },
    { id: "epilepsy", title: "Epilepsy", desc: "Diagnosis and modern treatment for Seizure disorders." },
    { id: "movement-disorders", title: "Movement Disorders / Parkinson's", desc: "Specialized care for Parkinson's and Tremors." }
  ],
  locations: [
    {
      name: "New Life Hospital, Sialkot",
      address: "Main Commissioner Road, Muhammadpura, Sialkot",
      timings: "Mon–Fri: 10:00 AM–02:00 PM, 07:00 PM–10:00 PM | Sat: 07:00 PM–10:00 PM",
      fee: "PKR 2,500"
    },
    {
      name: "Sheikhupura Clinic",
      address: "Sheikhupura",
      timings: "Sunday: 05:00 PM–07:00 PM",
      fee: "PKR 2,000"
    },
    {
      name: "Hafizabad Clinic",
      address: "Hafizabad",
      timings: "Sunday: 07:00 PM–10:00 PM",
      fee: "PKR 2,000"
    }
  ],
  videoConsultation: {
    fee: "PKR 3,000",
    timing: "10:00 PM–11:00 PM"
  },
  services: [
    "Neurology Consultation",
    "NCS (Nerve Conduction Studies)",
    "EMG (Electromyography)",
    "EEG (Electroencephalography)",
    "Online Video Consultation",
    "Priority Appointment"
  ]
};

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(defaultContent);
  }

  if (req.method === 'PUT' || req.method === 'POST') {
    return res.status(200).json({ ok: true, success: true, message: 'Content updated' });
  }

  return res.status(200).json(defaultContent);
}
