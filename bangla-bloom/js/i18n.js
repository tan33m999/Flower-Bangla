// ============================================================
// i18n.js
// Interface language: English or Bangla. The panel, buttons, hints
// and placeholder use these strings. A string with no translation
// shows in English, so a missing entry never breaks the page.
// To add or change a translation, edit the matching line below.
// ============================================================

const I18N = {
  // Top bar and panel header
  'Controls': 'নিয়ন্ত্রণ',
  'Start from a look': 'একটি রূপ বেছে নিন',
  'Show all groups': 'সব গ্রুপ দেখান',
  'Hide all groups': 'সব গ্রুপ লুকান',
  'Recording…': 'রেকর্ড হচ্ছে…',

  // Looks
  'Keep my settings': 'আমার সেটিং রাখুন',
  'Wedding': 'বিয়ে', 'Poster': 'পোস্টার', 'Minimal': 'মিনিমাল', 'Night garden': 'রাতের বাগান',
  'Spring': 'বসন্ত', 'Summer': 'গ্রীষ্ম', 'Autumn': 'শরৎ', 'Winter': 'শীত', 'Monsoon': 'বর্ষা',
  'Rose garden': 'গোলাপ বাগান', 'Festival': 'উৎসব', 'Ink wash': 'কালির আঁচড়',
  'Moonlight': 'চাঁদের আলো', 'Monsoon night': 'বর্ষার রাত',

  // Groups
  'Text': 'লেখা', 'Layout': 'বিন্যাস', 'Flowers': 'ফুল', 'Leaves': 'পাতা',
  'Flower veins (stems)': 'ফুলের শিরা (ডাঁটা)', 'Motion': 'গতি',
  'Background and effects': 'পটভূমি ও প্রভাব', 'Export': 'সংরক্ষণ', 'Save and share': 'সংরক্ষণ ও শেয়ার',

  // Text
  'Font': 'ফন্ট', 'Letter colour': 'অক্ষরের রং', 'Colour gradient on letters': 'অক্ষরে রঙের মিশ্রণ',
  'Gradient end colour': 'মিশ্রণের শেষ রং', 'Gradient direction': 'মিশ্রণের দিক',
  'Left to right': 'বাম থেকে ডানে', 'Top to bottom': 'উপর থেকে নিচে',
  'Letter transparency': 'অক্ষরের স্বচ্ছতা', 'Text size': 'লেখার আকার', 'Curve the text': 'লেখা বাঁকানো',
  'Letters rise in one by one': 'অক্ষর একে একে উঠবে',
  'The Bangla typeface for the letters.': 'অক্ষরের জন্য বাংলা ফন্ট।',
  '0% hides the letters, so only flowers show.': '০% করলে অক্ষর লুকিয়ে যাবে, শুধু ফুল দেখা যাবে।',
  'Bends the line into an arc. Each letter turns to follow it, and the flowers follow too.':
    'লাইনটিকে বৃত্তচাপের মতো বাঁকায়। প্রতিটি অক্ষর ও ফুল সেই বাঁক অনুসরণ করে।',
  'Each letter lifts into place during the bloom.': 'ফুল ফোটার সময় প্রতিটি অক্ষর একটু একটু করে জায়গায় আসে।',
  'Blends from the letter colour to the end colour.': 'অক্ষরের রং থেকে শেষ রঙে মিশে যায়।',

  // Layout
  'Arrangement': 'সাজানো', 'On the letters': 'অক্ষরের উপরে', 'Along the letter outline': 'অক্ষরের রেখা ধরে',
  'Scattered': 'ছড়িয়ে', 'Grid': 'গ্রিড', 'Ring around the text': 'লেখার চারপাশে বৃত্ত',
  'Where the flowers are placed.': 'ফুল কোথায় বসবে।',
  'How many flowers': 'ফুলের সংখ্যা',
  'More flowers means a richer look, but it runs slower.': 'বেশি ফুল মানে ঘন সাজ, তবে ধীর চলবে।',
  'Flower size': 'ফুলের আকার',
  'Shuffle (new random layout)': 'এলোমেলো সাজান (নতুন বিন্যাস)',
  'Keeps your settings and makes a new random arrangement.': 'আপনার সেটিং রেখে নতুন এলোমেলো সাজান।',

  // Flowers
  'Flower type': 'ফুলের ধরন', 'Mixed': 'মিশ্র', 'Peony': 'পিওনি', 'Rose': 'গোলাপ', 'Daisy': 'ডেইজি',
  'Cosmos': 'কসমস', 'Marigold': 'গাঁদা', 'Jasmine': 'বেলি',
  'Colour': 'রং', 'By position (warm left, cool right)': 'অবস্থান অনুযায়ী (বাঁয়ে গরম, ডানে ঠান্ডা)',
  'Pink': 'গোলাপি', 'Red': 'লাল', 'Violet': 'বেগুনি', 'White': 'সাদা', 'Blush': 'হালকা গোলাপি',
  'Flower transparency': 'ফুলের স্বচ্ছতা',
  'Lower values let the letters and background show through.': 'কম করলে অক্ষর ও পটভূমি দেখা যাবে।',
  'Place flowers': 'ফুল কোথায় থাকবে', 'Behind the letters': 'অক্ষরের পেছনে',
  'In front of the letters': 'অক্ষরের সামনে', 'Shadow under flowers': 'ফুলের নিচের ছায়া',

  // Leaves
  'Leaves per flower': 'প্রতি ফুলে পাতা', 'Leaf colour': 'পাতার রং', 'Fresh green': 'সতেজ সবুজ',
  'Deep green': 'গাঢ় সবুজ', 'Light green': 'হালকা সবুজ', 'Autumn olive': 'শরতের জলপাই',
  'Leaf veins': 'পাতার শিরা', 'Fine lines across each leaf.': 'প্রতিটি পাতায় সূক্ষ্ম রেখা।',

  // Veins
  'Connect flowers with veins': 'ফুলগুলো শিরা দিয়ে যুক্ত করুন',
  'Draws growing stems between nearby flowers.': 'কাছের ফুলগুলোর মধ্যে বাড়তে থাকা ডাঁটা আঁকে।',
  'Vein density': 'শিরার ঘনত্ব',
  'How many veins join the flowers. 0% has no veins, 100% joins each flower to more neighbours.':
    'কতগুলো শিরা ফুলগুলোকে যুক্ত করবে। ০% মানে কোনো শিরা নেই।',
  'Vein style': 'শিরার ধরন',
  'Thin vine, thick stem, twisted rope, flat ribbon, or wire with coils. Mixed picks a random style for each vein.':
    'সরু লতা, মোটা ডাঁটা, পাকানো দড়ি, ফিতা বা কুণ্ডলী তার। মিশ্র হলে প্রতিটি শিরায় এলোমেলো ধরন।',
  'Thin vine': 'সরু লতা', 'Thick stem': 'মোটা ডাঁটা', 'Twisted rope': 'পাকানো দড়ি',
  'Ribbon': 'ফিতা', 'Wire with coils': 'কুণ্ডলী তার',
  'Growth direction': 'বাড়ার দিক', 'Grow from the first flower': 'প্রথম ফুল থেকে',
  'Grow from the second flower': 'দ্বিতীয় ফুল থেকে', 'Random': 'এলোমেলো',
  'Which end the vein starts from, so it looks like it grows out of a flower.':
    'শিরা কোন প্রান্ত থেকে শুরু হবে।',
  'Vein thickness': 'শিরার পুরুত্ব', 'How curvy veins are': 'শিরা কতটা বাঁকা',
  'Higher values make a bigger arc between flowers.': 'বেশি মানে ফুলের মাঝে বড় বাঁক।',
  'Wobble': 'দোলন', 'How much the veins sway when ambient motion is on.': 'পরিবেশগত গতি চালু থাকলে শিরা কতটা দোলে।',
  'Side branches per vein': 'প্রতি শিরায় পাশের শাখা',
  'Curly tendrils at tips': 'আগায় কুণ্ডলী আঁকড়ি', 'A small curl at the end of some veins.': 'কিছু শিরার শেষে ছোট কুণ্ডলী।',
  'Colour changes along the vein': 'শিরা বরাবর রং বদলাবে',
  'Blends from the base colour to the tip colour.': 'গোড়ার রং থেকে আগার রঙে মিশবে।',
  'Vein base colour': 'শিরার গোড়ার রং', 'Vein tip colour': 'শিরার আগার রং',
  'Stems from flowers to each leaf': 'ফুল থেকে প্রতিটি পাতায় ডাঁটা',
  'Thin stems that join each leaf to its flower.': 'সরু ডাঁটা, যা প্রতিটি পাতাকে ফুলের সাথে যুক্ত করে।',
  'Vein transparency': 'শিরার স্বচ্ছতা',
  'Lower values let the letters and flowers show through the veins.': 'কম করলে শিরার ভেতর দিয়ে অক্ষর ও ফুল দেখা যাবে।',

  // Motion
  'Bloom animation': 'ফোটার ধরন',
  'Left to right (default)': 'বাম থেকে ডানে (ডিফল্ট)',
  'Wave from the centre outward': 'কেন্দ্র থেকে ঢেউয়ের মতো',
  'Spiral': 'সর্পিল', 'Drift in from outside': 'বাইরে থেকে ভেসে আসা', 'Random sparkle': 'এলোমেলো ঝিলিক',
  'How the flowers open: one after another from the left, outward from the centre, in a spiral, drifting in from outside, or at random.':
    'ফুল কীভাবে ফুটবে: বাম থেকে একের পর এক, কেন্দ্র থেকে বাইরে, সর্পিলভাবে, বাইরে থেকে ভেসে এসে, বা এলোমেলোভাবে।',
  'Animation speed': 'গতির বেগ',
  'Speeds up or slows down everything, on screen and in the video.': 'সব কিছুর গতি বাড়ায় বা কমায়, পর্দায় ও ভিডিওতে।',
  'Ambient motion': 'পরিবেশগত গতি',
  'Sway, breathing, sparkle and falling petals. Starts after the bloom.': 'দোল, শ্বাস, ঝিলিক ও ঝরা পাপড়ি। ফোটার পরে শুরু হয়।',
  'Light sweep on letters': 'অক্ষরের উপর আলোর ঝলক',
  'A soft shine that passes over the letters. Turn off to stop it.': 'অক্ষরের উপর দিয়ে একটি নরম ঝলক যায়। বন্ধ করলে থেমে যাবে।',
  'Sway': 'দোল', 'Breathing': 'শ্বাস', 'Mouse breeze': 'মাউসের হাওয়া',
  'Flowers move away from the cursor.': 'কার্সর থেকে ফুল সরে যায়।',

  // Background and effects
  'Background colour': 'পটভূমির রং', 'Dark edges (vignette)': 'গাঢ় কিনারা',
  'Darkens the corners to focus on the centre.': 'কোণ গাঢ় করে মাঝখানে নজর দেয়।',
  'Paper grain': 'কাগজের দানা', 'A subtle texture, like printed paper.': 'ছাপা কাগজের মতো হালকা টেক্সচার।',
  'Falling petals': 'ঝরা পাপড়ি', 'Dew sparkle': 'শিশিরের ঝিলিক',

  // Export and share
  'Save PNG': 'PNG হিসেবে সংরক্ষণ', 'The finished bloom on your background colour.': 'পটভূমির রঙসহ সম্পূর্ণ ছবি।',
  'Save JPG': 'JPG হিসেবে সংরক্ষণ', 'The same image as JPG.': 'একই ছবি JPG ফরম্যাটে।',
  'Video: seconds of motion at the end': 'ভিডিও: শেষে কত সেকেন্ড গতি',
  'The video starts at the first bud, then keeps moving for this long.': 'ভিডিও প্রথম কুঁড়ি থেকে শুরু হবে, তারপর এতক্ষণ চলতে থাকবে।',
  'Record video (MP4 or WebM)': 'ভিডিও রেকর্ড (MP4 বা WebM)',
  'Records the bloom from the start, then ambient motion.': 'শুরু থেকে ফোটা ও পরে পরিবেশগত গতি রেকর্ড করে।',
  'Copy design code': 'ডিজাইন কোড কপি', 'A short code that recreates this design.': 'এই ডিজাইন আবার তৈরি করার ছোট কোড।',
  'Load design code': 'ডিজাইন কোড লোড', 'Paste a code to restore a design.': 'কোড পেস্ট করে ডিজাইন ফিরিয়ে আনুন।',

  // New looks
  'Pohela Boishakh': 'পহেলা বৈশাখ', 'Durga Puja': 'দুর্গা পূজা', 'Tea garden': 'চা বাগান',
  'Sunset': 'সূর্যাস্ত', 'Neon garden': 'নিয়ন বাগান', 'Vintage paper': 'পুরোনো কাগজ',
  'Cherry blossom': 'চেরি ফুল', 'Midnight': 'মধ্যরাত', 'Ember': 'অঙ্গার', 'Black and white': 'সাদা-কালো',

  // Export shape and modes
  'Export shape': 'সাইজ (আকৃতি)',
  'Size for saved images and videos. Portrait and square suit phones and social media. Screen size matches your window.':
    'সেভ করা ছবি ও ভিডিওর সাইজ। পোর্ট্রেট ও বর্গাকার ফোন ও সোশ্যাল মিডিয়ার জন্য ভালো। স্ক্রিন সাইজ আপনার উইন্ডোর মতো হবে।',
  'Screen size': 'স্ক্রিনের মাপ', 'Landscape (16:9)': 'ল্যান্ডস্কেপ (16:9)', 'Portrait (9:16)': 'পোর্ট্রেট (9:16)',
  'Square (1:1)': 'বর্গাকার (1:1)', 'Post (4:5)': 'পোস্ট (4:5)', 'Classic (4:3)': 'ক্লাসিক (4:3)',
  'Cinema (2.39:1)': 'সিনেমা (2.39:1)',
  'Basic mode': 'বেসিক মোড', 'Advanced mode': 'অ্যাডভান্সড মোড',
};

// The current interface language: 'bn' (default) or 'en'. Remembered on this device.
let uiLang = (() => {
  try { return localStorage.getItem('bloomLang') === 'bn' ? 'bn' : 'en'; } catch (e) { return 'en'; }

// Returns the text in the current language. Unknown strings stay in English.
function tr(s) {
  return uiLang === 'bn' && I18N[s] ? I18N[s] : s;
}
