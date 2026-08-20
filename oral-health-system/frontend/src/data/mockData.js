// Central mock data used to power the clickable prototype.
// Replace with real API calls (see /backend) once endpoints are wired up.

export const currentUser = {
  name: 'Nadeesha Perera',
  email: 'user@gmail.com',
  role: 'Student',
  avatar: null,
};

export const adminUser = {
  name: 'Admin Super Admin',
  email: 'admin@oralhealth.com',
  role: 'Super Admin',
};

export const dashboardStats = [
  { label: 'Predictions Made', value: 12 },
  { label: 'Quizzes Completed', value: 8 },
  { label: 'Chats', value: 15 },
];

export const tips = [
  'Brush twice daily, reduce sugar intake and visit your dentist regularly.',
  'Floss daily to remove plaque between teeth.',
  'Replace your toothbrush every 3 months.',
];

export const symptomQuestions = [
  'Tooth Pain',
  'Gum Bleeding',
  'Bad Breath',
  'Mouth Ulcer',
  'Tooth Sensitivity',
  'Swelling',
  'White Spots',
];

export const predictionResult = {
  disease: 'Dental Caries',
  riskLevel: 'High',
  why: 'High sugar intake, low brushing frequency and plaque build-up increases the risk.',
  actions: [
    'Brush twice daily with fluoride toothpaste',
    'Reduce sugary foods and drinks',
    'Floss daily',
    'Visit your dentist',
  ],
};

export const imagePredictionResult = {
  condition: 'Dental Calculus (Tartar Detected)',
  confidence: 92,
};

export const chatMessages = [
  { from: 'bot', text: 'Hi! How can I help you today?' },
  { from: 'user', text: 'What causes gum bleeding?' },
  { from: 'bot', text: 'Gum bleeding is usually caused by plaque build-up, gingivitis, improper brushing, vitamin deficiency, or certain medical conditions.' },
  { from: 'user', text: 'How can I prevent it?' },
  { from: 'bot', text: 'Brush twice daily, floss regularly, eat healthy, and visit your dentist for regular checkups.' },
];

export const quizTopics = [
  { name: 'Oral Hygiene Basics', active: true },
  { name: 'Teeth Anatomy', active: false },
  { name: 'Common Diseases', active: false },
  { name: 'Diet & Nutrition', active: false },
  { name: 'Preventive Care', active: false },
];

export const quizQuestion = {
  index: 1,
  total: 10,
  question: 'How many times a day should you brush your teeth?',
  options: ['Once', 'Twice', 'Three times', 'Whenever I remember'],
  progressPercent: 20,
  score: '2 / 10',
};

export const clinics = [
  { name: 'Bright Smile Dental Clinic', distance: '1.2 km', address: 'Colombo 06' },
  { name: 'Healthy Teeth Care', distance: '2.5 km', address: 'Colombo 07' },
  { name: 'Advanced Dental Center', distance: '3.1 km', address: 'Nugegoda' },
];

export const newsletters = [
  { title: '10 Tips for Strong Teeth', date: 'May 2024' },
  { title: 'Importance of Regular Checkups', date: 'Apr 2024' },
  { title: 'Healthy Foods for Your Teeth', date: 'Mar 2024' },
];

// ---------------- ADMIN MOCK DATA ----------------

export const adminOverviewStats = [
  { label: 'Total Users', value: '1,245', delta: '+12% this month' },
  { label: 'Total Clinics', value: '56', delta: '+5% this month' },
  { label: 'Total Predictions', value: '3,782', delta: '+30% this month' },
  { label: 'Newsletters', value: '23', delta: '+8% this month' },
];

export const recentActivity = [
  'John Doe uploaded a new Xray image',
  'Prediction completed for "Jane Smith"',
  'New user "Michael" registered',
  'Newsletter "Dental Care Tips" sent',
  'Clinic "Bright Smile Clinic" added',
];

export const weeklySeries = [320, 480, 300, 690, 420, 610, 540];
export const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const usersTable = [
  { name: 'John Doe', email: 'john.doe@email.com', role: 'Patient', status: 'Active', joined: '10 May 2025' },
  { name: 'Jane Smith', email: 'jane.smith@email.com', role: 'Patient', status: 'Active', joined: '12 May 2025' },
  { name: 'Michael Lee', email: 'michael.lee@email.com', role: 'Patient', status: 'Blocked', joined: '18 May 2025' },
  { name: 'Sarah Wilson', email: 'sarah.wilson@email.com', role: 'Patient', status: 'Active', joined: '20 May 2025' },
  { name: 'David Brown', email: 'david.brown@email.com', role: 'Dentist', status: 'Active', joined: '22 May 2025' },
  { name: 'Emily Davis', email: 'emily.davis@email.com', role: 'Patient', status: 'Blocked', joined: '25 May 2025' },
];

export const clinicsTable = [
  { name: 'Bright Smile Dental', address: '123 Main Street, Colombo', phone: '+94 71 234 5678', status: 'Active' },
  { name: 'Healthy Teeth Clinic', address: '45 Galle Road, Colombo', phone: '+94 77 654 3210', status: 'Active' },
  { name: 'Perfect Dental Care', address: '78 Kandy Road, Kandy', phone: '+94 81 234 5648', status: 'Pending' },
  { name: 'Smile Zone Clinic', address: '25 Nugegoda Road, Nugegoda', phone: '+94 71 987 7898', status: 'Active' },
  { name: 'Oral Health Center', address: '9 Station Road, Jaffna', phone: '+94 21 567 4423', status: 'Blocked' },
];

export const newsletterTable = [
  { title: 'Dental Care Tips', status: 'Sent', sentOn: '15 May 2025', recipients: '1,120' },
  { title: 'New Feature Update', status: 'Draft', sentOn: '-', recipients: '-' },
  { title: 'Oral Health Awareness', status: 'Sent', sentOn: '01 May 2025', recipients: '1,081' },
  { title: 'Preventive Dental Care', status: 'Scheduled', sentOn: '28 May 2025', recipients: '-' },
];

export const analyticsSummary = [
  { label: 'Total Predictions', value: '3,782', delta: '+11%' },
  { label: 'Dental Caries', value: '2,125', delta: '58.0% of cases' },
  { label: 'Active Users', value: '1,245', delta: '+6.4%' },
  { label: 'Accuracy', value: '92.4%', delta: '+4.2%' },
];

export const topConditions = [
  { name: 'Caries', percent: 32, color: '#279791' },
  { name: 'Gingivitis', percent: 24, color: '#43b3ac' },
  { name: 'Periodontitis', percent: 18, color: '#78d2cc' },
  { name: 'Others', percent: 26, color: '#d4f3f1' },
];
