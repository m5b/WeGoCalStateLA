// The handwritten part of the extra demo data, added on top of demoData.mjs (demoMerge.mjs puts it all
// together, and seedDemo.mjs loads the result). demoTopics.mjs holds the banks used to generate the rest.
// Everything here is invented.
//
//  user:   a username, 'team' for the community team account, or null for an anonymous POST (replies can
//          no longer be anonymous: the site now requires an account to reply).
//  title:  every post needs its own 10-200 character title that is not just its text; private posts show
//          that title to signed-out visitors.
//  ago:    [days, hours] before today, for posts and events.
//  later:  for replies: how many hours after the one before it (or after the post, for the first).
//  fill:   how many extra short replies to generate for that post or event.
//  photo:  a file name in server/demo/images.
//  isPublic: true/false to force how a post or event looks to signed-out visitors.

// ------------------------------------------------------------------ the original people and posts
// The profile page offers these five interests, so the original people are switched to them too.
export const BASE_USER_INTERESTS = {
    Admin: 'Community Wellness',
    Dean: 'Career Wellness, Social Wellness, Community Wellness',
    Rosa: 'Financial Wellness, Social Wellness',
    David: 'Financial Wellness, Career Wellness',
    Keiko: 'Social Wellness, Community Wellness',
    Tom: 'Physical Wellness, Social Wellness',
    Yusuf: 'Career Wellness, Financial Wellness',
    Mei: 'Community Wellness, Physical Wellness',
    Carmen: 'Social Wellness, Community Wellness',
    Aaliyah: 'Physical Wellness, Social Wellness',
    Nora: 'Social Wellness, Physical Wellness',
    Priya: 'Financial Wellness, Community Wellness',
    Javier: 'Social Wellness, Community Wellness',
    Hector: 'Financial Wellness, Career Wellness',
    Gloria: 'Community Wellness, Social Wellness',
    Sam: 'Career Wellness, Social Wellness',
    Ben: 'Physical Wellness, Social Wellness',
    Marcus: 'Career Wellness, Community Wellness',
    Lena: 'Physical Wellness, Community Wellness, Career Wellness',
    Fatima: 'Career Wellness, Community Wellness',
    Darnell: 'Community Wellness, Career Wellness',
}

// Titles for the original 31 posts in demoData.mjs, in the same order.
export const BASE_POST_TITLES = [
    'How to check in with a commuting student', 'Financial aid deadlines for the spring semester', 'Our grandson is the first to go to college',
    'Care package ideas for midterms', 'Mentor tip: ask what they are proud of', 'Affordable housing in LA',
    'Encouragement from far away during finals', 'A fixed weekly study time', 'Bringing up counseling gently',
    'When our son does not tell us he is struggling', 'Move-in day and the parking lot tears', 'Staying connected on weekends',
    'Helping with school forms in Spanish', 'Balancing work and school', 'Sunday night homesickness',
    'A roommate is worried about a friend', 'First-semester grades often dip', 'Getting students excited about internships',
    'Changing majors after one semester', 'Using the Resources section for support', 'Late commutes after evening classes',
    'Our Sunday dinner highlight and challenge', 'You do not have to have all the answers', 'A small win after weekly check-ins',
    'Carpools and transit passes', 'Recharging when you worry about your student', 'Thank you to this group',
    'Week one update from campus', 'Planning ahead for graduation', 'Money is tight at home',
    'Coffee after class turned into a good talk',
]

// ------------------------------------------------------------------ more people
export const EXTRA_USERS = [
    { username: 'Elena', alias: 'Mama Elena', relationship: 'Parent', interests: 'Financial Wellness, Social Wellness' },
    { username: 'Omar', alias: 'Baba Omar', relationship: 'Parent', interests: 'Career Wellness, Community Wellness' },
    { username: 'Grace', alias: 'Grace from Pasadena', relationship: 'Parent', interests: 'Physical Wellness, Social Wellness' },
    { username: 'Raj', alias: 'Raj the Rideshare Dad', relationship: 'Parent', interests: 'Financial Wellness, Career Wellness' },
    { username: 'Sofia', alias: 'Sofia (Mom of Two)', relationship: 'Parent', interests: 'Social Wellness, Community Wellness' },
    { username: 'Malik', alias: 'Husband Malik', relationship: 'Spouse / Partner', interests: 'Community Wellness, Career Wellness' },
    { username: 'Isabel', alias: 'Partner Isabel', relationship: 'Spouse / Partner', interests: 'Social Wellness, Physical Wellness' },
    { username: 'Hannah', alias: 'Nana Hannah', relationship: 'Guardian', interests: 'Community Wellness, Social Wellness' },
    { username: 'Diego', alias: 'Guardian Diego', relationship: 'Guardian', interests: 'Financial Wellness, Physical Wellness' },
    { username: 'Lucia', alias: 'Madrina Lucia', relationship: 'Guardian', interests: 'Social Wellness, Community Wellness' },
    { username: 'Andre', alias: 'Big Bro Andre', relationship: 'Sibling', interests: 'Social Wellness, Physical Wellness' },
    { username: 'Mina', alias: 'Little Sis Mina', relationship: 'Sibling', interests: 'Social Wellness, Career Wellness' },
    { username: 'Victor', alias: 'Cousin Victor', relationship: 'Other', interests: 'Social Wellness, Community Wellness' },
    { username: 'Alma', alias: 'Alma the Neighbor', relationship: 'Other', interests: 'Community Wellness, Physical Wellness' },
    { username: 'Jamal', alias: 'Best Friend Jamal', relationship: 'Friend', interests: 'Social Wellness, Career Wellness' },
    { username: 'Tess', alias: 'Tess (Study Partner)', relationship: 'Friend', interests: 'Career Wellness, Social Wellness' },
    { username: 'Kenji', alias: 'Mentor Kenji', relationship: 'Supporter / Mentor', interests: 'Career Wellness, Community Wellness' },
    { username: 'Bianca', alias: 'Advisor Bianca', relationship: 'Supporter / Mentor', interests: 'Career Wellness, Financial Wellness' },
    { username: 'Samir', alias: 'Coach Samir', relationship: 'Supporter / Mentor', interests: 'Physical Wellness, Community Wellness' },
    { username: 'Nadia', alias: 'Volunteer Nadia', relationship: 'Supporter / Mentor', interests: 'Community Wellness, Social Wellness' },
    { username: 'Owen', alias: 'Alumni Owen', relationship: 'Supporter / Mentor', interests: 'Career Wellness, Social Wellness, Community Wellness' },
]

// --------------------------------------------------------- handwritten posts
export const EXTRA_POSTS = [
    { // 0
        user: 'Elena', ago: [32, 6], title: 'Our FAFSA verification letter arrived',
        text: 'Our FAFSA verification letter just arrived and we panicked a little. Has anyone been through verification? What documents did they ask for, and how long did it take?',
        fill: 2,
        replies: [
            { user: 'Marcus', later: 9, text: 'Ask the financial aid office for the exact checklist. Ours wanted tax transcripts and a signed statement, and it took about two weeks.' },
            { user: 'Hector', later: 6, text: "Don't panic, it's routine. Respond quickly and keep copies of everything you send." },
            { user: 'Rosa', later: 14, text: 'Same thing happened to us last spring. The office was kind and answered every question we asked.' },
        ],
    },
    { // 1
        user: 'Diego', ago: [25, 9], title: 'Does the campus have a food pantry?',
        text: "Does anyone know if the campus has a food pantry? My nephew skips meals to save money and won't tell me directly. I only found out from his roommate.",
        fill: 2,
        replies: [
            { user: 'Lena', later: 5, text: 'Most campuses do, and using it is completely normal. He can ask Student Affairs where it is.' },
            { user: 'Bianca', later: 8, text: 'I am an advisor here. If you share this with him gently, I can point him to basic needs support.' },
            { user: 'Nadia', later: 6, text: 'We also collect snacks and welcome kits for students. Message me if you want to help.' },
        ],
    },
    { // 2
        user: 'Owen', ago: [13, 9], title: 'Alumni story: I nearly dropped out',
        text: "Alumni story: I nearly dropped out junior year. A mentor and my mom's weekly voicemails kept me in school. If you're sending those texts and voicemails, they matter more than you know.",
        fill: 3,
        replies: [
            { user: 'Rosa', later: 3, text: 'Thank you for sharing this, Owen. I needed to hear it.' },
            { user: 'Keiko', later: 5, text: 'Crying at my desk.' },
            { user: 'Marcus', later: 4, text: 'This is why we do this.' },
            { user: 'Dean', later: 6, text: 'Thank you for sharing. Stories like this are why this community matters.' },
        ],
    },
    { // 3
        user: 'Dean', ago: [12, 4], isPublic: true, title: 'What stuck with you from a mentor?',
        text: 'Excited to join this community. What is one thing a mentor or family member said to you that really stuck with you?',
        fill: 3,
        replies: [
            { user: 'Lena', later: 4, text: "'You don't have to have it figured out yet.'" },
            { user: 'Mei', later: 6, text: "'Your best is enough.'" },
            { user: 'Rosa', later: 5, text: "'Call me anytime, even if it's just to say hi.'" },
            { user: 'Dean', later: 7, text: 'Thank you, all. These are wonderful.' },
        ],
    },
    { // 4
        user: 'Dean', ago: [8, 6], isPublic: true, title: 'Financial Aid Basics night this week',
        text: 'Reminder to families: the Financial Aid Basics night this week is a great place to ask questions, and the staff are friendly.',
        fill: 2,
        replies: [
            { user: 'David', later: 3, text: 'I will be there.' },
            { user: 'Elena', later: 5, text: 'Will there be a Spanish-speaking volunteer?' },
            { user: 'Dean', later: 4, text: 'Good question. I will check and report back.' },
        ],
    },
    { // 5
        user: 'Dean', ago: [3, 2], photo: 'small-win.jpg', isPublic: true, title: 'A small win with my mentee',
        text: "Celebrated a small win with a student I mentor today: first A on a hard exam. Don't forget to celebrate the small wins!",
        fill: 3,
        replies: [
            { user: 'Marcus', later: 2, text: 'Love it.' },
            { user: 'Keiko', later: 3, text: 'Congratulations to your mentee!' },
        ],
    },
    { // 6
        user: 'Admin', ago: [30, 0], isPublic: true, title: 'Community guidelines reminder',
        text: "Community reminder: please be kind, avoid sharing personal contact details in public posts, and report anything that worries you. We're glad you're here.",
        fill: 2,
        replies: [
            { user: 'Rosa', later: 6, text: 'Thank you for keeping this a safe space.' },
            { user: 'Lena', later: 5, text: 'Well said.' },
        ],
    },
    { // 7
        user: 'Admin', ago: [2, 4], isPublic: true, title: 'New: private messages between members',
        text: 'New: you can now message members directly. Open Messages from your account menu to start a private conversation. You can block someone or report a message from inside any conversation.',
        fill: 2,
        replies: [
            { user: 'Rosa', later: 2, text: 'Love this. Thank you!' },
            { user: 'Marcus', later: 3, text: 'Does the other person get notified?' },
            { user: 'Admin', later: 2, text: 'They see an unread count next to their account menu.' },
        ],
    },
    { // 8
        user: null, ago: [11, 3], title: 'Struggling financially and unsure how to tell her',
        text: "I'm a parent who hasn't told my student we're struggling financially. How do I ask for help without scaring her?",
        fill: 2,
        replies: [
            { user: 'Hector', later: 5, text: 'Be honest in an age-appropriate way. Students often handle the truth better than silence.' },
            { user: 'Lena', later: 8, text: 'Consider talking to financial aid together. They have options you may not know about.' },
            { user: 'Mei', later: 4, text: 'Thank you for being brave enough to ask this.' },
        ],
    },
    { // 9
        user: null, ago: [5, 7], title: 'My sibling is hiding a failing grade',
        text: 'My sibling is failing a class and hiding it from our parents. Do I tell them, or wait?',
        fill: 3,
        replies: [
            { user: 'Aaliyah', later: 3, text: 'Talk to your sibling first and offer to go with them to ask for help.' },
            { user: 'Nora', later: 5, text: 'I would encourage them to tell your parents themselves.' },
            { user: 'Marcus', later: 4, text: 'Tutoring and office hours exist for exactly this.' },
        ],
    },
    { // 10
        user: 'Rosa', ago: [4, 5], title: 'Update on my commuting daughter',
        text: "Update on my commuting daughter, in case it helps someone: the first month was rough. She was tired, quiet, and I kept asking too many questions. I stopped, started leaving dinner warm for her instead, and said only 'I'm proud of you.' Last night she sat at the table for an hour and told me about her classes, her professor, and a friend she made on the bus. Nothing changed except that I stopped pushing. Be patient with yourselves and with them. The conversation comes back when it feels safe.",
        fill: 3,
        replies: [
            { user: 'Keiko', later: 4, text: 'This is beautiful, Rosa. Thank you for the update.' },
            { user: 'David', later: 6, text: 'Warm dinner and no pressure. Writing that down.' },
            { user: 'Mei', later: 5, text: 'Patience is the whole thing.' },
        ],
    },
    { // 11
        user: 'Carmen', ago: [1, 2], title: 'A quick thank you',
        text: 'Thank you all. This group helps.',
        fill: 1,
        replies: [
            { user: 'Gloria', later: 3, text: 'Same.' },
        ],
    },
    { // 12
        user: 'Keiko', ago: [0, 9], title: 'Sunday check-ins when your student works weekends',
        text: 'Does anyone have a good routine for Sunday check-ins when your student works weekends?',
        fill: 3,
        replies: [],
    },
    { // 13
        user: 'David', ago: [0, 5], title: 'Quick poll: how often do you text your student?',
        text: 'Quick question: do you text your student daily, weekly, or only when they text first?',
        fill: 4,
        replies: [],
    },
    { // 14
        user: 'Isabel', ago: [9, 4], title: 'Partner perspective: I never see her awake',
        text: 'Partner perspective: my wife is a full-time student and I work nights. How do other partners support their students without being overbearing? I never see her awake.',
        fill: 2,
        replies: [
            { user: 'Malik', later: 5, text: 'Same boat. We leave each other short voice notes and keep Sunday mornings free no matter what.' },
            { user: 'Tom', later: 7, text: 'Shared calendar helped us. We schedule time together like a class.' },
            { user: 'Lena', later: 6, text: 'Naming the time you do have, even if small, makes it feel less like you are missing each other.' },
        ],
    },
    { // 15
        user: 'Hannah', ago: [26, 4], title: 'Learning the student portal at 72',
        text: "I'm 72 and still learning the student portal. Is there a patient person who could walk me through finding my grandson's class schedule? I don't want to bother him.",
        fill: 1,
        replies: [
            { user: 'Tess', later: 6, text: "Happy to help! Open the portal, tap 'Classes', then 'My Schedule'. If you get stuck, message me." },
            { user: 'Sam', later: 9, text: 'He can also share his screen on a video call and show you. Most students are glad to.' },
            { user: 'Jamal', later: 4, text: 'My grandma keeps a printed copy on the fridge. Ask him to print it for you!' },
        ],
    },
]

// Replies to replies (and deeper) for the posts above, keyed by the post's position in EXTRA_POSTS and then
// by which top-level reply (0 = the first). `later` = hours after the reply above.
export const EXTRA_POST_NESTED = {
    0: { 0: [{ user: 'Elena', later: 3, text: 'Thank you, Marcus. Did you need originals or copies?', replies: [
        { user: 'Marcus', later: 2, text: 'Copies were fine for us, but ask the office to confirm so you do not have to send them twice.' } ] }] },
    1: { 0: [{ user: 'Diego', later: 3, text: 'Thank you, Lena. I did not want to embarrass him.', replies: [
        { user: 'Lena', later: 2, text: 'Many students use it. I would say it is a smart resource, not a last resort.', replies: [
            { user: 'Diego', later: 3, text: 'I will tell him this weekend.' },
            { user: 'Nadia', later: 4, text: 'If he wants company, I can walk over with him.' } ] } ] }] },
    2: { 3: [{ user: 'Owen', later: 3, text: 'Thank you, Dean. I would be glad to speak at an event if it would help.', replies: [
        { user: 'Dean', later: 3, text: 'Please do. I will connect you with the organizers.', replies: [{ user: 'Owen', later: 2, text: 'Wonderful.' }] } ] }] },
    7: { 1: [{ user: 'Marcus', later: 4, text: 'Can I report something if it was said in a private message?', replies: [
        { user: 'Admin', later: 2, text: 'Yes. Tap the message, choose Report, and give a reason. We only see that message, not the whole conversation.', replies: [
            { user: 'Marcus', later: 2, text: 'Perfect, thank you.' } ] } ] }] },
    10: { 1: [{ user: 'David', later: 4, text: 'Does she still go quiet some days?', replies: [
        { user: 'Rosa', later: 3, text: 'Some days. I let her. The warm dinner is still on the stove.', replies: [
            { user: 'David', later: 2, text: 'That is the way.' }, { user: 'Keiko', later: 3, text: 'Warm dinner on the stove is my new motto.' } ] } ] }] },
}

// Extra generated replies on the ORIGINAL 31 posts (one number per post, in order).
export const MORE_FILL_FOR_POSTS = [3, 2, 4, 2, 2, 3, 2, 3, 2, 3, 3, 2, 2, 3, 2, 4, 3, 2, 3, 2, 3, 2, 2, 3, 2, 2, 3, 2, 3, 2, 2]

// ------------------------------------------------------------------ events
// All upcoming (the Events tab hides past events). inDays counts from today; 0 is today. Some have no
// picture, and one is long, so those layouts show up too.
export const EXTRA_EVENTS = [
    { // 0: today
        organizer: 'Rosa', inDays: 0, hour: 18, minute: 30, photo: 'sunday-dinner.jpg', title: 'Family Potluck Dinner', fill: 3,
        description: 'Bring a dish to share and meet other families over dinner. Everyone is welcome, including siblings, grandparents, and friends.',
        replies: [{ user: 'Sofia', later: 5, text: 'We will bring a dessert!' }, { user: 'Rosa', later: 3, text: 'Wonderful, thank you Sofia.' }],
    },
    { // 1
        organizer: 'Admin', inDays: 3, hour: 11, minute: 0, photo: 'first-day-on-campus.jpg', isPublic: true, title: 'Welcome Back Open House', fill: 3,
        description: 'Meet the community team, try the new Messages page, and ask anything about the site. Light refreshments provided.',
        replies: [{ user: 'Rosa', later: 5, text: 'Is this the one with the demo of the new messaging?' }, { user: 'Admin', later: 2, text: 'Yes, and we will answer questions about it.' }],
    },
    { // 2
        organizer: 'Dean', inDays: 11, hour: 17, minute: 0, isPublic: true, title: "Dean's Listening Session for Families", fill: 3,
        description: 'An open conversation with families, mentors, and students about what is working and what could be better. Your ideas shape what comes next.',
        replies: [{ user: 'Rosa', later: 4, text: 'Thank you for doing this. I have a lot to say.' }, { user: 'Dean', later: 3, text: 'Please bring it all. I am listening.' }],
    },
    { // 3
        organizer: 'Dean', inDays: 33, hour: 12, minute: 0, photo: 'resource-fair.jpg', isPublic: true, title: 'Community Volunteer Appreciation Lunch', fill: 2,
        description: 'A thank-you lunch for the volunteers, mentors, and families who make this community work. Everyone who has helped is invited to share a meal.',
        replies: [{ user: 'Nadia', later: 4, text: 'Thank you for doing this for us.' }],
    },
    { // 4: a long description
        organizer: 'Owen', inDays: 36, hour: 18, minute: 0, title: 'Alumni Panel: What I Wish My Family Knew', fill: 3,
        description: 'Cal State LA alumni share what helped them most, what they wish their families had understood, and what they would tell supporters today. Questions from the audience are encouraged, and there will be time to meet the panelists afterward. This is a good event for first-generation families and anyone who wants to hear honest stories from people who have been there.',
        replies: [{ user: 'Dean', later: 3, text: 'Looking forward to this one.' }, { user: 'Keiko', later: 5, text: 'Will it be recorded?' }, { user: 'Owen', later: 4, text: 'We are planning to share notes afterward in the Community tab.' }],
    },
    { // 5
        organizer: 'Hannah', inDays: 28, hour: 14, minute: 0, title: 'Grandparents and Guardians Tea', fill: 2,
        description: 'Tea, pastries, and good company for grandparents and guardians raising or supporting college students.',
        replies: [{ user: 'Mei', later: 5, text: 'I would love to come.' }, { user: 'Diego', later: 7, text: 'Count me in.' }],
    },
    { // 6
        organizer: 'Andre', inDays: 7, hour: 19, minute: 0, title: 'Siblings Game Night', fill: 2,
        description: 'Board games, card games, and snacks for brothers and sisters of Cal State LA students.',
        replies: [{ user: 'Mina', later: 4, text: "I'm bringing cards!" }, { user: 'Nora', later: 6, text: 'Count me in.' }],
    },
    { // 7
        organizer: 'Bianca', inDays: 9, hour: 12, minute: 15, title: 'Parent Q&A with an Academic Advisor', fill: 3,
        description: 'Bring your questions about registration, majors, and how families can help without taking over. Questions can be sent ahead in the replies below.',
        replies: [{ user: 'Elena', later: 5, text: 'Can I send questions ahead?' }, { user: 'Bianca', later: 4, text: "Yes, reply here and I'll cover them." }],
    },
    { // 8
        organizer: 'Lucia', inDays: 16, hour: 18, minute: 0, photo: 'family-welcome-night.jpg', title: 'Spanish-Language Family Orientation', fill: 3,
        description: 'An orientation for Spanish-speaking families: how the campus works, who to call, and how to support your student. Se habla espanol.',
        replies: [{ user: 'Carmen', later: 4, text: 'Gracias por organizar esto!' }, { user: 'Gloria', later: 6, text: 'Nos vemos alli.' }],
    },
    { // 9
        organizer: 'team', inDays: 90, hour: 17, minute: 30, photo: 'family-weekend-brunch.jpg', title: 'Spring Kickoff Mixer', fill: 1,
        description: 'Kick off the new term with food, music, and introductions. A good first stop for new families.',
        replies: [],
    },
]
export const EXTRA_EVENT_NESTED = {
    2: { 0: [{ user: 'Rosa', later: 3, text: 'I will bring a list.', replies: [{ user: 'Dean', later: 2, text: 'Wonderful.', replies: [{ user: 'Keiko', later: 3, text: 'Me too. I will come with Rosa.' }] }] }] },
    4: { 1: [{ user: 'Owen', later: 3, text: 'Yes. A short written summary will go in the Community tab.' }] },
    7: { 0: [{ user: 'Elena', later: 4, text: 'Thank you. I will send mine tonight.', replies: [{ user: 'Bianca', later: 3, text: 'Perfect. I will read them all.' }] }] },
}
// Extra generated replies on the ORIGINAL 14 events.
export const MORE_FILL_FOR_EVENTS = [3, 3, 3, 2, 4, 3, 2, 3, 2, 2, 3, 2, 3, 2]

// ------------------------------------------------------------------- FAQs
// Posted by the community team, added to the original six. The last ones explain features of the site.
export const EXTRA_FAQS = [
    { ago: [22, 0], title: 'Where can my student find free food or basic needs support?', text: "Many campuses have a food pantry and a basic needs office. Ask Student Affairs or your student's advisor where to find them. Using these services is normal, and staff keep requests private." },
    { ago: [22, 0], title: 'What if my student wants to change majors?', text: 'It is common, and often a sign they are learning what fits. Ask what they are curious about, and encourage them to meet with an advisor before deciding.' },
    { ago: [21, 0], title: 'How do I talk about money with my student?', text: 'Start with facts instead of worries: what is covered, what is not, and what is possible. Invite them to share their numbers, then make a simple plan together.' },
    { ago: [21, 0], title: 'My student is working and studying. How can I help?', text: 'Offer small time-savers like meals or rides, and encourage rest. Ask whether their schedule feels manageable, and point them to advising if it does not.' },
    { ago: [20, 0], title: 'What is this community for?', text: 'WeGo is a place for families, friends, and mentors of Cal State LA students to share tips, ask questions, and find events. Be kind, protect privacy, and reach out to an admin if something worries you.' },
    { ago: [20, 0], title: 'Who can join the community?', text: 'Parents, guardians, siblings, partners, friends, and mentors are all welcome. Everyone supports a student in their own way.' },
    { ago: [19, 0], title: 'Do I need an account to reply?', text: 'You can read public conversations without an account, but replying, liking, and sending messages need one. Signed-out visitors see a sign-in button where the reply box would be.' },
    { ago: [19, 0], title: 'What is a private conversation?', text: 'The person who posts can make a conversation private. Signed-out visitors see only its title and are asked to sign in to read the rest. Signed-in members can read and reply as usual.' },
    { ago: [18, 0], title: 'Why does a post have both a title and text?', text: 'The title is the headline people see in the list. The text is the full post, which you read after opening it. A good title helps others decide whether they can help.' },
    { ago: [18, 0], title: 'Can I edit or delete what I posted?', text: 'Yes. You can edit your own posts and replies, and delete them. An edited reply shows "edited" next to its time. Admins can remove content that breaks the guidelines.' },
    { ago: [17, 0], title: 'How do I add a picture to a post or reply?', text: 'Choose Upload image, or paste a copied picture with Ctrl+V. A reply can be only a picture. You can also add or replace a post\'s picture while editing it.' },
    { ago: [17, 0], title: 'How do I reply to someone\'s reply?', text: 'Tap Reply on it. The reply bar at the bottom shows who you are answering. Long conversations can be folded away with the minus button next to a name.' },
    { ago: [16, 0], title: 'What do the heart counts mean?', text: 'A heart is a like. Each person can like a post or a reply once, and tapping again takes the like back.' },
    { ago: [16, 0], title: 'How do I create an event?', text: 'Open the Events tab and choose to create one. Add a title, date, time, and a picture, or upload a flyer to fill in the details. If a flyer has a date without a year, this year is used.' },
    { ago: [15, 0], title: 'How do I change my alias or interests?', text: 'Open Profile from your account menu. You can choose a public alias, your relationship to a student, and the interests that fit you.' },
    { ago: [15, 0], title: 'How do private messages work?', text: 'Open Messages from your account menu to chat privately with another member. Only the two of you can see the conversation. You can block someone, or report a message to the admins, at any time.' },
    { ago: [14, 0], title: 'How do I block someone?', text: 'Open the conversation and tap Block at the top. They are not told, you stop seeing their messages as unread, and you can unblock them whenever you like.' },
    { ago: [14, 0], title: 'How do I report a post, reply, or message that worries me?', text: 'For a private message, tap it and choose Report. The admins see only that message and your reason, not the rest of the conversation. For anything urgent or unsafe, contact campus public safety or call 911.' },
    { ago: [13, 0], title: 'Are my private messages really private?', text: 'Only the two people in a conversation can read it, and pictures in messages are only shown to them. Admins see a message only if someone reports it.' },
    { ago: [13, 0], title: 'How can I stay safe sharing in a public community?', text: 'Avoid sharing phone numbers, addresses, or details that identify your student. Use the Messages page for private conversations, and report anything that worries you.' },
    { ago: [12, 0], title: 'What is the difference between General and Questions?', text: 'General holds conversations between members. Questions holds answers written by the community team to things families ask most.' },
    { ago: [12, 0], title: 'How do I volunteer or help at an event?', text: 'Watch the Events tab and the Community tab for volunteer calls, or message an admin. Setup, welcome tables, and snacks are easy ways to start.' },
    { ago: [11, 0], title: 'What should I do if I forgot my password?', text: 'Use the reset password link on the login page and follow the steps. If you are still stuck, send a message to an admin.' },
    { ago: [11, 0], title: 'Who can I contact for help with this site?', text: 'Message an admin from the Messages page, or ask in a post. If something looks wrong, tell us what you saw and when.' },
]

// ------------------------------------------------------- private messages
// Same format as DIRECT_MESSAGES in demoData.mjs. Dean ends up with 7 unread messages, Admin with 2, and
// two blocked conversations. Positions (0, 1, ...) are what EXTRA_DIRECT_REPORTS refers to. Lots more
// background chats between other people are generated (see GENERATED_CONVERSATIONS).
export const EXTRA_DIRECT_MESSAGES = [
    { between: ['Marcus', 'Dean'], messages: [ // 0: a long one, so the conversation scrolls
        { from: 'Marcus', ago: [6, 3], read: true, text: "Hi Dean, thanks for joining. I'm Marcus. I coach students and mentor a few." },
        { from: 'Dean', ago: [6, 2], read: true, text: "Good to meet you, Marcus. What's your best advice for new mentors?" },
        { from: 'Marcus', ago: [6, 1], read: true, text: 'Listen first. Ask what they want help with before offering anything.' },
        { from: 'Dean', ago: [5, 22], read: true, text: 'That makes sense. How often do you check in with your students?' },
        { from: 'Marcus', ago: [5, 20], read: true, text: 'Once a week, short and predictable. Same time, same place. They relax when they know what to expect.' },
        { from: 'Dean', ago: [5, 18], read: true, text: 'I like that. Do you keep notes?' },
        { from: 'Marcus', ago: [5, 16], read: true, text: 'A few lines after each chat: what they were proud of and what they need next.' },
        { from: 'Dean', ago: [3, 4], read: true, text: "I tried the 'proud of this week' question with a mentee. It worked." },
        { from: 'Marcus', ago: [3, 3], read: true, text: "That's great to hear!" },
        { from: 'Dean', ago: [3, 2], read: true, text: "Would you join the listening session I'm hosting?" },
        { from: 'Marcus', ago: [3, 1], read: true, text: 'Absolutely. Send me the date.' },
        { from: 'Dean', ago: [2, 20], read: true, text: "It's on the Events tab. Hope to see you there." },
        { from: 'Marcus', ago: [0, 8], read: false, text: 'Just signed up. Also, a quick favor: could you share the mentor checklist you mentioned?' },
        { from: 'Marcus', ago: [0, 7], read: false, text: 'No rush, whenever you have a minute.' },
    ] },
    { between: ['Lena', 'Dean'], messages: [ // 1
        { from: 'Lena', ago: [4, 6], read: true, text: 'Welcome, Dean! I saw your post about sayings that stuck. Loved it.' },
        { from: 'Dean', ago: [4, 5], read: true, text: 'Thank you, Lena. Yours was my favorite.' },
        { from: 'Lena', ago: [4, 4], read: true, text: "I'm running the Wellness Walk this week. Would you like to join?" },
        { from: 'Dean', ago: [4, 3], read: true, text: "I'd love to. What should I bring?" },
        { from: 'Lena', ago: [4, 2], read: true, text: 'Comfortable shoes and water. We walk slowly and talk.' },
        { from: 'Dean', ago: [4, 1], read: true, text: 'Perfect. Count me in.' },
        { from: 'Lena', ago: [0, 5], read: false, text: 'Reminder: the Wellness Walk is Saturday morning at 8.' },
        { from: 'Lena', ago: [0, 4], read: false, text: "I'll save you a spot at the front." },
    ] },
    { between: ['Mei', 'Dean'], messages: [ // 2
        { from: 'Mei', ago: [7, 6], read: true, text: "Hello Dean. I'm Mei, a grandmother. I hope you don't mind me writing." },
        { from: 'Dean', ago: [7, 5], read: true, text: "Not at all, Mei. It's lovely to hear from you." },
        { from: 'Mei', ago: [7, 4], read: true, photo: 'sunday-dinner.jpg', text: 'Here is a photo from our Sunday dinner. My grandson joins by video call from campus.' },
        { from: 'Dean', ago: [7, 3], read: true, text: 'That looks like a wonderful tradition.' },
        { from: 'Mei', ago: [7, 2], read: true, text: "Thank you for reading an old woman's messages." },
    ] },
    { between: ['Fatima', 'Dean'], messages: [ // 3
        { from: 'Fatima', ago: [10, 5], read: true, text: 'Dean, thanks for listening to our mentors. Do you have time to hear about the first-gen circle?' },
        { from: 'Dean', ago: [10, 4], read: true, text: 'Yes, please tell me more.' },
        { from: 'Fatima', ago: [10, 3], read: true, text: "It's a monthly circle where families share what they've learned. Parents say it is the best part of their month." },
        { from: 'Dean', ago: [10, 2], read: true, text: "That's exactly the kind of program I want to hear about." },
    ] },
    { between: ['Priya', 'Dean'], messages: [ // 4
        { from: 'Priya', ago: [12, 7], read: true, text: 'Hi Dean, I posted about housing earlier. Any luck with resources?' },
        { from: 'Dean', ago: [12, 6], read: true, text: "I'll look into it and share what I find with you." },
        { from: 'Priya', ago: [12, 5], read: true, text: 'Thank you, I really appreciate it.' },
    ] },
    { between: ['Victor', 'Dean'], messages: [ // 5: unwanted messages (blocked by Dean, and reported)
        { from: 'Victor', ago: [1, 10], read: false, text: 'Hi Dean! I run a tutoring service for students. 50 percent off this week only.' },
        { from: 'Dean', ago: [1, 9], read: true, text: "Thanks, but I'm not interested." },
        { from: 'Victor', ago: [1, 8], read: false, text: "Come on, it's a great deal! Just look at my website." },
        { from: 'Victor', ago: [1, 7], read: false, text: 'Please reconsider, the offer ends tonight!' },
    ] },
    { between: ['Bianca', 'Dean'], messages: [ // 6
        { from: 'Bianca', ago: [5, 6], read: true, text: "Hello Dean. As an advisor I'm happy to speak at your listening session." },
        { from: 'Dean', ago: [5, 5], read: true, text: 'Thank you, Bianca. That would be wonderful.' },
        { from: 'Bianca', ago: [5, 4], read: true, text: "Families often ask about registration. I'll bring a one-page guide." },
        { from: 'Dean', ago: [5, 3], read: true, text: 'Perfect. See you there.' },
    ] },
    { between: ['Lena', 'Admin'], messages: [ // 7
        { from: 'Admin', ago: [8, 4], read: true, text: 'Hi Lena, thanks for helping keep this community kind by reporting issues so quickly.' },
        { from: 'Lena', ago: [8, 3], read: true, text: 'Of course. Anything I can do to keep it kind here.' },
        { from: 'Admin', ago: [8, 2], read: true, text: 'Appreciate you.' },
    ] },
    { between: ['Rosa', 'Admin'], messages: [ // 8: two unread for the Admin account
        { from: 'Rosa', ago: [1, 6], read: false, text: 'Hi Admin, how do I change the picture on my post?' },
        { from: 'Rosa', ago: [1, 5], read: false, text: 'Never mind, I found the Edit button!' },
    ] },
    { between: ['Marcus', 'Admin'], messages: [ // 9
        { from: 'Marcus', ago: [3, 5], read: true, text: 'Is there a way to nominate someone for a volunteer award?' },
        { from: 'Admin', ago: [3, 4], read: true, text: "Great idea. I'll raise it with the team." },
    ] },
    { between: ['Raj', 'Lena'], messages: [ // 10: an advertisement (reported by Lena, who also blocked Raj)
        { from: 'Raj', ago: [3, 8], read: true, text: 'Hi Lena!' },
        { from: 'Raj', ago: [3, 7], read: true, photo: 'transit-pass.jpg', text: 'Check out my rideshare discount for students.' },
        { from: 'Lena', ago: [3, 6], read: true, text: "I'm not interested, please stop." },
    ] },
    { between: ['Hector', 'Keiko'], messages: [ // 11: a request for money (reported by Keiko; resolved by an admin)
        { from: 'Hector', ago: [2, 9], read: true, text: 'Keiko, want to buy a used laptop? Super cheap, send money first.' },
        { from: 'Keiko', ago: [2, 8], read: true, text: 'No thank you.' },
        { from: 'Hector', ago: [2, 7], read: true, text: 'Last chance!' },
    ] },
    { between: ['Xavier', 'Gina'], messages: [ // 12: a scam (reported by Gina, who also blocked Xavier)
        { from: 'Xavier', ago: [4, 3], read: true, text: 'Hi Gina! I can get you free concert tickets. Just send me your phone number and card number.' },
        { from: 'Gina', ago: [4, 2], read: true, text: 'No thanks.' },
        { from: 'Xavier', ago: [4, 1], read: true, text: 'Last chance, the tickets are going fast!' },
    ] },
    { between: ['Quinn', 'Noah'], messages: [ // 13: spam (reported by Noah; resolved; Noah blocked Quinn)
        { from: 'Quinn', ago: [6, 5], read: true, text: 'Click this link to claim your free prize: totally-real-prize.example' },
        { from: 'Noah', ago: [6, 4], read: true, text: 'This looks like spam.' },
    ] },
]

// Messages reported to the admins (conversation = position in EXTRA_DIRECT_MESSAGES, message = position in
// that conversation). resolved: true shows up under "Show resolved" on the Message reports page.
export const EXTRA_DIRECT_REPORTS = [
    { conversation: 5, message: 0, reporter: 'Dean', reason: 'Unwanted sales messages after I said no.' },
    { conversation: 10, message: 1, reporter: 'Lena', reason: 'An advertisement, not a conversation.' },
    { conversation: 11, message: 0, reporter: 'Keiko', reason: 'Asked me to send money for a laptop.', resolved: true },
    { conversation: 12, message: 0, reporter: 'Gina', reason: 'Asked for my phone and card numbers.' },
    { conversation: 13, message: 0, reporter: 'Noah', reason: 'A spam link.', resolved: true },
]

// Who blocked whom. A blocked conversation shows "Blocked" in the list, and the blocker's unread count
// leaves that person out.
export const DIRECT_BLOCKS = [
    { blocker: 'Dean', blocked: 'Victor' },
    { blocker: 'Rosa', blocked: 'Tom' },
    { blocker: 'Lena', blocked: 'Raj' },
    { blocker: 'Gina', blocked: 'Xavier' },
    { blocker: 'Noah', blocked: 'Quinn' },
]

// How many short background chats between other people to generate (from DM_POOL).
export const GENERATED_CONVERSATIONS = 44

// ---------------------------------------------------- lines for generated content
export const REPLY_POOL = [
    'Thank you for sharing this. It helped me think about our own situation.',
    'We went through something very similar. It does get easier.',
    'Saving this thread to come back to.',
    'This is such a good reminder.',
    'Sending you and your family good thoughts.',
    'I tried something like this last month and it really worked.',
    'Appreciate you posting this. It makes the group feel like a real community.',
    'Same here. You are definitely not alone.',
    "What a thoughtful idea. I'm going to try it this week.",
    'Thank you for being so open about this.',
    'This made my day.',
    'I wish I had read this when my student first started.',
    'Great point. Small steps add up.',
    "Following along. I'd love to hear how it goes.",
    'Our family is in the same boat, so this is very helpful.',
    'Well said.',
    'Thanks for the practical tips.',
    'Love the positivity here.',
    'This is exactly the kind of advice I was hoping to find.',
    "Gentle reminder that we're all learning together.",
    'Great question. I was wondering the same thing.',
    'Sharing this with my family tonight.',
    'It really does help to hear from other families.',
    'Thank you all, this thread is a gem.',
    'Patience goes a long way, in my experience.',
    "I'd add: check in, but keep it low pressure.",
    'So glad I found this group.',
    "That's a really kind way to put it.",
    'Cheering for your student!',
    'Bookmarked. Thank you!',
]

export const EVENT_REPLY_POOL = [
    'Is there parking nearby?',
    'Can I bring a friend or family member?',
    'Thank you for organizing this!',
    "Will there be a recording for people who can't attend?",
    "I'll be there. See you all soon!",
    'Is this open to siblings too?',
    'Looking forward to it.',
    'Do I need to sign up ahead of time?',
    'Will light refreshments be provided?',
    'This is exactly what our family needed.',
    "Can't wait to meet everyone.",
    'What time does it end?',
    "I'll bring my daughter.",
    'Thanks for including families!',
    'Count me in.',
    'Any chance there will be a virtual option?',
    'My son is nervous about going. Any tips?',
    'Great idea for an event.',
    'Is the building easy to get to by bus?',
    'Saving the date!',
]

export const DM_POOL = [
    'Hey, how are you doing today?',
    'Doing well, thanks! Just finished work.',
    'Did you see the new event that was posted?',
    "Yes! I'm thinking of going.",
    'That sounds great.',
    'Let me know how it goes.',
    'Thanks for the tip earlier.',
    'Happy to help.',
    'Talk soon!',
    'Sounds good, see you then.',
    "I'll send you the link.",
    'Thank you, that helps a lot.',
    'No problem at all.',
    'How did the exam go?',
    'Better than I feared!',
    "That's wonderful news.",
    'Congratulations!',
    'I was thinking about what you said.',
    "I'm glad you shared that.",
    "Let's catch up this weekend.",
    "I'll bring snacks.",
    'Perfect.',
    'Are you free Thursday evening?',
    'Thursday works for me.',
    "I'll check my calendar.",
    "Great, it's a plan.",
    "Sorry for the late reply, it's been a busy week.",
    "No worries, I understand.",
    'Take care of yourself.',
    'You too!',
    'That made me laugh.',
    'I appreciate you.',
    'Let me know if you need anything.',
    'Will do. Thanks again.',
]