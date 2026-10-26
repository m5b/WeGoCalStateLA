// Fake content for the demo database (see seedDemo.mjs). Everything here is
// invented, so edit or add to it freely -- then run the seed again.
//
//  user:  a username from USERS, 'team' for the community team account, or
//         null for an anonymous post/reply.
//  ago:   [days, hours] before today. Replies must be later than their post
//         (a smaller number), so they read in order.
//  photo: a file name in server/demo/images (shown only when the post/reply
//         photo columns exist in the database).

// ------------------------------------------------------------------ people
// relationship / interests use the same options as the profile page.
export const USERS = [
    { username: 'demo_admin', alias: 'Demo Admin', relationship: 'Other', interests: 'Campus events', isAdmin: true },
    { username: 'demo_rosa', alias: 'Eagle Mom Rosa', relationship: 'Parent', interests: 'Family resources, Financial aid info, Housing resources' },
    { username: 'demo_david', alias: 'Commuter Dad', relationship: 'Parent', interests: 'Financial aid info, Academic support' },
    { username: 'demo_keiko', alias: 'Proud Mom Keiko', relationship: 'Parent', interests: 'Campus events, Family resources, Social activities' },
    { username: 'demo_tom', alias: 'Weekend Dad Tom', relationship: 'Parent', interests: 'Family resources, Mental health support' },
    { username: 'demo_yusuf', alias: 'Dad Yusuf', relationship: 'Parent', interests: 'Academic support, Campus events' },
    { username: 'demo_mei', alias: 'Grandma Mei', relationship: 'Guardian', interests: 'Family resources, Campus events' },
    { username: 'demo_carmen', alias: 'Abuela Carmen', relationship: 'Guardian', interests: 'Family resources, Academic support' },
    { username: 'demo_aaliyah', alias: 'Big Sis A', relationship: 'Sibling', interests: 'Mental health support, Social activities' },
    { username: 'demo_nora', alias: 'Nora (Older Sister)', relationship: 'Sibling', interests: 'Social activities, Mental health support' },
    { username: 'demo_priya', alias: 'Auntie Priya', relationship: 'Other', interests: 'Housing resources, Family resources' },
    { username: 'demo_javier', alias: 'Tio Javier', relationship: 'Other', interests: 'Campus events, Social activities' },
    { username: 'demo_hector', alias: 'Uncle Hector', relationship: 'Other', interests: 'Financial aid info, Academic support' },
    { username: 'demo_gloria', alias: 'Tia Gloria', relationship: 'Other', interests: 'Family resources, Campus events' },
    { username: 'demo_sam', alias: 'Study Buddy Sam', relationship: 'Friend', interests: 'Academic support, Social activities' },
    { username: 'demo_ben', alias: 'Roommate Ben', relationship: 'Friend', interests: 'Mental health support, Housing resources' },
    { username: 'demo_marcus', alias: 'Coach Marcus', relationship: 'Supporter / Mentor', interests: 'Academic support, Community volunteering' },
    { username: 'demo_lena', alias: 'Mentor Lena', relationship: 'Supporter / Mentor', interests: 'Mental health support, Academic support, Community volunteering' },
    { username: 'demo_fatima', alias: 'Mentor Fatima', relationship: 'Supporter / Mentor', interests: 'Academic support, Campus events, Community volunteering' },
    { username: 'demo_darnell', alias: 'Community Mentor Darnell', relationship: 'Supporter / Mentor', interests: 'Community volunteering, Academic support' },
]

// --------------------------------------------------------- community posts
export const POSTS = [
    {
        user: 'demo_rosa', ago: [33, 5],
        text: "My daughter just started at Cal State LA and she is commuting from home. How do you check in without hovering? I want her to know I'm here, but I don't want to smother her.",
        replies: [
            { user: 'demo_david', ago: [32, 20], text: "We settled on one no-pressure text a day and a longer call on Sundays. If she doesn't reply right away, that's okay. She knows the door is open." },
            { user: 'demo_mei', ago: [32, 8], text: "Cook her favorite dinner and let her talk when she's ready. Sometimes food does more than questions." },
            { user: null, ago: [31, 15], text: 'Same situation here. The Sunday call idea is great, thank you.' },
            { user: 'demo_keiko', ago: [31, 2], text: 'We ask about the "best and hardest part" of the day. It keeps the conversation light but real.' },
        ],
    },
    {
        user: 'demo_david', ago: [31, 4],
        text: "Does anyone know how financial aid deadlines work for the spring semester? I'm trying to help my son stay on track without nagging him every week.",
        replies: [
            { user: 'demo_marcus', ago: [30, 21], text: 'Put the deadlines on a shared calendar and let him own the reminders. A quick call to the financial aid office to ask for a checklist helped us a lot.' },
            { user: 'demo_rosa', ago: [30, 9], text: 'Also ask whether your student has accepted all of the aid offered. We almost missed that step.' },
            { user: 'demo_fatima', ago: [29, 18], text: 'The Financial Aid Basics night in the Events tab is a good place to ask questions with other families.' },
        ],
    },
    {
        user: 'demo_mei', ago: [29, 7],
        text: 'Our grandson is the first in our family to go to college. We are so proud, but we do not know what questions to ask. Any advice for first-generation families?',
        replies: [
            { user: 'demo_lena', ago: [28, 22], text: "Try open questions like 'What was the best part of your week?' and 'Is there anything we can help you figure out?' You don't need to know the answers. Being curious is support." },
            { user: 'demo_javier', ago: [28, 10], text: 'We went through this with my niece. Celebrate small wins. Every class passed is a big deal.' },
            { user: 'demo_aaliyah', ago: [27, 23], text: "As a sibling, I'd add: tell them you're proud out loud. It matters more than you think." },
            { user: 'demo_carmen', ago: [27, 12], text: 'Thank you for asking this, Mei. Our family is in the same place and it helps to know we are not alone.' },
        ],
    },
    {
        user: 'demo_aaliyah', ago: [27, 3], photo: 'care-package.jpg',
        text: 'My little brother is stressed about midterms. I put together a small care package with snacks and a handwritten note. What small things helped your student feel supported?',
        replies: [
            { user: 'demo_rosa', ago: [26, 20], text: 'A handwritten note is perfect. My daughter keeps every one in her desk.' },
            { user: 'demo_sam', ago: [26, 7], text: "From a friend's side: a study playlist helps. Silly, but it works." },
            { user: 'demo_hector', ago: [25, 19], text: 'I send a gift card for a coffee near campus. It gives him a reason to take a real break.' },
        ],
    },
    {
        user: 'demo_marcus', ago: [25, 6],
        text: "Mentor tip: instead of asking only about grades, ask your student to tell you one thing they're proud of this week. It changes the whole conversation.",
        replies: [
            { user: 'demo_david', ago: [24, 22], text: 'We tried this at dinner on Friday and my son talked for twenty minutes.' },
            { user: 'demo_lena', ago: [24, 12], text: 'Love this. Pride questions open doors that grade questions close.' },
            { user: 'demo_nora', ago: [24, 3], text: "Trying it on my little sister tonight. I'll report back!" },
        ],
    },
    {
        user: 'demo_priya', ago: [24, 4],
        text: 'Housing is so expensive in LA. Has anyone found safe and affordable ways to help a student with rent or roommates?',
        replies: [
            { user: 'demo_javier', ago: [23, 19], text: 'We looked at sharing a place with two classmates our nephew already knew, and we met the landlord together first.' },
            { user: null, ago: [23, 8], text: 'Please check any listing carefully and never send a deposit before seeing the place in person.' },
            { user: 'demo_marcus', ago: [22, 23], text: 'Campus housing offices and student groups sometimes share vetted roommate boards. Worth asking.' },
            { user: 'demo_yusuf', ago: [22, 14], text: 'We also asked the landlord for the lease in writing and read it together before signing anything.' },
        ],
    },
    {
        user: 'demo_javier', ago: [22, 7], photo: 'finals-snacks.jpg',
        text: 'Finals week is coming. What are your best ways to send encouragement from far away? Care packages? Voice notes?',
        replies: [
            { user: 'demo_mei', ago: [21, 21], text: 'Voice notes! My grandson plays my message before every exam.' },
            { user: 'demo_sam', ago: [21, 10], text: 'Honestly, even a funny meme helps.' },
            { user: 'demo_carmen', ago: [20, 22], text: 'I send a short prayer and a photo of the family dog. It makes him smile every time.' },
        ],
    },
    {
        user: 'demo_sam', ago: [21, 3], photo: 'study-corner.jpg',
        text: "Study group tip from a student's friend: pick one fixed time each week and stick to it. It's easier to show up when it's already on the calendar.",
        replies: [
            { user: 'demo_lena', ago: [20, 20], text: 'Yes! Consistency beats cramming every time.' },
            { user: 'demo_sam', ago: [20, 8], photo: 'study-group-table.jpg', text: "Here's our usual table. Same spot, same time, snacks required." },
        ],
    },
    {
        user: 'demo_lena', ago: [20, 5],
        text: 'If your student seems overwhelmed, campus counseling and wellness services can be a good first step. How did you bring it up gently, without making them feel like something is wrong?',
        replies: [
            { user: 'demo_rosa', ago: [19, 22], text: "I told her it's like having a coach for your mind. It's not a sign of weakness." },
            { user: 'demo_david', ago: [19, 11], text: 'We offered to sit with him while he looked up the options online.' },
            { user: null, ago: [19, 2], text: 'Thank you for asking this. I needed to read it today.' },
            { user: 'demo_fatima', ago: [18, 15], text: 'Framing it as "extra support for a hard semester" worked for the students I mentor.' },
        ],
    },
    {
        user: null, ago: [19, 1],
        text: "My son doesn't tell us when he is struggling. How do we create a safe space for him to talk without pushing?",
        replies: [
            { user: 'demo_lena', ago: [18, 21], text: 'Try talking side by side while driving, walking, or cooking instead of face to face. It feels less intense.' },
            { user: 'demo_marcus', ago: [18, 9], text: "Share a small struggle of your own first. It shows him it's safe." },
            { user: 'demo_mei', ago: [17, 22], text: 'Be patient. He knows you are there.' },
            { user: 'demo_tom', ago: [17, 10], text: 'What helped us was never reacting with panic when he did open up. Calm gets you more conversations.' },
        ],
    },
    {
        user: 'demo_keiko', ago: [17, 6], photo: 'move-in-day.jpg',
        text: "We helped our son move into the dorms today. I tried not to cry in the parking lot. Any tips for the first couple of weeks?",
        replies: [
            { user: 'demo_rosa', ago: [16, 22], text: 'Give it a few days before the first big check-in call. They need time to find their rhythm.' },
            { user: 'demo_carmen', ago: [16, 12], text: 'Congratulations, Keiko! The crying in the parking lot is a rite of passage.' },
            { user: 'demo_david', ago: [16, 3], text: 'Send a care package at the end of week one. It lands at just the right time.' },
            { user: 'demo_lena', ago: [15, 18], text: "It's okay to feel it. Proud and sad can both be true." },
        ],
    },
    {
        user: 'demo_tom', ago: [16, 3],
        text: 'I live about two hours away and only see my daughter on weekends. How do I stay connected between visits without it feeling forced?',
        replies: [
            { user: 'demo_nora', ago: [15, 20], text: 'Shared playlists and a shared photo album kept me close to my sister. Small stuff counts.' },
            { user: 'demo_marcus', ago: [15, 8], text: 'Pick one thing you do together every week, like a Wednesday text about a show you both watch.' },
            { user: 'demo_rosa', ago: [14, 21], text: 'Weekend visits mean a lot even when she acts like she is too busy. Keep showing up.' },
        ],
    },
    {
        user: 'demo_carmen', ago: [15, 8],
        text: 'Our family speaks mostly Spanish at home. How can we help with school things when the forms and emails are all in English?',
        replies: [
            { user: 'demo_lena', ago: [14, 22], text: "Ask your student to walk you through one form at a time. Teaching it back helps them too. And many campus offices can explain things or find language help if you ask." },
            { user: 'demo_fatima', ago: [14, 10], text: 'We host a First-Gen Families Circle in the Events tab. Questions like this are exactly what it is for.' },
            { user: 'demo_javier', ago: [13, 23], text: 'We use a translation app together and double-check anything important with a person.' },
            { user: 'demo_priya', ago: [13, 9], text: 'You are doing great by asking. Your support matters more than perfect English.' },
        ],
    },
    {
        user: 'demo_hector', ago: [14, 5],
        text: 'My nephew works part time and studies full time. How do you help a student balance work and school without adding pressure?',
        replies: [
            { user: 'demo_david', ago: [13, 21], text: 'We sat down together and mapped out his week on one page. Seeing it laid out helped him say no to extra shifts.' },
            { user: 'demo_sam', ago: [13, 8], text: "As a student: it helps when family asks 'what do you need this week?' instead of 'why are you so tired?'" },
            { user: 'demo_marcus', ago: [12, 20], text: 'Also look into work-study or on-campus jobs. They tend to be more flexible around classes.' },
        ],
    },
    {
        user: 'demo_nora', ago: [13, 2],
        text: 'My younger sister is a freshman and gets really homesick on Sunday nights. Any ideas for a small routine we can do together?',
        replies: [
            { user: 'demo_aaliyah', ago: [12, 20], text: 'We do a Sunday night video call while we each do something else, like laundry or homework. No pressure to talk.' },
            { user: 'demo_mei', ago: [12, 9], text: 'A pot of her favorite soup on the phone screen, ha. But seriously, routine helps.' },
            { user: 'demo_lena', ago: [11, 22], photo: 'handwritten-note.jpg', text: 'I suggest writing a short note she can open each Sunday. Here is one I wrote for a student I mentor.' },
        ],
    },
    {
        user: 'demo_ben', ago: [12, 6],
        text: "Roommate here. My friend says he's fine but he's been skipping meals and staying in his room a lot. How can I check in without making it weird?",
        replies: [
            { user: 'demo_lena', ago: [11, 23], text: "You're being a good friend. Try something low-pressure like 'Want to grab food? I'm hungry.' and let him decide how much to share. Encourage him to talk to campus counseling or someone he trusts if this continues." },
            { user: 'demo_fatima', ago: [11, 11], text: "If you're ever worried about his safety right now, call or text 988 (Suicide & Crisis Lifeline) or 911. Otherwise, steady, kind check-ins matter." },
            { user: null, ago: [10, 22], text: 'Thank you for looking out for him. Friends notice things families cannot see.' },
        ],
    },
    {
        user: 'demo_fatima', ago: [11, 4],
        text: "Mentor reminder: it's very common for grades to dip in the first semester. Celebrate the effort, the habits, and the new friendships, not just the GPA.",
        replies: [
            { user: 'demo_rosa', ago: [10, 21], text: 'Needed this today. We were starting to panic over one low quiz.' },
            { user: 'demo_keiko', ago: [10, 9], text: 'Saving this to read to myself in October.' },
            { user: 'demo_darnell', ago: [9, 20], text: 'Well said, Fatima. Habits first, grades follow.' },
        ],
    },
    {
        user: 'demo_darnell', ago: [10, 7],
        text: 'I volunteer as a community mentor. What has helped your students feel excited about internships instead of scared of them?',
        replies: [
            { user: 'demo_sam', ago: [9, 22], text: 'Seeing an alum talk about their first internship made it feel doable.' },
            { user: 'demo_marcus', ago: [9, 10], text: "Start small: one informational chat before any application. It lowers the stakes." },
            { user: 'demo_lena', ago: [8, 21], text: 'The Resume & Interview Prep event looks like a good first step for families too.' },
        ],
    },
    {
        user: 'demo_gloria', ago: [9, 3],
        text: 'Our daughter wants to change majors after one semester. We are worried, but we want to support her. How did you handle this?',
        replies: [
            { user: 'demo_fatima', ago: [8, 20], text: 'Ask her what she loved and what drained her. The pattern usually points the way.' },
            { user: 'demo_david', ago: [8, 8], text: 'Our son switched too. An advisor helped us see how few credits it really cost.' },
            { user: 'demo_rosa', ago: [7, 21], text: 'Switching can be a sign she is getting to know herself. Hang in there.' },
            { user: 'demo_nora', ago: [7, 9], text: 'As a sibling who switched: what mattered most was my family saying "we trust you."' },
        ],
    },
    {
        user: 'demo_yusuf', ago: [8, 5],
        text: 'Has anyone used the Resources section on this site for mental health or study support? What was most useful for your family?',
        replies: [
            { user: 'demo_lena', ago: [7, 22], text: 'The mental health and study support pages are a good place to start. Browse them together with your student.' },
            { user: 'demo_ben', ago: [7, 10], text: 'As a student: it helped to find something I could read privately before talking to anyone.' },
            { user: 'demo_mei', ago: [6, 23], text: 'I printed a few pages so I could read them with my tea.' },
        ],
    },
    {
        user: 'demo_priya', ago: [7, 2],
        text: 'Evening classes mean late commutes. How do you help your student feel safe getting home without making them anxious?',
        replies: [
            { user: 'demo_tom', ago: [6, 20], text: "We agreed on a simple 'heading home' text. No questions, just so someone knows." },
            { user: 'demo_david', ago: [6, 8], text: 'Well-lit routes and walking with classmates. Also a portable phone charger. It sounds small but matters.' },
            { user: 'demo_ben', ago: [5, 21], text: 'Campus often offers safety escort services in the evening. Worth asking about!' },
            { user: 'demo_keiko', ago: [5, 12], text: 'We share locations for the commute only, and my daughter is fine with that.' },
        ],
    },
    {
        user: 'demo_aaliyah', ago: [6, 6], photo: 'sunday-dinner.jpg',
        text: 'Our Sunday dinner tradition: everyone shares one highlight and one challenge from their week. My brother actually opens up now.',
        replies: [
            { user: 'demo_mei', ago: [5, 22], text: 'What a beautiful tradition. We may borrow it.' },
            { user: 'demo_rosa', ago: [5, 10], text: 'Love this. Highlight and challenge, so simple.' },
            { user: 'demo_javier', ago: [4, 23], text: 'We started doing it over video call. It works!' },
        ],
    },
    {
        user: 'demo_marcus', ago: [5, 4], photo: 'cheering-sign.jpg',
        text: "Reminder for every supporter here: you don't have to have all the answers. Listening and showing up is enough.",
        replies: [
            { user: 'demo_lena', ago: [4, 21], text: 'Yes. Presence over perfection.' },
            { user: 'demo_keiko', ago: [4, 8], text: 'I needed this after a rough week. Thank you, Marcus.' },
            { user: null, ago: [3, 19], text: 'Reading this made me tear up a little. Thank you.' },
        ],
    },
    {
        user: 'demo_rosa', ago: [4, 3], photo: 'small-win.jpg',
        text: 'Small win to share: after all your advice on weekly check-ins, my daughter called me first today just to say hi. Thank you all.',
        replies: [
            { user: 'demo_david', ago: [3, 20], text: "That's wonderful!" },
            { user: 'demo_mei', ago: [3, 14], text: 'So happy for you!' },
            { user: 'demo_aaliyah', ago: [3, 6], text: 'Love this so much.' },
        ],
    },
    {
        user: 'demo_david', ago: [3, 5], photo: 'transit-pass.jpg',
        text: 'Commuting costs add up fast. Is anyone carpooling or using transit passes? Looking for ideas to help my son save money.',
        replies: [
            { user: 'demo_priya', ago: [2, 20], text: 'We looked at monthly transit passes and it helped a lot.' },
            { user: 'demo_sam', ago: [2, 9], text: 'Carpooling with classmates works if you line up class schedules early.' },
            { user: 'demo_hector', ago: [1, 22], text: 'Ask whether there are student discounts on passes. Many transit agencies offer them.' },
        ],
    },
    {
        user: 'demo_lena', ago: [2, 4], photo: 'wellness-walk.jpg',
        text: "Supporters need support too. What do you do to recharge when you've been worrying about your student?",
        replies: [
            { user: 'demo_mei', ago: [1, 21], text: 'A slow morning walk and a cup of tea. No phone.' },
            { user: 'demo_tom', ago: [1, 10], text: 'I started running on weekends. Helps me think.' },
            { user: 'demo_gloria', ago: [0, 22], text: 'Calling a friend who also has a student in college. We just laugh and vent.' },
        ],
    },
    {
        user: 'demo_mei', ago: [1, 22],
        text: 'Thank you to everyone in this group. I read these posts every morning with my tea. I feel less alone in this new chapter.',
        replies: [
            { user: 'demo_rosa', ago: [1, 12], text: 'We feel the same, Mei. You always bring such kindness here.' },
            { user: 'demo_carmen', ago: [1, 4], text: 'Gracias, Mei. This group is a gift.' },
            { user: null, ago: [0, 18], text: 'Same here. This is the first place I feel I can ask without judgment.' },
        ],
    },
    {
        user: 'demo_keiko', ago: [1, 5], photo: 'first-day-on-campus.jpg',
        text: "Week one update: my son sent me a photo from campus and he looks happy. I'm cautiously proud. How did your first weeks go?",
        replies: [
            { user: 'demo_rosa', ago: [0, 23], text: 'That is wonderful, Keiko! Savor it.' },
            { user: 'demo_yusuf', ago: [0, 15], text: 'Ours called twice in week one and then stopped. We decided it was a good sign.' },
        ],
    },
    {
        user: 'demo_rosa', ago: [0, 20], photo: 'graduation-cap.jpg',
        text: "I know it's early, but I'm already thinking about graduation. Any tips for planning ahead as a family?",
        replies: [
            { user: 'demo_gloria', ago: [0, 14], text: 'Start a small savings jar for the celebration. Everyone adds a little.' },
            { user: 'demo_fatima', ago: [0, 8], text: 'The Graduation Planning for Families event in the Events tab will cover this.' },
        ],
    },
    {
        user: null, ago: [0, 9],
        text: "Money is tight at home and I feel guilty asking my son to help with things. How do other families handle that honestly?",
        replies: [
            { user: 'demo_lena', ago: [0, 7], text: "You're not alone. Many families talk about it openly: what the family needs, what school needs, and where there is room. Honesty usually brings students closer." },
            { user: 'demo_carmen', ago: [0, 5], text: 'We sat down together and made a plan. It turned into one of our best conversations.' },
            { user: 'demo_marcus', ago: [0, 3], text: 'Also ask about emergency help programs and food resources on campus. Many students use them.' },
        ],
    },
    {
        user: 'demo_david', ago: [0, 3], photo: 'coffee-chat.jpg',
        text: 'Coffee after class with my son turned into a really good talk today. Sometimes the best conversations are the unplanned ones.',
        replies: [
            { user: 'demo_ben', ago: [0, 2], text: 'This is the kind of thing students remember!' },
            { user: 'demo_rosa', ago: [0, 1], text: 'Yes! Save the coffee budget for these moments.' },
        ],
    },
]

// ------------------------------------------------------------------- events
// organizer: a username, or 'team'. The seed also makes each event's linked
// community post (category "events"), just like creating one in the app.
export const EVENTS = [
    {
        organizer: 'team', inDays: 3, hour: 18, minute: 0, photo: 'family-welcome-night.jpg',
        title: 'Family Welcome Night: Meet Other Support Partners',
        description: "An evening for parents, guardians, siblings, and mentors to meet each other, ask questions, and learn how to support your student's first year.",
        replies: [
            { user: 'demo_rosa', ago: [1, 4], text: "Will there be time to meet other parents? I'm a little nervous about coming." },
            { user: 'team', ago: [1, 1], text: 'Yes! There will be plenty of time to chat and ask questions. Everyone is welcome.' },
            { user: 'demo_keiko', ago: [0, 14], text: "I'll be there with my husband. Looking forward to meeting everyone!" },
        ],
    },
    {
        organizer: 'team', inDays: 5, hour: 17, minute: 30, photo: 'financial-aid-basics.jpg',
        title: 'Financial Aid Basics for Families',
        description: 'A friendly walk-through of deadlines, forms, and questions families often ask about paying for college.',
        replies: [
            { user: 'demo_david', ago: [2, 5], text: 'Signed up. Thank you for organizing this.' },
            { user: null, ago: [1, 13], text: 'Will there be a recording for families who cannot attend live?' },
            { user: 'team', ago: [1, 2], text: "We'll share notes in this thread afterward." },
        ],
    },
    {
        organizer: 'team', inDays: 8, hour: 11, minute: 0, photo: 'wellness-fair.jpg',
        title: 'Wellness Fair: Resources for Student Well-Being',
        description: 'Learn about wellness, counseling, and healthy-habit resources, and how families can encourage students to use them.',
        replies: [
            { user: 'demo_lena', ago: [2, 3], text: "I'll be there and happy to chat with families about what support can look like." },
            { user: 'demo_sam', ago: [1, 9], text: 'Bringing a few friends from my study group.' },
        ],
    },
    {
        organizer: 'demo_marcus', inDays: 10, hour: 16, minute: 0, photo: 'study-skills-workshop.jpg',
        title: 'Study Skills Workshop for Students and Supporters',
        description: 'Practical routines for planning the week, taking notes, and preparing for exams, plus ways supporters can help without hovering.',
        replies: [
            { user: 'demo_aaliyah', ago: [2, 10], text: "I'm bringing my brother. He needs this before midterms!" },
            { user: 'demo_marcus', ago: [1, 20], text: 'Great, see you both there.' },
        ],
    },
    {
        organizer: 'demo_rosa', inDays: 14, hour: 8, minute: 30, photo: 'commuter-coffee.jpg',
        title: 'Commuter Families Coffee Hour',
        description: 'Start the morning with coffee and swap tips with other families whose students commute: parking, transit, and balancing family time.',
        replies: [
            { user: 'demo_david', ago: [1, 18], text: 'Count me in. I have a lot of commuting questions.' },
            { user: 'demo_priya', ago: [1, 5], text: 'Will there be tea too?' },
            { user: 'demo_rosa', ago: [0, 20], text: 'Yes, Priya. Tea and pastries for everyone.' },
        ],
    },
    {
        organizer: 'demo_fatima', inDays: 18, hour: 18, minute: 30, photo: 'first-gen-families-circle.jpg',
        title: 'First-Gen Families Circle',
        description: 'A welcoming space for families of first-generation students to share questions, wins, and encouragement. Bring your questions and your experience.',
        replies: [
            { user: 'demo_carmen', ago: [1, 10], text: 'We will come. Is it okay if we bring our own food to share?' },
            { user: 'demo_fatima', ago: [1, 3], text: 'Please do, Carmen. Food and stories are the best part.' },
            { user: 'demo_mei', ago: [0, 12], text: 'Count my husband and me in.' },
        ],
    },
    {
        organizer: 'demo_lena', inDays: 22, hour: 18, minute: 30, photo: 'mentor-meetup.jpg',
        title: 'Mentor Meetup: Guiding Students Through Midterms',
        description: 'An open conversation for mentors, relatives, and family friends about encouraging students during stressful weeks.',
        replies: [{ user: 'demo_marcus', ago: [1, 12], text: "I'll be there. Looking forward to trading ideas." }],
    },
    {
        organizer: 'team', inDays: 26, hour: 10, minute: 0, photo: 'resource-fair.jpg',
        title: 'Campus Resource Fair for Families',
        description: 'Meet representatives from campus support services and community organizations, and pick up information to share with your student.',
        replies: [
            { user: 'demo_yusuf', ago: [0, 16], text: 'This will be a great way to learn what exists.' },
            { user: 'demo_gloria', ago: [0, 8], text: 'Is it okay to bring more than one family member?' },
            { user: 'team', ago: [0, 3], text: 'Absolutely, bring as many supporters as you like.' },
        ],
    },
    {
        organizer: 'demo_darnell', inDays: 34, hour: 17, minute: 30, photo: 'resume-interview-prep.jpg',
        title: 'Resume and Interview Prep: A Night for Students and Their Supporters',
        description: 'Practice interview questions, review resumes, and learn how family members can help students feel prepared and confident.',
        replies: [
            { user: 'demo_sam', ago: [0, 15], text: "I'll bring my resume. Can't wait for feedback." },
            { user: 'demo_darnell', ago: [0, 6], text: 'Please do, Sam. See you there!' },
        ],
    },
    {
        organizer: 'team', inDays: 39, hour: 17, minute: 0, photo: 'career-prep-night.jpg',
        title: 'Career Prep Night: How Families Can Help',
        description: 'Learn how families can support resume building, internships, and first-job conversations.',
        replies: [
            { user: 'demo_sam', ago: [0, 14], text: 'Is this open to students too?' },
            { user: 'team', ago: [0, 6], text: 'Absolutely. Students are welcome.' },
        ],
    },
    {
        organizer: 'team', inDays: 45, hour: 14, minute: 0, photo: 'finals-study-jam.jpg',
        title: 'Finals Study Jam with Snacks',
        description: 'A relaxed group study session with snacks and quiet focus. Supporters are welcome to help set up and cheer everyone on.',
        replies: [
            { user: 'demo_aaliyah', ago: [0, 11], text: 'I can bring snacks for the table!' },
            { user: 'demo_ben', ago: [0, 4], text: 'Great idea. Signing up with my roommate.' },
        ],
    },
    {
        organizer: 'demo_lena', inDays: 50, hour: 12, minute: 0, photo: 'healthy-habits-workshop.jpg',
        title: 'Healthy Habits Workshop: Sleep, Food, and Stress',
        description: 'Simple habits that help students and families stay well during a busy semester, plus a short guided breathing break.',
        replies: [{ user: 'demo_tom', ago: [0, 9], text: 'Can I join virtually if I cannot make it in person?' }, { user: 'demo_lena', ago: [0, 2], text: 'We will share notes afterward for anyone who cannot attend.' }],
    },
    {
        organizer: 'team', inDays: 58, hour: 10, minute: 0, photo: 'family-weekend-brunch.jpg',
        title: 'Family & Friends Weekend Brunch',
        description: 'A relaxed brunch for students and the people who support them. Come celebrate how far everyone has come this semester.',
        replies: [
            { user: 'demo_rosa', ago: [0, 10], text: "Can't wait! Bringing the whole family." },
            { user: 'demo_mei', ago: [0, 4], text: 'I will bake something to share.' },
        ],
    },
    {
        organizer: 'team', inDays: 72, hour: 17, minute: 0, photo: 'graduation-planning.jpg',
        title: 'Graduation Planning for Families',
        description: 'Timelines, tips, and traditions: how families can plan ahead and celebrate this big milestone together.',
        replies: [
            { user: 'demo_rosa', ago: [0, 7], text: 'Signing up early. I want to be ready!' },
            { user: 'demo_gloria', ago: [0, 3], text: 'Will there be tips for families traveling from out of town?' },
        ],
    },
]

// --------------------------------------------------------------------- FAQs
// Posted by the community team. title = the question, text = the answer.
// (The FAQ migration adds three more; these round out the FAQ tab.)
export const FAQS = [
    {
        ago: [28, 0],
        title: 'How can I help my student without taking over?',
        text: "Ask what kind of help they want: advice, a listener, or practical help. Then offer exactly that. Students usually open up more when they feel in charge of their own choices.",
    },
    {
        ago: [27, 0],
        title: "What should I do if I'm worried about my student's mental health?",
        text: "Start with a calm, private conversation and listen without judging. Encourage them to connect with campus counseling or health services. If you believe someone is in immediate danger, call 911, or call or text 988 (Suicide & Crisis Lifeline).",
    },
    {
        ago: [26, 0],
        title: 'How can I stay up to date on deadlines and campus news?',
        text: 'Ask your student to share their academic calendar with you, and check the Events tab here for upcoming workshops and reminders for families.',
    },
    {
        ago: [25, 0],
        title: "Can I see my student's grades or records?",
        text: 'In college, education records generally belong to the student under federal privacy law (FERPA). Students can choose to share access or show you directly, so the easiest path is to ask them.',
    },
    {
        ago: [24, 0],
        title: 'How can I support a first-generation student?',
        text: "You don't need to know the system to help. Ask open questions, celebrate small wins, and connect your student with mentors and campus resources. The First-Gen Families Circle in the Events tab is a good place to meet other families.",
    },
    {
        ago: [23, 0],
        title: 'How do I find mentors or outside support for my student?',
        text: 'Check the Events tab for mentor meetups and workshops, and ask your student about campus programs. Mentors in the Community tab are happy to share what has worked for their students.',
    },
]