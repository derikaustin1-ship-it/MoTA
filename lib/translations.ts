import type { Language } from "@/lib/app-types"

export const languageNames: Record<Language, string> = {
  en: "English",
  ta: "தமிழ்",
  hi: "हिन्दी",
  te: "తెలుగు",
}

const translations = {
  en: {
    appName: "Tribal Scholarship Connect", subtitle: "Unified Scholarship Services", continue: "How would you like to continue?",
    student: "Student", admin: "Admin", family: "Family View", studentDesc: "Apply and track scholarships", adminDesc: "Manage scholarships and applications", familyDesc: "View and manage children’s scholarships",
    phone: "Phone Number", mobile: "Enter mobile number", sendOtp: "Send OTP", enterOtp: "Enter the 6-digit OTP", login: "Login", demoOtp: "Demo OTP: 123456", invalidOtp: "Enter the demo OTP 123456",
    home: "Home", documents: "Documents", scholarships: "Scholarships", applications: "Applications", notifications: "Notifications", profile: "Profile", overview: "Overview", children: "Children", eligibleStudents: "Eligible Students", dashboard: "Dashboard",
    hello: "Hello", yourDocuments: "Your Documents", documentsDesc: "Securely fetch your verified documents", fetchDocuments: "Fetch Documents", connecting: "Connecting to DigiLocker...", verifying: "Verifying identity...", fetching: "Fetching documents...", fetched: "Documents fetched successfully",
    checkingEligibility: "Checking your scholarship eligibility...", eligibleTitle: "Scholarships you may be eligible for", demoRules: "Demo eligibility rules", viewEligibility: "View Eligibility", applyNow: "Apply Now", estimatedBenefit: "Estimated benefit", priority: "Priority", eligibilityMatch: "Eligibility match",
    yourEligibility: "Your eligibility", requiredDocuments: "Required documents", benefits: "Benefits", deadline: "Application deadline", back: "Back", verifiedData: "Verified document data", confirm: "I confirm that the information provided is correct.", submit: "Submit Application", submitted: "Application Submitted Successfully", viewDashboard: "View Scholarship Dashboard",
    currentStatus: "Current status", payment: "Payment", deficiency: "Action Required", resolve: "Resolve", view: "View", verified: "Verified", edit: "Edit", save: "Save Changes", logout: "Log out",
    adminDashboard: "Admin Dashboard", scholarshipManagement: "Scholarship Management", totalStudents: "Total Students", totalApplications: "Total Applications", pending: "Pending", sanctioned: "Sanctioned", rejected: "Rejected", search: "Search student or application ID", notifyAll: "Notify All", notAppliedTitle: "Eligible Students Not Yet Applied", notifyQuestion: "Send notification to all eligible students?", cancel: "Cancel", sendNotifications: "Send Notifications",
    familyOverview: "Family Scholarship Overview", underVerification: "Under Verification", viewChild: "View scholarship", jagoSubtitle: "Your Scholarship Assistant", askJago: "Ask about scholarships...", demoMode: "Demo Mode",
  },
  ta: {
    appName: "பழங்குடியினர் கல்வி உதவித்தொகை இணைப்பு", subtitle: "ஒருங்கிணைந்த கல்வி உதவித்தொகை சேவைகள்", continue: "நீங்கள் எவ்வாறு தொடர விரும்புகிறீர்கள்?",
    student: "மாணவர்", admin: "நிர்வாகி", family: "குடும்பப் பார்வை", studentDesc: "விண்ணப்பித்து உதவித்தொகையை கண்காணிக்கவும்", adminDesc: "உதவித்தொகை மற்றும் விண்ணப்பங்களை நிர்வகிக்கவும்", familyDesc: "குழந்தைகளின் உதவித்தொகையைப் பார்க்கவும்",
    phone: "தொலைபேசி எண்", mobile: "மொபைல் எண்ணை உள்ளிடவும்", sendOtp: "OTP அனுப்பவும்", enterOtp: "6 இலக்க OTP-ஐ உள்ளிடவும்", login: "உள்நுழைக", demoOtp: "மாதிரி OTP: 123456", invalidOtp: "மாதிரி OTP 123456-ஐ உள்ளிடவும்",
    home: "முகப்பு", documents: "ஆவணங்கள்", scholarships: "உதவித்தொகைகள்", applications: "விண்ணப்பங்கள்", notifications: "அறிவிப்புகள்", profile: "சுயவிவரம்", overview: "கண்ணோட்டம்", children: "குழந்தைகள்", eligibleStudents: "தகுதியான மாணவர்கள்", dashboard: "முகப்புப் பலகை",
    hello: "வணக்கம்", yourDocuments: "உங்கள் ஆவணங்கள்", documentsDesc: "சரிபார்க்கப்பட்ட ஆவணங்களை பாதுகாப்பாகப் பெறுங்கள்", fetchDocuments: "ஆவணங்களைப் பெறுக", connecting: "DigiLocker உடன் இணைக்கிறது...", verifying: "அடையாளம் சரிபார்க்கப்படுகிறது...", fetching: "ஆவணங்கள் பெறப்படுகின்றன...", fetched: "ஆவணங்கள் வெற்றிகரமாகப் பெறப்பட்டன",
    checkingEligibility: "உதவித்தொகை தகுதி சரிபார்க்கப்படுகிறது...", eligibleTitle: "நீங்கள் தகுதி பெறக்கூடிய உதவித்தொகைகள்", demoRules: "மாதிரி தகுதி விதிகள்", viewEligibility: "தகுதியைப் பார்க்க", applyNow: "இப்போது விண்ணப்பிக்க", estimatedBenefit: "மதிப்பிடப்பட்ட பலன்", priority: "முன்னுரிமை", eligibilityMatch: "தகுதி பொருத்தம்",
    yourEligibility: "உங்கள் தகுதி", requiredDocuments: "தேவையான ஆவணங்கள்", benefits: "பலன்கள்", deadline: "விண்ணப்ப கடைசி நாள்", back: "பின்", verifiedData: "சரிபார்க்கப்பட்ட ஆவணத் தரவு", confirm: "வழங்கிய தகவல் சரியானது என்பதை உறுதிசெய்கிறேன்.", submit: "விண்ணப்பத்தை சமர்ப்பிக்கவும்", submitted: "விண்ணப்பம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது", viewDashboard: "உதவித்தொகை நிலையைப் பார்க்க",
    currentStatus: "தற்போதைய நிலை", payment: "பணம்", deficiency: "நடவடிக்கை தேவை", resolve: "தீர்க்க", view: "பார்க்க", verified: "சரிபார்க்கப்பட்டது", edit: "திருத்து", save: "மாற்றங்களைச் சேமிக்க", logout: "வெளியேறு",
    adminDashboard: "நிர்வாகி முகப்புப் பலகை", scholarshipManagement: "உதவித்தொகை மேலாண்மை", totalStudents: "மொத்த மாணவர்கள்", totalApplications: "மொத்த விண்ணப்பங்கள்", pending: "நிலுவையில்", sanctioned: "அனுமதிக்கப்பட்டது", rejected: "நிராகரிக்கப்பட்டது", search: "மாணவர் அல்லது விண்ணப்ப எண்ணைத் தேடுக", notifyAll: "அனைவருக்கும் அறிவிக்க", notAppliedTitle: "இன்னும் விண்ணப்பிக்காத தகுதியான மாணவர்கள்", notifyQuestion: "அனைத்து தகுதியான மாணவர்களுக்கும் அறிவிப்பு அனுப்பவா?", cancel: "ரத்து", sendNotifications: "அறிவிப்புகளை அனுப்புக",
    familyOverview: "குடும்ப உதவித்தொகை கண்ணோட்டம்", underVerification: "சரிபார்ப்பில்", viewChild: "உதவித்தொகையைப் பார்க்க", jagoSubtitle: "உங்கள் கல்வி உதவித்தொகை உதவியாளர்", askJago: "உதவித்தொகை பற்றி கேளுங்கள்...", demoMode: "மாதிரி நிலை",
  },
  hi: {
    appName: "जनजातीय छात्रवृत्ति कनेक्ट", subtitle: "एकीकृत छात्रवृत्ति सेवाएँ", continue: "आप कैसे आगे बढ़ना चाहेंगे?",
    student: "विद्यार्थी", admin: "प्रशासक", family: "परिवार दृश्य", studentDesc: "छात्रवृत्ति के लिए आवेदन और ट्रैक करें", adminDesc: "छात्रवृत्ति और आवेदन प्रबंधित करें", familyDesc: "बच्चों की छात्रवृत्ति देखें और प्रबंधित करें",
    phone: "फ़ोन नंबर", mobile: "मोबाइल नंबर दर्ज करें", sendOtp: "OTP भेजें", enterOtp: "6 अंकों का OTP दर्ज करें", login: "लॉग इन", demoOtp: "डेमो OTP: 123456", invalidOtp: "डेमो OTP 123456 दर्ज करें",
    home: "होम", documents: "दस्तावेज़", scholarships: "छात्रवृत्तियाँ", applications: "आवेदन", notifications: "सूचनाएँ", profile: "प्रोफ़ाइल", overview: "अवलोकन", children: "बच्चे", eligibleStudents: "पात्र विद्यार्थी", dashboard: "डैशबोर्ड",
    hello: "नमस्ते", yourDocuments: "आपके दस्तावेज़", documentsDesc: "अपने सत्यापित दस्तावेज़ सुरक्षित रूप से प्राप्त करें", fetchDocuments: "दस्तावेज़ प्राप्त करें", connecting: "DigiLocker से जुड़ रहे हैं...", verifying: "पहचान सत्यापित हो रही है...", fetching: "दस्तावेज़ प्राप्त हो रहे हैं...", fetched: "दस्तावेज़ सफलतापूर्वक प्राप्त हुए",
    checkingEligibility: "छात्रवृत्ति पात्रता जाँची जा रही है...", eligibleTitle: "वे छात्रवृत्तियाँ जिनके लिए आप पात्र हो सकते हैं", demoRules: "डेमो पात्रता नियम", viewEligibility: "पात्रता देखें", applyNow: "अभी आवेदन करें", estimatedBenefit: "अनुमानित लाभ", priority: "प्राथमिकता", eligibilityMatch: "पात्रता मिलान",
    yourEligibility: "आपकी पात्रता", requiredDocuments: "आवश्यक दस्तावेज़", benefits: "लाभ", deadline: "आवेदन की अंतिम तिथि", back: "वापस", verifiedData: "सत्यापित दस्तावेज़ डेटा", confirm: "मैं पुष्टि करता/करती हूँ कि दी गई जानकारी सही है।", submit: "आवेदन जमा करें", submitted: "आवेदन सफलतापूर्वक जमा हुआ", viewDashboard: "छात्रवृत्ति डैशबोर्ड देखें",
    currentStatus: "वर्तमान स्थिति", payment: "भुगतान", deficiency: "कार्रवाई आवश्यक", resolve: "समाधान करें", view: "देखें", verified: "सत्यापित", edit: "संपादित करें", save: "बदलाव सहेजें", logout: "लॉग आउट",
    adminDashboard: "प्रशासक डैशबोर्ड", scholarshipManagement: "छात्रवृत्ति प्रबंधन", totalStudents: "कुल विद्यार्थी", totalApplications: "कुल आवेदन", pending: "लंबित", sanctioned: "स्वीकृत", rejected: "अस्वीकृत", search: "विद्यार्थी या आवेदन आईडी खोजें", notifyAll: "सभी को सूचित करें", notAppliedTitle: "पात्र विद्यार्थी जिन्होंने अभी आवेदन नहीं किया", notifyQuestion: "सभी पात्र विद्यार्थियों को सूचना भेजें?", cancel: "रद्द करें", sendNotifications: "सूचनाएँ भेजें",
    familyOverview: "परिवार छात्रवृत्ति अवलोकन", underVerification: "सत्यापन में", viewChild: "छात्रवृत्ति देखें", jagoSubtitle: "आपका छात्रवृत्ति सहायक", askJago: "छात्रवृत्ति के बारे में पूछें...", demoMode: "डेमो मोड",
  },
  te: {
    appName: "గిరిజన స్కాలర్‌షిప్ కనెక్ట్", subtitle: "ఏకీకృత స్కాలర్‌షిప్ సేవలు", continue: "మీరు ఎలా కొనసాగాలనుకుంటున్నారు?",
    student: "విద్యార్థి", admin: "నిర్వాహకుడు", family: "కుటుంబ వీక్షణ", studentDesc: "స్కాలర్‌షిప్‌లకు దరఖాస్తు చేసి ట్రాక్ చేయండి", adminDesc: "స్కాలర్‌షిప్‌లు మరియు దరఖాస్తులను నిర్వహించండి", familyDesc: "పిల్లల స్కాలర్‌షిప్‌లను చూడండి",
    phone: "ఫోన్ నంబర్", mobile: "మొబైల్ నంబర్ నమోదు చేయండి", sendOtp: "OTP పంపండి", enterOtp: "6 అంకెల OTP నమోదు చేయండి", login: "లాగిన్", demoOtp: "డెమో OTP: 123456", invalidOtp: "డెమో OTP 123456 నమోదు చేయండి",
    home: "హోమ్", documents: "పత్రాలు", scholarships: "స్కాలర్‌షిప్‌లు", applications: "దరఖాస్తులు", notifications: "నోటిఫికేషన్లు", profile: "ప్రొఫైల్", overview: "అవలోకనం", children: "పిల్లలు", eligibleStudents: "అర్హులైన విద్యార్థులు", dashboard: "డ్యాష్‌బోర్డ్",
    hello: "నమస్తే", yourDocuments: "మీ పత్రాలు", documentsDesc: "ధృవీకరించిన పత్రాలను సురక్షితంగా పొందండి", fetchDocuments: "పత్రాలను పొందండి", connecting: "DigiLocker‌కు కనెక్ట్ అవుతోంది...", verifying: "గుర్తింపు ధృవీకరిస్తోంది...", fetching: "పత్రాలు పొందుతోంది...", fetched: "పత్రాలు విజయవంతంగా పొందబడ్డాయి",
    checkingEligibility: "స్కాలర్‌షిప్ అర్హతను తనిఖీ చేస్తోంది...", eligibleTitle: "మీకు అర్హత ఉండవచ్చిన స్కాలర్‌షిప్‌లు", demoRules: "డెమో అర్హత నియమాలు", viewEligibility: "అర్హత చూడండి", applyNow: "ఇప్పుడే దరఖాస్తు", estimatedBenefit: "అంచనా ప్రయోజనం", priority: "ప్రాధాన్యత", eligibilityMatch: "అర్హత సరిపోలిక",
    yourEligibility: "మీ అర్హత", requiredDocuments: "అవసరమైన పత్రాలు", benefits: "ప్రయోజనాలు", deadline: "దరఖాస్తు గడువు", back: "వెనుకకు", verifiedData: "ధృవీకరించిన పత్ర డేటా", confirm: "అందించిన సమాచారం సరైనదని ధృవీకరిస్తున్నాను.", submit: "దరఖాస్తు సమర్పించండి", submitted: "దరఖాస్తు విజయవంతంగా సమర్పించబడింది", viewDashboard: "స్కాలర్‌షిప్ డ్యాష్‌బోర్డ్ చూడండి",
    currentStatus: "ప్రస్తుత స్థితి", payment: "చెల్లింపు", deficiency: "చర్య అవసరం", resolve: "పరిష్కరించండి", view: "చూడండి", verified: "ధృవీకరించబడింది", edit: "సవరించండి", save: "మార్పులు సేవ్ చేయండి", logout: "లాగ్ అవుట్",
    adminDashboard: "నిర్వాహక డ్యాష్‌బోర్డ్", scholarshipManagement: "స్కాలర్‌షిప్ నిర్వహణ", totalStudents: "మొత్తం విద్యార్థులు", totalApplications: "మొత్తం దరఖాస్తులు", pending: "పెండింగ్", sanctioned: "మంజూరు", rejected: "తిరస్కరించబడింది", search: "విద్యార్థి లేదా దరఖాస్తు ID వెతకండి", notifyAll: "అందరికీ తెలియజేయండి", notAppliedTitle: "ఇంకా దరఖాస్తు చేయని అర్హులైన విద్యార్థులు", notifyQuestion: "అర్హులైన విద్యార్థులందరికీ నోటిఫికేషన్ పంపాలా?", cancel: "రద్దు", sendNotifications: "నోటిఫికేషన్లు పంపండి",
    familyOverview: "కుటుంబ స్కాలర్‌షిప్ అవలోకనం", underVerification: "ధృవీకరణలో", viewChild: "స్కాలర్‌షిప్ చూడండి", jagoSubtitle: "మీ స్కాలర్‌షిప్ సహాయకుడు", askJago: "స్కాలర్‌షిప్ గురించి అడగండి...", demoMode: "డెమో మోడ్",
  },
} as const

export type TranslationKey = keyof typeof translations.en

export function translate(language: Language, key: TranslationKey): string {
  return translations[language][key] ?? translations.en[key]
}
