// Events from the live site's Events tab (wegotocalstatela.org), sorted into the five
// resource categories by hand. Each category page shows the next three that haven't
// happened yet. Events that didn't fit a category (study sessions, graduation, parking)
// and private events are left out.
//
// Copied from the site on November 13, 2026. This list does not update by itself: when
// events are added or the sample data is reset, it needs to be copied again. The long-term
// fix is a category field on events, so the page can ask the API instead.

const EVENT_PAGE = 'https://wegotocalstatela.org/home_screen/details?eventId=';

export function eventUrl(event) {
  return EVENT_PAGE + event.id;
}

export const categoryEvents = {
  career: [
    {
      id: 'b6903faa-9072-4864-af88-057eb41cdbf2',
      title: 'Resume and Interview Prep',
      date: '2026-11-24',
      time: '6:30 PM',
      description: 'Practice a thirty-second introduction and get feedback on a resume.',
    },
    {
      id: 'e9c270f4-4503-4e33-a356-16d4899bba04',
      title: 'Resume and Interview Prep: A Night for Students and Their Supporters',
      date: '2026-12-17',
      time: '5:30 PM',
      description: 'Practice interview questions, review resumes, and learn how family members can help students feel prepared and confident.',
    },
    {
      id: '791079ba-1174-4249-b72a-35a76885e811',
      title: 'Career Prep Night: How Families Can Help',
      date: '2026-12-22',
      time: '5:00 PM',
      description: 'Learn how families can support resume building, internships, and first-job conversations.',
    },
    {
      id: '83fcea03-108e-4724-a138-3c8f5d17d7ea',
      title: 'Internship Info Session',
      date: '2027-02-03',
      time: '5:30 PM',
      description: 'Learn how families can support a job or internship search, from resumes to mock interviews.',
    },
    {
      id: '988078e0-cdb6-44d6-8f4e-cc76ac18c3db',
      title: 'Career Prep Night: How Families Can Help (Evening Session)',
      date: '2027-04-01',
      time: '6:15 PM',
      description: 'Learn how families can support a job or internship search, from resumes to mock interviews.',
    },
  ],
  social: [
    {
      id: '728969a7-e17c-4625-9277-a4bab78fd51e',
      title: 'Family Potluck Dinner',
      date: '2026-11-13',
      time: '6:30 PM',
      description: 'Bring a dish to share and meet other families over dinner. Everyone is welcome, including siblings, grandparents, and friends.',
    },
    {
      id: '3304ec3f-030b-44cb-8420-ec000a795951',
      title: 'Family Welcome Night: Meet Other Support Partners',
      date: '2026-11-16',
      time: '6:00 PM',
      description: "An evening for parents, guardians, siblings, and mentors to meet each other, ask questions, and learn how to support your student's first year.",
    },
    {
      id: 'bfb6a484-c680-42bd-9bc3-d356e3f26806',
      title: 'Family Welcome Night',
      date: '2026-11-16',
      time: '6:30 PM',
      description: "An evening for parents, guardians, siblings, and mentors to meet each other and learn how to support a student's first year.",
    },
    {
      id: 'ba4dcf51-8c66-4445-a360-c8f46e6500fa',
      title: 'Morning Coffee for Supporters',
      date: '2026-11-17',
      time: '10:15 AM',
      description: 'A relaxed morning for families of commuter students to share tips on rides, parking, and staying connected.',
    },
    {
      id: '1a1b1b38-a1df-4528-8210-7851a07a3f8f',
      title: 'New Mentor Orientation',
      date: '2026-11-18',
      time: '7:30 PM',
      description: 'Mentors trade ideas for supporting students through a stressful stretch.',
    },
    {
      id: '6c547078-4f1d-4c25-97bf-9d997a94a1c7',
      title: 'New Family Meet and Greet',
      date: '2026-11-20',
      time: '5:30 PM',
      description: "An evening for parents, guardians, siblings, and mentors to meet each other and learn how to support a student's first year.",
    },
    {
      id: '74d7032e-e315-47a8-b511-6067485d8e83',
      title: 'Siblings Game Night',
      date: '2026-11-20',
      time: '7:00 PM',
      description: 'Board games, card games, and snacks for brothers and sisters of Cal State LA students.',
    },
    {
      id: '1c613bf8-c0f6-4b16-8aa8-c8140e90056e',
      title: 'Commuter Families Coffee Hour',
      date: '2026-11-27',
      time: '8:30 AM',
      description: 'Start the morning with coffee and swap tips with other families whose students commute: parking, transit, and balancing family time.',
    },
    {
      id: 'dffede17-71c2-4b03-827c-e2f8a0ac3064',
      title: 'First-Gen Families Circle',
      date: '2026-12-01',
      time: '6:30 PM',
      description: 'A welcoming space for families of first-generation students to share questions, wins, and encouragement. Bring your questions and your experience.',
    },
    {
      id: '36f09087-2463-4dbb-86ca-b0d4ed58f33b',
      title: 'Mentor Meetup: Guiding Students Through Midterms',
      date: '2026-12-05',
      time: '6:30 PM',
      description: 'An open conversation for mentors, relatives, and family friends about encouraging students during stressful weeks.',
    },
    {
      id: 'df4d619a-7392-47eb-bb40-3509410c2b7b',
      title: 'Family and Friends Weekend Brunch',
      date: '2026-12-16',
      time: '11:00 AM',
      description: 'Good food and good company for families, friends, and students.',
    },
  ],
  financial: [
    {
      id: '9a52a509-2d67-401f-beb4-c4630e1d9cb5',
      title: 'Financial Aid Basics for Families',
      date: '2026-11-18',
      time: '5:30 PM',
      description: 'A friendly walk-through of deadlines, forms, and questions families often ask about paying for college.',
    },
    {
      id: '2acca53e-a64b-499d-95a5-e5fa0729181d',
      title: 'Scholarship Search Workshop',
      date: '2026-11-20',
      time: '5:00 PM',
      description: 'A friendly walk through deadlines, forms, and questions to ask the aid office. Bring your questions.',
    },
    {
      id: '1d8fad24-fd24-4217-b185-ffd9348f0611',
      title: 'Cooking on a Student Budget',
      date: '2026-11-23',
      time: '12:00 PM',
      description: 'Simple, realistic ideas for sleep, meals, and stress, for students and the people who support them.',
    },
    {
      id: '892beafd-05e6-47ff-abb5-6d749f9d25b1',
      title: 'FAFSA Help Desk Evening',
      date: '2027-03-04',
      time: '5:15 PM',
      description: 'Hands-on help finding and applying for scholarships. Laptops and snacks provided.',
    },
  ],
  physical: [
    {
      id: '112e8c61-660d-4d89-a3bc-97f94e2fc9a7',
      title: 'Campus Wellness Walk',
      date: '2026-11-18',
      time: '9:00 AM',
      description: 'A gentle walk around campus with time to talk. Comfortable shoes and water recommended.',
    },
    {
      id: 'd458063c-9063-485a-a1f1-b17d37cd9cdd',
      title: 'Wellness Fair: Resources for Student Well-Being (Evening Session)',
      date: '2026-11-19',
      time: '12:00 PM',
      description: 'Tables from campus wellness services, plus calming activities for students and supporters.',
    },
    {
      id: '8ad4b880-b60a-4eb9-acb4-cad072ddf03e',
      title: 'Wellness Fair: Resources for Student Well-Being',
      date: '2026-11-21',
      time: '11:00 AM',
      description: 'Learn about wellness, counseling, and healthy-habit resources, and how families can encourage students to use them.',
    },
    {
      id: '8fcf8daf-c5ba-4460-b981-8b20edabfad0',
      title: 'Evening Stroll for Supporters',
      date: '2026-12-30',
      time: '9:15 AM',
      description: 'A gentle walk around campus with time to talk. Comfortable shoes and water recommended.',
    },
    {
      id: 'b9e2ee8f-a300-411d-9a68-f19621601d30',
      title: 'Healthy Habits Workshop: Sleep, Food, and Stress (Evening Session)',
      date: '2026-12-30',
      time: '12:00 PM',
      description: 'Simple, realistic ideas for sleep, meals, and stress, for students and the people who support them.',
    },
    {
      id: '7ff8a82d-6f91-416d-ba96-dd7fa609401b',
      title: 'Stress Less Together Workshop',
      date: '2027-03-28',
      time: '12:30 PM',
      description: 'Tables from campus wellness services, plus calming activities for students and supporters.',
    },
  ],
  community: [
    {
      id: '15a71dc1-2e65-487b-815c-9a2071b1f78c',
      title: "Dean's Listening Session for Families",
      date: '2026-11-24',
      time: '5:00 PM',
      description: 'An open conversation with families, mentors, and students about what is working and what could be better. Your ideas shape what comes next.',
    },
    {
      id: '195d6071-ecd0-4579-8d2b-9cb281d690a2',
      title: 'Community Resource Showcase',
      date: '2026-12-13',
      time: '10:15 AM',
      description: 'Tables for food, housing, health, and academic support, with friendly people at each.',
    },
    {
      id: '2be04404-ca87-4dba-9938-d0244749f641',
      title: 'Community Volunteer Appreciation Lunch',
      date: '2026-12-16',
      time: '12:00 PM',
      description: 'A thank-you lunch for the volunteers, mentors, and families who make this community work. Everyone who has helped is invited to share a meal.',
    },
    {
      id: '2a824077-d932-4696-932b-8bafcef7650d',
      title: 'Welcome Kit Assembly Party',
      date: '2026-12-20',
      time: '3:00 PM',
      description: 'Write a kind note for a first-year student. We provide the cards and pens.',
    },
    {
      id: 'a13704e3-6bd3-4b8b-92b7-2463417b1ec3',
      title: 'Campus Resource Fair for Families (Evening Session)',
      date: '2026-12-25',
      time: '11:30 AM',
      description: 'Meet campus offices and community groups in one place. Bring your questions.',
    },
    {
      id: 'f927d478-3a3c-4b34-88ee-3c195d72aa80',
      title: 'Care Package Packing Day',
      date: '2027-01-05',
      time: '11:30 AM',
      description: 'Help pack care packages for students who could use a boost. Supplies and snacks provided.',
    },
  ],
};

// The next `count` events in a category that haven't happened yet (today still counts).
export function upcomingCategoryEvents(categoryId, count = 3) {
  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
  return (categoryEvents[categoryId] ?? []).filter((event) => event.date >= today).slice(0, count);
}

// '2026-11-18' -> 'Nov 18, 2026', the same style the Events tab uses.
export function formatEventDate(date) {
  const [year, month, day] = date.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[month - 1]} ${day}, ${year}`;
}
