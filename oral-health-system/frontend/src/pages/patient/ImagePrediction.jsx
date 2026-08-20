import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  deleteImagePrediction,
  getImagePredictionHistory,
  predictOralImage,
} from "../../api/imagePredictionApi";

import "./ImagePrediction.css";

import {
  getStoredUser,
} from "../../api/authStorage.js";


const languageNameToCode = (language) => {
  const normalized =
    String(language || "English")
      .trim()
      .toLowerCase();

  if (normalized === "sinhala") return "si";
  if (normalized === "tamil") return "ta";
  return "en";
};

const imageTranslations = {
  en: {
    unavailable: "Unavailable",
    noRecords: "No records",

    heroBadge: "Oral Image Screening",
    heroTitle: "Oral Image Prediction",
    heroDescription:
      "Upload a clear oral image to receive an oral health prediction, confidence score, class probabilities and relevant oral-health guidance.",

    secureProcessing: "Secure processing",
    model: "EfficientNetB0 model",
    privateHistory: "Private history",

    upload: "Upload",
    uploadHint: "Select a clear image",
    analyse: "Analyse",
    analyseHint: "CNN model analyses the image",
    review: "Review",
    reviewHint: "View guidance and history",

    modelCoverage: "Image Model Coverage",
    supportedClasses: "Supported Image Classes",
    supportedDescription:
      "OralVista uses an EfficientNetB0 transfer-learning CNN to classify uploaded oral images into one of three supported screening classes.",

    calculus: "Calculus",
    calculusDesc: "Visible calculus patterns",
    gingivitis: "Gingivitis",
    gingivitisDesc: "Visible gingival inflammation patterns",
    hypodontia: "Hypodontia",
    hypodontiaDesc: "Patterns associated with congenitally missing teeth",

    coverageNote:
      "The class with the highest model probability is presented as the model result. This feature is for preliminary screening only and does not provide a confirmed clinical diagnosis.",

    newAnalysis: "New Analysis",
    predictionHistory: "Prediction History",

    imageInput: "Image input",
    uploadOralImage: "Upload oral image",
    clear: "Clear",

    photoGuidelines: "Photo Guidelines",
    photoSummary: "Clear, close-up, well-lit oral image",

    guideline1Title: "Use good lighting.",
    guideline1Text:
      "Take the photo in a bright, evenly lit area and avoid strong shadows.",
    guideline2Title: "Keep the camera steady.",
    guideline2Text:
      "Make sure the image is clear, sharp and not blurry.",
    guideline3Title: "Show the teeth clearly.",
    guideline3Text:
      "Position the camera so the teeth and surrounding gum line are visible.",
    guideline4Title: "Take a close-up photo.",
    guideline4Text:
      "The teeth should occupy most of the image and remain in focus.",
    guideline5Title: "Avoid obstructions.",
    guideline5Text:
      "Keep fingers, toothbrushes, food and other objects away from the area.",
    guideline6Title: "Use an original image.",
    guideline6Text:
      "Do not upload screenshots, X-rays, filtered or heavily edited images.",
    guideline7Title: "Upload one image at a time.",
    guideline7Text:
      "JPG, JPEG, PNG or WEBP, maximum 5 MB.",

    bestResults: "For best results",
    bestResultsText:
      "Use a close-up, well-lit image where tooth surfaces and the gum line are clearly visible.",

    selectedPreview: "Selected oral preview",
    changeImage: "Change image",
    selectImage: "Select an oral image",
    browseDevice: "Browse from your device",
    fileLimit: "JPG, JPEG, PNG or WEBP · Maximum 5 MB",

    ready: "Ready",
    analysing: "Analysing image...",
    analyseImage: "Analyse Image",

    privacyTitle: "Privacy-first processing",
    privacyText:
      "The original oral image is not permanently stored. Only a SHA-256 fingerprint and the prediction record are retained.",

    modelOutput: "Model output",
    predictionResult: "Prediction result",
    noPrediction: "No prediction yet",
    noPredictionText:
      "Upload an oral image and select Analyse Image to view the prediction and recommendations.",

    predictedCondition: "Predicted condition",
    selectedBecause:
      "The model selected this class because it received the highest probability.",
    modelResult: "Model Result",

    confidenceScore: "Confidence score",
    confidenceHelp: "Model confidence for this uploaded image",
    confidenceInfo:
      "Confidence shows how strongly the model supports this image classification. A high confidence score does not confirm a clinical diagnosis.",

    probabilities: "Prediction probabilities",
    ranked: "Ranked highest to lowest",
    softmax: "Softmax output",
    predicted: "Predicted",

    nextSteps: "Recommended next steps",
    conditionGuidance: "Condition-based guidance",
    medicalDisclaimer: "Medical disclaimer",

    totalRecords: "Total records",
    averageConfidence: "Average confidence",
    latestPrediction: "Latest prediction",
    patientRecords: "Patient records",

    historyTitle: "Image Prediction History",
    historyDescription:
      "View, review and manage your previous image screening results.",

    loading: "Loading...",
    refresh: "Refresh",
    loadingHistory: "Loading prediction history...",
    noPredictionRecords: "No prediction records",
    noPredictionRecordsText:
      "Your successful image predictions will appear here.",

    condition: "Condition",
    confidence: "Confidence",
    filename: "Filename",
    duplicate: "Duplicate",
    date: "Date",
    details: "Details",
    action: "Action",

    yes: "Yes",
    no: "No",
    view: "View",
    delete: "Delete",

    predictionDetails: "Prediction Details",
    completeSavedInfo:
      "Complete information for this saved oral image prediction.",
    closePredictionDetails: "Close prediction details",

    duplicateUpload: "Duplicate upload",
    classProbabilities: "Class probabilities",
    predictionDistribution: "Prediction distribution",
    recommendations: "Recommendations",
    conditionActions: "Condition-based oral-care actions",

    fileType: "File type",
    fileSize: "File size",
    modelVersion: "Model version",
    predictionDate: "Prediction date",
    close: "Close",

    invalidType: "Only JPG, JPEG, PNG and WEBP images are allowed.",
    tooLarge: "The image must be 5 MB or smaller.",
    selectImageError: "Please select an oral image.",
    duplicateSuccess:
      "This exact image was analysed before. A new secure history record was created.",
    analysisSuccess:
      "Image analysis completed and saved securely.",
    deleteConfirm: "Delete this prediction record?",
    deleteSuccess: "Prediction record deleted successfully.",

    classes: {
      calculus: "Calculus",
      gingivitis: "Gingivitis",
      hypodontia: "Hypodontia",
    },
  },

  si: {
    unavailable: "ලබාගත නොහැක",
    noRecords: "වාර්තා නොමැත",
    heroBadge: "මුඛ රූප පරීක්ෂාව",
    heroTitle: "මුඛ රූප පුරෝකථනය",
    heroDescription:
      "පැහැදිලි මුඛ රූපයක් උඩුගත කර මුඛ තත්ත්ව පුරෝකථනයක්, විශ්වාසනීයතා අගයක්, පන්ති සම්භාවිතා සහ අදාළ මුඛ සෞඛ්‍ය මගපෙන්වීම ලබාගන්න.",
    secureProcessing: "ආරක්ෂිත සැකසුම",
    model: "EfficientNetB0 ආකෘතිය",
    privateHistory: "පුද්ගලික ඉතිහාසය",
    upload: "උඩුගත කරන්න",
    uploadHint: "පැහැදිලි රූපයක් තෝරන්න",
    analyse: "විශ්ලේෂණය",
    analyseHint: "CNN ආකෘතිය රූපය විශ්ලේෂණය කරයි",
    review: "සමාලෝචනය",
    reviewHint: "මගපෙන්වීම සහ ඉතිහාසය බලන්න",
    modelCoverage: "රූප ආකෘති ආවරණය",
    supportedClasses: "සහාය දක්වන රූප පන්ති",
    supportedDescription:
      "OralVista විසින් උඩුගත කරන මුඛ රූප සහාය දක්වන පරීක්ෂණ පන්ති තුනෙන් එකකට වර්ගීකරණය කිරීමට EfficientNetB0 transfer-learning CNN භාවිතා කරයි.",
    calculus: "දත් කැල්කියුලස්",
    calculusDesc: "පෙනෙන කැල්කියුලස් රටා",
    gingivitis: "දත් මස් දැවිල්ල",
    gingivitisDesc: "දත් මස් දැවිල්ලේ රටා",
    hypodontia: "හයිපොඩොන්ටියා",
    hypodontiaDesc: "අහිමි දත් රටා",
    coverageNote:
      "ඉහළම ආකෘති සම්භාවිතාව ඇති පන්තිය ආකෘති ප්‍රතිඵලය ලෙස පෙන්වයි. මෙය මූලික පරීක්ෂාව සඳහා පමණක් වන අතර තහවුරු කළ වෛද්‍ය රෝග විනිශ්චයක් ලබා නොදේ.",
    newAnalysis: "නව විශ්ලේෂණය",
    predictionHistory: "පුරෝකථන ඉතිහාසය",
    imageInput: "රූප ආදානය",
    uploadOralImage: "මුඛ රූපයක් උඩුගත කරන්න",
    clear: "ඉවත් කරන්න",
    photoGuidelines: "ඡායාරූප මාර්ගෝපදේශ",
    photoSummary: "පැහැදිලි, ආසන්න, හොඳ ආලෝකය සහිත මුඛ රූපයක්",
    guideline1Title: "හොඳ ආලෝකය භාවිතා කරන්න.",
    guideline1Text: "ප්‍රභාශ්වර සහ සමාන ආලෝකයක් ඇති ස්ථානයක ඡායාරූපය ගන්න.",
    guideline2Title: "කැමරාව ස්ථිරව තබා ගන්න.",
    guideline2Text: "රූපය පැහැදිලි, තියුණු සහ නොබැඳුණු බව තහවුරු කරන්න.",
    guideline3Title: "දත් පැහැදිලිව පෙන්වන්න.",
    guideline3Text: "දත් සහ අවට දත් මස් පෙනෙන ලෙස කැමරාව ස්ථානගත කරන්න.",
    guideline4Title: "ආසන්න ඡායාරූපයක් ගන්න.",
    guideline4Text: "දත් රූපයේ වැඩි කොටසක් ආවරණය කර focus තුළ තිබිය යුතුය.",
    guideline5Title: "බාධා වළක්වන්න.",
    guideline5Text: "ඇඟිලි, දත් බුරුසු, ආහාර සහ වෙනත් ද්‍රව්‍ය රූපයෙන් ඉවත් කරන්න.",
    guideline6Title: "මුල් රූපයක් භාවිතා කරන්න.",
    guideline6Text: "screenshots, X-rays, filters හෝ අධික ලෙස සංස්කරණය කළ රූප උඩුගත නොකරන්න.",
    guideline7Title: "වරකට එක් රූපයක් උඩුගත කරන්න.",
    guideline7Text: "JPG, JPEG, PNG හෝ WEBP, උපරිම 5 MB.",
    bestResults: "හොඳම ප්‍රතිඵල සඳහා",
    bestResultsText: "දත් මතුපිට සහ දත් මස් රේඛාව පැහැදිලිව පෙනෙන ආසන්න, හොඳ ආලෝකයක් සහිත රූපයක් භාවිතා කරන්න.",
    selectedPreview: "තෝරාගත් මුඛ රූප පෙරදසුන",
    changeImage: "රූපය වෙනස් කරන්න",
    selectImage: "මුඛ රූපයක් තෝරන්න",
    browseDevice: "ඔබගේ උපාංගයෙන් තෝරන්න",
    fileLimit: "JPG, JPEG, PNG හෝ WEBP · උපරිම 5 MB",
    ready: "සූදානම්",
    analysing: "රූපය විශ්ලේෂණය කරමින්...",
    analyseImage: "රූපය විශ්ලේෂණය කරන්න",
    privacyTitle: "පෞද්ගලිකත්වයට ප්‍රමුඛ සැකසුම",
    privacyText: "මුල් මුඛ රූපය ස්ථිරව ගබඩා නොකෙරේ. SHA-256 fingerprint එකක් සහ පුරෝකථන වාර්තාව පමණක් තබා ගනී.",
    modelOutput: "ආකෘති ප්‍රතිදානය",
    predictionResult: "පුරෝකථන ප්‍රතිඵලය",
    noPrediction: "තවම පුරෝකථනයක් නොමැත",
    noPredictionText: "මුඛ රූපයක් උඩුගත කර පුරෝකථනය සහ නිර්දේශ බැලීමට රූපය විශ්ලේෂණය කරන්න.",
    predictedCondition: "පුරෝකථනය කළ තත්ත්වය",
    selectedBecause: "මෙම පන්තියට ඉහළම සම්භාවිතාව ලැබුණු නිසා ආකෘතිය එය තෝරාගෙන ඇත.",
    modelResult: "ආකෘති ප්‍රතිඵලය",
    confidenceScore: "විශ්වාසනීයතා අගය",
    confidenceHelp: "මෙම උඩුගත කළ රූපය සඳහා ආකෘති විශ්වාසනීයතාව",
    confidenceInfo: "විශ්වාසනීයතා අගය මෙම රූප වර්ගීකරණයට ආකෘතිය කොතරම් තදින් සහාය දක්වන්නේද පෙන්වයි. ඉහළ අගයක් වෛද්‍ය රෝග විනිශ්චයක් තහවුරු නොකරයි.",
    probabilities: "පුරෝකථන සම්භාවිතා",
    ranked: "ඉහළ සිට අඩු දක්වා",
    softmax: "Softmax ප්‍රතිදානය",
    predicted: "පුරෝකථනය කළ",
    nextSteps: "නිර්දේශිත ඊළඟ පියවර",
    conditionGuidance: "තත්ත්වයට අදාළ මගපෙන්වීම",
    medicalDisclaimer: "වෛද්‍ය වගකීම් ප්‍රකාශය",
    totalRecords: "මුළු වාර්තා",
    averageConfidence: "සාමාන්‍ය විශ්වාසනීයතාව",
    latestPrediction: "නවතම පුරෝකථනය",
    patientRecords: "රෝගී වාර්තා",
    historyTitle: "රූප පුරෝකථන ඉතිහාසය",
    historyDescription: "ඔබගේ පෙර රූප පරීක්ෂණ ප්‍රතිඵල බලන්න, සමාලෝචනය කරන්න සහ කළමනාකරණය කරන්න.",
    loading: "පූරණය වෙමින්...",
    refresh: "යාවත්කාලීන කරන්න",
    loadingHistory: "පුරෝකථන ඉතිහාසය පූරණය වෙමින්...",
    noPredictionRecords: "පුරෝකථන වාර්තා නොමැත",
    noPredictionRecordsText: "ඔබගේ සාර්ථක රූප පුරෝකථන මෙහි පෙන්වනු ඇත.",
    condition: "තත්ත්වය",
    confidence: "විශ්වාසනීයතාව",
    filename: "ගොනු නාමය",
    duplicate: "අනුපිටපත",
    date: "දිනය",
    details: "විස්තර",
    action: "ක්‍රියාව",
    yes: "ඔව්",
    no: "නැත",
    view: "බලන්න",
    delete: "මකන්න",
    predictionDetails: "පුරෝකථන විස්තර",
    completeSavedInfo: "මෙම සුරකින ලද මුඛ රූප පුරෝකථනය සඳහා සම්පූර්ණ තොරතුරු.",
    closePredictionDetails: "පුරෝකථන විස්තර වසන්න",
    duplicateUpload: "අනුපිටපත් උඩුගත කිරීම",
    classProbabilities: "පන්ති සම්භාවිතා",
    predictionDistribution: "පුරෝකථන බෙදාහැරීම",
    recommendations: "නිර්දේශ",
    conditionActions: "තත්ත්වයට අදාළ මුඛ සෞඛ්‍ය ක්‍රියාමාර්ග",
    fileType: "ගොනු වර්ගය",
    fileSize: "ගොනු ප්‍රමාණය",
    modelVersion: "ආකෘති අනුවාදය",
    predictionDate: "පුරෝකථන දිනය",
    close: "වසන්න",
    invalidType: "JPG, JPEG, PNG සහ WEBP රූප පමණක් අවසර ඇත.",
    tooLarge: "රූපය 5 MB හෝ ඊට අඩු විය යුතුය.",
    selectImageError: "කරුණාකර මුඛ රූපයක් තෝරන්න.",
    duplicateSuccess: "මෙමම රූපය පෙර විශ්ලේෂණය කර ඇත. නව ආරක්ෂිත ඉතිහාස වාර්තාවක් නිර්මාණය කරන ලදී.",
    analysisSuccess: "රූප විශ්ලේෂණය සම්පූර්ණ කර ආරක්ෂිතව සුරකින ලදී.",
    deleteConfirm: "මෙම පුරෝකථන වාර්තාව මකා දැමීමට අවශ්‍යද?",
    deleteSuccess: "පුරෝකථන වාර්තාව සාර්ථකව මකා දමන ලදී.",
    classes: {
      calculus: "දත් කැල්කියුලස්",
      gingivitis: "දත් මස් දැවිල්ල",
      hypodontia: "හයිපොඩොන්ටියා",
    },
  },

  ta: {
    unavailable: "கிடைக்கவில்லை",
    noRecords: "பதிவுகள் இல்லை",
    heroBadge: "வாய்ப் பட பரிசோதனை",
    heroTitle: "வாய்ப் பட கணிப்பு",
    heroDescription: "தெளிவான வாய்ப் படத்தை பதிவேற்றி, வாய்ச் சுகாதார நிலை கணிப்பு, நம்பகத்தன்மை மதிப்பெண், வகுப்பு சாத்தியக்கூறுகள் மற்றும் தொடர்புடைய வாய்ச் சுகாதார வழிகாட்டலைப் பெறுங்கள்.",
    secureProcessing: "பாதுகாப்பான செயலாக்கம்",
    model: "EfficientNetB0 மாதிரி",
    privateHistory: "தனிப்பட்ட வரலாறு",
    upload: "பதிவேற்றம்",
    uploadHint: "தெளிவான படத்தைத் தேர்ந்தெடுக்கவும்",
    analyse: "பகுப்பாய்வு",
    analyseHint: "CNN மாதிரி படத்தை பகுப்பாய்வு செய்கிறது",
    review: "மதிப்பாய்வு",
    reviewHint: "வழிகாட்டல் மற்றும் வரலாற்றைப் பார்க்கவும்",
    modelCoverage: "பட மாதிரி உள்ளடக்கம்",
    supportedClasses: "ஆதரிக்கப்படும் பட வகைகள்",
    supportedDescription: "OralVista பதிவேற்றப்பட்ட வாய்ப் படங்களை ஆதரிக்கப்படும் மூன்று பரிசோதனை வகைகளில் ஒன்றாக வகைப்படுத்த EfficientNetB0 transfer-learning CNN-ஐ பயன்படுத்துகிறது.",
    calculus: "பல் கல்",
    calculusDesc: "தென்படும் பல் கல் வடிவங்கள்",
    gingivitis: "ஈறு அழற்சி",
    gingivitisDesc: "ஈறு அழற்சி வடிவங்கள்",
    hypodontia: "ஹைப்போடோண்டியா",
    hypodontiaDesc: "பல் இல்லாமை வடிவங்கள்",
    coverageNote: "மாதிரியின் அதிகபட்ச சாத்தியக்கூறு கொண்ட வகுப்பு மாதிரி முடிவாக காட்டப்படும். இது ஆரம்ப பரிசோதனைக்காக மட்டுமே; உறுதிப்படுத்தப்பட்ட மருத்துவ நோயறிதலை வழங்காது.",
    newAnalysis: "புதிய பகுப்பாய்வு",
    predictionHistory: "கணிப்பு வரலாறு",
    imageInput: "பட உள்ளீடு",
    uploadOralImage: "வாய்ப் படத்தை பதிவேற்றவும்",
    clear: "அழிக்கவும்",
    photoGuidelines: "பட வழிகாட்டுதல்கள்",
    photoSummary: "தெளிவான, நெருக்கமான, நல்ல வெளிச்சம் கொண்ட வாய்ப் படம்",
    guideline1Title: "நல்ல வெளிச்சத்தை பயன்படுத்தவும்.",
    guideline1Text: "பிரகாசமான மற்றும் சமமான வெளிச்சமுள்ள இடத்தில் படத்தை எடுத்து கடுமையான நிழல்களை தவிர்க்கவும்.",
    guideline2Title: "கேமராவை நிலையாக வைத்திருக்கவும்.",
    guideline2Text: "படம் தெளிவாகவும் கூர்மையாகவும் மங்காமல் இருப்பதை உறுதி செய்யவும்.",
    guideline3Title: "பற்களை தெளிவாக காட்டவும்.",
    guideline3Text: "பற்களும் சுற்றியுள்ள ஈறு வரியும் தெளிவாகத் தெரியும்படி கேமராவை அமைக்கவும்.",
    guideline4Title: "நெருக்கமான படத்தை எடுக்கவும்.",
    guideline4Text: "பற்கள் படத்தின் பெரும்பகுதியை நிரப்பி கவனத்தில் இருக்க வேண்டும்.",
    guideline5Title: "தடைகளை தவிர்க்கவும்.",
    guideline5Text: "விரல்கள், பல் துலக்கிகள், உணவு மற்றும் பிற பொருட்களை பகுதியிலிருந்து விலக்கவும்.",
    guideline6Title: "அசல் படத்தை பயன்படுத்தவும்.",
    guideline6Text: "screenshots, X-rays, filters அல்லது அதிகமாக திருத்தப்பட்ட படங்களை பதிவேற்ற வேண்டாம்.",
    guideline7Title: "ஒரு நேரத்தில் ஒரு படத்தை பதிவேற்றவும்.",
    guideline7Text: "JPG, JPEG, PNG அல்லது WEBP, அதிகபட்சம் 5 MB.",
    bestResults: "சிறந்த முடிவுகளுக்கு",
    bestResultsText: "பல் மேற்பரப்பும் ஈறு வரியும் தெளிவாகத் தெரியும் நெருக்கமான, நல்ல வெளிச்சம் கொண்ட படத்தைப் பயன்படுத்தவும்.",
    selectedPreview: "தேர்ந்தெடுக்கப்பட்ட வாய்ப் பட முன்னோட்டம்",
    changeImage: "படத்தை மாற்றவும்",
    selectImage: "வாய்ப் படத்தைத் தேர்ந்தெடுக்கவும்",
    browseDevice: "உங்கள் சாதனத்தில் இருந்து தேர்வு செய்யவும்",
    fileLimit: "JPG, JPEG, PNG அல்லது WEBP · அதிகபட்சம் 5 MB",
    ready: "தயார்",
    analysing: "படம் பகுப்பாய்வு செய்யப்படுகிறது...",
    analyseImage: "படத்தை பகுப்பாய்வு செய்யவும்",
    privacyTitle: "தனியுரிமை முன்னுரிமை செயலாக்கம்",
    privacyText: "அசல் வாய்ப் படம் நிரந்தரமாக சேமிக்கப்படாது. SHA-256 fingerprint மற்றும் கணிப்பு பதிவு மட்டுமே வைக்கப்படும்.",
    modelOutput: "மாதிரி வெளியீடு",
    predictionResult: "கணிப்பு முடிவு",
    noPrediction: "இன்னும் கணிப்பு இல்லை",
    noPredictionText: "வாய்ப் படத்தை பதிவேற்றி, கணிப்பும் பரிந்துரைகளும் பார்க்க படத்தை பகுப்பாய்வு செய்யவும்.",
    predictedCondition: "கணிக்கப்பட்ட நிலை",
    selectedBecause: "இந்த வகைக்கு அதிகபட்ச சாத்தியக்கூறு கிடைத்ததால் மாதிரி இதைத் தேர்ந்தெடுத்தது.",
    modelResult: "மாதிரி முடிவு",
    confidenceScore: "நம்பகத்தன்மை மதிப்பெண்",
    confidenceHelp: "இந்த பதிவேற்றப்பட்ட படத்திற்கான மாதிரி நம்பகத்தன்மை",
    confidenceInfo: "நம்பகத்தன்மை மதிப்பெண் இந்த பட வகைப்பாட்டை மாதிரி எவ்வளவு வலுவாக ஆதரிக்கிறது என்பதை காட்டுகிறது. அதிக மதிப்பெண் மருத்துவ நோயறிதலை உறுதிப்படுத்தாது.",
    probabilities: "கணிப்பு சாத்தியக்கூறுகள்",
    ranked: "அதிகத்திலிருந்து குறைவிற்கு",
    softmax: "Softmax வெளியீடு",
    predicted: "கணிக்கப்பட்டது",
    nextSteps: "பரிந்துரைக்கப்பட்ட அடுத்த படிகள்",
    conditionGuidance: "நிலையை சார்ந்த வழிகாட்டல்",
    medicalDisclaimer: "மருத்துவ மறுப்பு",
    totalRecords: "மொத்த பதிவுகள்",
    averageConfidence: "சராசரி நம்பகத்தன்மை",
    latestPrediction: "சமீபத்திய கணிப்பு",
    patientRecords: "நோயாளர் பதிவுகள்",
    historyTitle: "பட கணிப்பு வரலாறு",
    historyDescription: "உங்கள் முந்தைய பட பரிசோதனை முடிவுகளைப் பார்க்கவும், மதிப்பாய்வு செய்யவும் மற்றும் நிர்வகிக்கவும்.",
    loading: "ஏற்றுகிறது...",
    refresh: "புதுப்பிக்கவும்",
    loadingHistory: "கணிப்பு வரலாறு ஏற்றப்படுகிறது...",
    noPredictionRecords: "கணிப்பு பதிவுகள் இல்லை",
    noPredictionRecordsText: "உங்கள் வெற்றிகரமான பட கணிப்புகள் இங்கே தோன்றும்.",
    condition: "நிலை",
    confidence: "நம்பகத்தன்மை",
    filename: "கோப்பு பெயர்",
    duplicate: "நகல்",
    date: "தேதி",
    details: "விவரங்கள்",
    action: "செயல்",
    yes: "ஆம்",
    no: "இல்லை",
    view: "பார்க்க",
    delete: "அழிக்க",
    predictionDetails: "கணிப்பு விவரங்கள்",
    completeSavedInfo: "இந்த சேமிக்கப்பட்ட வாய்ப் பட கணிப்பிற்கான முழு தகவல்.",
    closePredictionDetails: "கணிப்பு விவரங்களை மூடவும்",
    duplicateUpload: "நகல் பதிவேற்றம்",
    classProbabilities: "வகுப்பு சாத்தியக்கூறுகள்",
    predictionDistribution: "கணிப்பு பகிர்வு",
    recommendations: "பரிந்துரைகள்",
    conditionActions: "நிலையை சார்ந்த வாய்ச் சுகாதார நடவடிக்கைகள்",
    fileType: "கோப்பு வகை",
    fileSize: "கோப்பு அளவு",
    modelVersion: "மாதிரி பதிப்பு",
    predictionDate: "கணிப்பு தேதி",
    close: "மூடவும்",
    invalidType: "JPG, JPEG, PNG மற்றும் WEBP படங்கள் மட்டும் அனுமதிக்கப்படுகின்றன.",
    tooLarge: "படம் 5 MB அல்லது அதற்கு குறைவாக இருக்க வேண்டும்.",
    selectImageError: "ஒரு வாய்ப் படத்தைத் தேர்ந்தெடுக்கவும்.",
    duplicateSuccess: "இந்தப் படம் முன்பு பகுப்பாய்வு செய்யப்பட்டது. புதிய பாதுகாப்பான வரலாறு பதிவு உருவாக்கப்பட்டது.",
    analysisSuccess: "பட பகுப்பாய்வு முடிந்து பாதுகாப்பாக சேமிக்கப்பட்டது.",
    deleteConfirm: "இந்த கணிப்பு பதிவை அழிக்கவா?",
    deleteSuccess: "கணிப்பு பதிவு வெற்றிகரமாக அழிக்கப்பட்டது.",
    classes: {
      calculus: "பல் கல்",
      gingivitis: "ஈறு அழற்சி",
      hypodontia: "ஹைப்போடோண்டியா",
    },
  },
};

const translateImageClass = (value, t) => {
  const normalized =
    String(value || "")
      .trim()
      .toLowerCase()
      .replaceAll(" ", "_");

  if (normalized.includes("calculus")) return t.classes.calculus;
  if (normalized.includes("gingivitis")) return t.classes.gingivitis;
  if (normalized.includes("hypodontia")) return t.classes.hypodontia;

  return value || "";
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

function formatDate(dateValue) {
  if (!dateValue) {
    return "Unavailable";
  }

  return new Date(dateValue).toLocaleString();
}

function formatFileSize(bytes) {
  if (!Number.isFinite(Number(bytes))) {
    return "Unavailable";
  }

  const size = Number(bytes);

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

function titleCase(value = "") {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}

function Icon({ name }) {
  const icons = {
    upload: (
      <path d="M12 16V4m0 0 4.5 4.5M12 4 7.5 8.5M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" />
    ),
    sparkles: (
      <>
        <path d="m12 3-1.2 3.3L7.5 7.5l3.3 1.2L12 12l1.2-3.3 3.3-1.2-3.3-1.2L12 3Z" />
        <path d="m5 13-.8 2.2L2 16l2.2.8L5 19l.8-2.2L8 16l-2.2-.8L5 13Z" />
        <path d="m19 12-.7 1.8-1.8.7 1.8.7L19 17l.7-1.8 1.8-.7-1.8-.7L19 12Z" />
      </>
    ),
    shield: (
      <path d="M12 3 5 6v5c0 4.4 2.9 8.4 7 10 4.1-1.6 7-5.6 7-10V6l-7-3Zm-3 9 2 2 4-4" />
    ),
    history: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5M12 7v5l3 2" />
      </>
    ),
    eye: (
      <>
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
      </>
    ),
    refresh: (
      <>
        <path d="M20 11a8 8 0 1 0-2 5.3" />
        <path d="M20 4v7h-7" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
    check: <path d="m5 12 4 4L19 6" />,
    file: (
      <>
        <path d="M6 3h8l4 4v14H6V3Z" />
        <path d="M14 3v5h5" />
      </>
    ),
    calendar: (
      <>
        <path d="M5 4h14v16H5V4ZM8 2v4M16 2v4M5 9h14" />
      </>
    ),
    brain: (
      <>
        <path d="M9.5 4.5A3 3 0 0 0 6 7.4 3.5 3.5 0 0 0 5.5 14a3 3 0 0 0 3.8 4.5M14.5 4.5A3 3 0 0 1 18 7.4a3.5 3.5 0 0 1 .5 6.6 3 3 0 0 1-3.8 4.5M12 3v18M9 9h3M12 15h3" />
      </>
    ),
  };

  return (
    <svg
      className="ui-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

export default function ImagePrediction() {
  const fileInputRef = useRef(null);

  const [currentUser, setCurrentUser] =
    useState(getStoredUser());

  const [selectedFile, setSelectedFile] =
    useState(null);
  const [previewUrl, setPreviewUrl] =
    useState("");
  const [result, setResult] =
    useState(null);
  const [history, setHistory] =
    useState([]);
  const [loading, setLoading] =
    useState(false);
  const [historyLoading, setHistoryLoading] =
    useState(true);
  const [error, setError] =
    useState("");
  const [message, setMessage] =
    useState("");
  const [selectedHistoryItem, setSelectedHistoryItem] =
    useState(null);
  const [detailsOpen, setDetailsOpen] =
    useState(false);
  const [activeView, setActiveView] =
    useState("analysis");
  const [guidelinesOpen, setGuidelinesOpen] =
    useState(false);

  useEffect(() => {
    const refreshCurrentUser = () => {
      setCurrentUser(getStoredUser());
    };

    window.addEventListener(
      "oralvista-user-updated",
      refreshCurrentUser
    );

    window.addEventListener(
      "storage",
      refreshCurrentUser
    );

    return () => {
      window.removeEventListener(
        "oralvista-user-updated",
        refreshCurrentUser
      );

      window.removeEventListener(
        "storage",
        refreshCurrentUser
      );
    };
  }, []);

  const languageCode =
    languageNameToCode(
      currentUser?.language
    );

  const t =
    imageTranslations[
      languageCode
    ] ||
    imageTranslations.en;

  const historySummary = useMemo(() => {
    const total = history.length;
    const averageConfidence = total
      ? history.reduce(
          (sum, item) =>
            sum + Number(item.confidence || 0),
          0
        ) / total
      : 0;
    const latest = history[0];

    return {
      total,
      averageConfidence,
      latestCondition:
        translateImageClass(latest?.displayName, t) || t.noRecords,
    };
  }, [history, t]);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape" && detailsOpen) {
        closePredictionDetails();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [detailsOpen]);

  async function loadHistory() {
    try {
      setHistoryLoading(true);

      const response =
        await getImagePredictionHistory();

      setHistory(response.predictions || []);
    } catch (requestError) {
      console.error(
        "History error:",
        requestError
      );
    } finally {
      setHistoryLoading(false);
    }
  }

  function clearSelectedImage() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl("");
    setResult(null);
    setMessage("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    setError("");
    setMessage("");
    setResult(null);

    if (!file) {
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(
        t.invalidType
      );
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(
        t.tooLarge
      );
      event.target.value = "";
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handlePrediction(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!selectedFile) {
      setError(t.selectImageError);
      return;
    }

    try {
      setLoading(true);

      const response = await predictOralImage(
        selectedFile
      );

      setResult(response.result);
      setMessage(
        response.duplicateImage
          ? t.duplicateSuccess
          : t.analysisSuccess
      );

      await loadHistory();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(predictionId) {
    const confirmed = window.confirm(
      t.deleteConfirm
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteImagePrediction(predictionId);
      setHistory((current) =>
        current.filter(
          (item) => item.id !== predictionId
        )
      );
      setMessage(
        t.deleteSuccess
      );

      if (selectedHistoryItem?.id === predictionId) {
        closePredictionDetails();
      }
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function openPredictionDetails(item) {
    setSelectedHistoryItem(item);
    setDetailsOpen(true);
    document.body.classList.add("modal-open");
  }

  function closePredictionDetails() {
    setDetailsOpen(false);
    setSelectedHistoryItem(null);
    document.body.classList.remove("modal-open");
  }

  return (
    <main className="image-prediction-page">
      <header className="image-page-header">
        <div className="hero-content">
          <span className="hero-pill">
            <Icon name="sparkles" />
            {t.heroBadge}
          </span>

          <h1>{t.heroTitle}</h1>

          <p>
            {t.heroDescription}
          </p>

          <div className="hero-highlights">
            <span>
              <Icon name="shield" />
              {t.secureProcessing}
            </span>
            <span>
              <Icon name="brain" />
              {t.model}
            </span>
            <span>
              <Icon name="history" />
              {t.privateHistory}
            </span>
          </div>
        </div>
      </header>

      <section className="workflow-strip" aria-label="Prediction workflow">
        <article>
          <span>01</span>
          <div>
            <strong>{t.upload}</strong>
            <small>{t.uploadHint}</small>
          </div>
        </article>
        <div className="workflow-line" />
        <article>
          <span>02</span>
          <div>
            <strong>{t.analyse}</strong>
            <small>{t.analyseHint}</small>
          </div>
        </article>
        <div className="workflow-line" />
        <article>
          <span>03</span>
          <div>
            <strong>{t.review}</strong>
            <small>{t.reviewHint}</small>
          </div>
        </article>
      </section>

      <section className="supported-classes-card" aria-label="Supported image classes">
        <div className="supported-classes-copy">
          <div className="supported-classes-heading">
            <span className="supported-classes-icon">
              <Icon name="brain" />
            </span>

            <div>
              <span className="supported-classes-eyebrow">
                {t.modelCoverage}
              </span>
              <h2>{t.supportedClasses}</h2>
            </div>
          </div>

          <p>
            {t.supportedDescription}
          </p>
        </div>

        <div className="supported-class-chips">
          <span>
            <strong>{t.calculus}</strong>
            <small>{t.calculusDesc}</small>
          </span>
          <span>
            <strong>{t.gingivitis}</strong>
            <small>{t.gingivitisDesc}</small>
          </span>
          <span>
            <strong>{t.hypodontia}</strong>
            <small>{t.hypodontiaDesc}</small>
          </span>
        </div>

        <div className="supported-classes-note">
          <Icon name="shield" />
          <span>
            {t.coverageNote}
          </span>
        </div>
      </section>

      <nav className="image-view-tabs" aria-label="Image prediction sections">
        <button
          type="button"
          className={activeView === "analysis" ? "is-active" : ""}
          onClick={() => setActiveView("analysis")}
        >
          <Icon name="sparkles" />
          {t.newAnalysis}
        </button>
        <button
          type="button"
          className={activeView === "history" ? "is-active" : ""}
          onClick={() => setActiveView("history")}
        >
          <Icon name="history" />
          {t.predictionHistory}
          <span className="tab-count">{historySummary.total}</span>
        </button>
      </nav>

      {activeView === "analysis" && (
      <section className="image-main-grid">
        <form
          className="image-card upload-card"
          onSubmit={handlePrediction}
        >
          <div className="card-heading">
            <div>
              <span className="step-number">1</span>
              <div>
                <p className="card-eyebrow">{t.imageInput}</p>
                <h2>{t.uploadOralImage}</h2>
              </div>
            </div>

            {selectedFile && (
              <button
                type="button"
                className="clear-button"
                onClick={clearSelectedImage}
              >
                {t.clear}
              </button>
            )}
          </div>

          <section className="photo-guidelines">
            <button
              type="button"
              className="photo-guidelines-toggle"
              onClick={() => setGuidelinesOpen((current) => !current)}
              aria-expanded={guidelinesOpen}
            >
              <span className="photo-guidelines-title">
                <Icon name="check" />
                {t.photoGuidelines}
              </span>
              <span className="photo-guidelines-summary">
                {t.photoSummary}
              </span>
              <span className={`guideline-chevron ${guidelinesOpen ? "is-open" : ""}`}>⌄</span>
            </button>

            {guidelinesOpen && (
              <div className="photo-guidelines-content">
                <ol>
                  <li><strong>{t.guideline1Title}</strong> {t.guideline1Text}</li>
                  <li><strong>{t.guideline2Title}</strong> {t.guideline2Text}</li>
                  <li><strong>{t.guideline3Title}</strong> {t.guideline3Text}</li>
                  <li><strong>{t.guideline4Title}</strong> {t.guideline4Text}</li>
                  <li><strong>{t.guideline5Title}</strong> {t.guideline5Text}</li>
                  <li><strong>{t.guideline6Title}</strong> {t.guideline6Text}</li>
                  <li><strong>{t.guideline7Title}</strong> {t.guideline7Text}</li>
                </ol>

                <div className="guideline-best-result">
                  <strong>{t.bestResults}</strong>
                  <span>{t.bestResultsText}</span>
                </div>
              </div>
            )}
          </section>

          <label
            htmlFor="oral-image"
            className={`image-upload-area ${
              previewUrl ? "has-preview" : ""
            }`}
          >
            {previewUrl ? (
              <>
                <img
                  src={previewUrl}
                  alt={t.selectedPreview}
                  className="image-preview"
                />
                <span className="change-image-badge">
                  <Icon name="upload" />
                  {t.changeImage}
                </span>
              </>
            ) : (
              <div className="upload-placeholder">
                <div className="upload-icon">
                  <Icon name="upload" />
                </div>
                <strong>{t.selectImage}</strong>
                <span>
                  {t.browseDevice}
                </span>
                <small>
                  {t.fileLimit}
                </small>
              </div>
            )}
          </label>

          <input
            ref={fileInputRef}
            id="oral-image"
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
            hidden
          />

          {selectedFile && (
            <div className="selected-file-info">
              <div className="selected-file-icon">
                <Icon name="file" />
              </div>
              <div className="selected-file-copy">
                <span>{selectedFile.name}</span>
                <small>
                  {formatFileSize(selectedFile.size)} · {selectedFile.type}
                </small>
              </div>
              <span className="file-ready-badge">
                {t.ready}
              </span>
            </div>
          )}

          {error && (
            <div
              className="status-message error-message"
              role="alert"
            >
              {error}
            </div>
          )}

          {message && (
            <div className="status-message success-message">
              <Icon name="check" />
              {message}
            </div>
          )}

          <button
            type="submit"
            className="analyse-button"
            disabled={loading || !selectedFile}
          >
            {loading ? (
              <>
                <span className="button-spinner" />
                {t.analysing}
              </>
            ) : (
              <>
                <Icon name="sparkles" />
                {t.analyseImage}
              </>
            )}
          </button>

          <div className="privacy-note">
            <Icon name="shield" />
            <div>
              <strong>{t.privacyTitle}</strong>
              <span>{t.privacyText}</span>
            </div>
          </div>
        </form>

        <section className="image-card result-card">
          <div className="card-heading">
            <div>
              <span className="step-number">2</span>
              <div>
                <p className="card-eyebrow">{t.modelOutput}</p>
                <h2>{t.predictionResult}</h2>
              </div>
            </div>
          </div>

          {!result ? (
            <div className="empty-result">
              <div className="result-orbit">
                <div className="result-placeholder-icon">
                  <Icon name="brain" />
                </div>
              </div>
              <h3>{t.noPrediction}</h3>
              <p>{t.noPredictionText}</p>
            </div>
          ) : (
            <div className="prediction-result">
              <div className="prediction-summary">
                <div>
                  <span className="prediction-label">
                    {t.predictedCondition}
                  </span>
                  <h3>{translateImageClass(result.displayName, t)}</h3>
                  <p>{t.selectedBecause}</p>
                </div>
                <span className="prediction-status-badge">
                  {t.modelResult}
                </span>
              </div>

              <div className="confidence-section">
                <div className="confidence-heading">
                  <div>
                    <span>{t.confidenceScore}</span>
                    <small>
                      {t.confidenceHelp}
                    </small>
                  </div>
                  <strong>
                    {Number(result.confidence).toFixed(2)}%
                  </strong>
                </div>

                <div className="confidence-track">
                  <div
                    className="confidence-fill"
                    style={{
                      width: `${Math.min(
                        Number(result.confidence),
                        100
                      )}%`,
                    }}
                  />
                </div>

                <div className="confidence-information">
                  <Icon name="shield" />
                  <span>{t.confidenceInfo}</span>
                </div>
              </div>

              <div className="probability-section">
                <div className="section-title-row">
                  <div>
                    <h4>{t.probabilities}</h4>
                    <small className="section-supporting-text">
                      {t.ranked}
                    </small>
                  </div>
                  <span>{t.softmax}</span>
                </div>

                <div className="probability-list">
                  {Object.entries(result.probabilities || {})
                    .sort(
                      ([, probabilityA], [, probabilityB]) =>
                        Number(probabilityB || 0) -
                        Number(probabilityA || 0)
                    )
                    .map(([className, probability], index) => {
                      const value = Number(probability || 0);
                      const isPredicted = index === 0;

                      return (
                        <div
                          className={`probability-item ${
                            isPredicted
                              ? "predicted-probability-item"
                              : ""
                          }`}
                          key={className}
                        >
                          <div className="probability-row">
                            <div className="probability-name">
                              <span
                                className={`probability-rank ${
                                  isPredicted ? "is-first" : ""
                                }`}
                              >
                                {index + 1}
                              </span>

                              <span>{translateImageClass(titleCase(className), t)}</span>

                              {isPredicted && (
                                <span className="probability-predicted-badge">
                                  {t.predicted}
                                </span>
                              )}
                            </div>

                            <strong>{value.toFixed(2)}%</strong>
                          </div>

                          <div className="mini-progress-track">
                            <div
                              className="mini-progress-fill"
                              style={{
                                width: `${Math.min(value, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="recommendations-section">
                <div className="section-title-row">
                  <h4>{t.nextSteps}</h4>
                  <span>{t.conditionGuidance}</span>
                </div>
                <ul>
                  {result.recommendations?.map(
                    (recommendation, index) => (
                      <li
                        key={`${recommendation}-${index}`}
                      >
                        <span className="recommendation-check">
                          <Icon name="check" />
                        </span>
                        {recommendation}
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div className="medical-disclaimer">
                <div className="disclaimer-icon">!</div>
                <div>
                  <strong>{t.medicalDisclaimer}</strong>
                  <p>{result.disclaimer}</p>
                </div>
              </div>
            </div>
          )}
        </section>
      </section>
      )}

      {activeView === "history" && (
      <>
      <section className="history-summary-grid">
        <article>
          <span className="summary-icon">
            <Icon name="history" />
          </span>
          <div>
            <small>{t.totalRecords}</small>
            <strong>{historySummary.total}</strong>
          </div>
        </article>
        <article>
          <span className="summary-icon">
            <Icon name="sparkles" />
          </span>
          <div>
            <small>{t.averageConfidence}</small>
            <strong>
              {historySummary.averageConfidence.toFixed(2)}%
            </strong>
          </div>
        </article>
        <article>
          <span className="summary-icon">
            <Icon name="brain" />
          </span>
          <div>
            <small>{t.latestPrediction}</small>
            <strong>{historySummary.latestCondition}</strong>
          </div>
        </article>
      </section>

      <section className="image-card history-card">
        <div className="history-header">
          <div>
            <p className="card-eyebrow">{t.patientRecords}</p>
            <h2>{t.historyTitle}</h2>
            <span>{t.historyDescription}</span>
          </div>

          <button
            type="button"
            className="refresh-button"
            onClick={loadHistory}
            disabled={historyLoading}
          >
            <Icon name="refresh" />
            {historyLoading ? t.loading : t.refresh}
          </button>
        </div>

        {historyLoading ? (
          <div className="history-state">
            <span className="large-spinner" />
            <p>{t.loadingHistory}</p>
          </div>
        ) : history.length === 0 ? (
          <div className="history-state">
            <Icon name="history" />
            <h3>{t.noPredictionRecords}</h3>
            <p>{t.noPredictionRecordsText}</p>
          </div>
        ) : (
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>{t.condition}</th>
                  <th>{t.confidence}</th>
                  <th>{t.filename}</th>
                  <th>{t.duplicate}</th>
                  <th>{t.date}</th>
                  <th>{t.details}</th>
                  <th>{t.action}</th>
                </tr>
              </thead>

              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="condition-badge">
                        {translateImageClass(item.displayName, t)}
                      </span>
                    </td>
                    <td>
                      <div className="table-confidence">
                        <strong>
                          {Number(item.confidence).toFixed(2)}%
                        </strong>
                        <div>
                          <span
                            style={{
                              width: `${Math.min(
                                Number(item.confidence),
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="filename-cell">
                        <Icon name="file" />
                        {item.originalFileName ||
                          t.unavailable}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`duplicate-badge ${
                          item.duplicateImage
                            ? "is-duplicate"
                            : "is-original"
                        }`}
                      >
                        {item.duplicateImage ? t.yes : t.no}
                      </span>
                    </td>
                    <td>
                      <span className="date-cell">
                        <Icon name="calendar" />
                        {formatDate(item.createdAt)}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="view-details-button"
                        onClick={() =>
                          openPredictionDetails(item)
                        }
                      >
                        <Icon name="eye" />
                        {t.view}
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="delete-history-button"
                        onClick={() =>
                          handleDelete(item.id)
                        }
                      >
                        <Icon name="trash" />
                        {t.delete}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      </>
      )}

      {detailsOpen && selectedHistoryItem && (
        <div
          className="prediction-modal-overlay"
          onClick={closePredictionDetails}
        >
          <section
            className="prediction-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="prediction-details-title"
          >
            <div className="modal-hero">
              <div>
                <span className="modal-label">
                  {t.predictionDetails}
                </span>
                <h2 id="prediction-details-title">
                  {translateImageClass(selectedHistoryItem.displayName, t)}
                </h2>
                <p>{t.completeSavedInfo}</p>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={closePredictionDetails}
                aria-label={t.closePredictionDetails}
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="details-summary-grid">
              <article>
                <small>{t.confidence}</small>
                <strong>
                  {Number(
                    selectedHistoryItem.confidence
                  ).toFixed(2)}%
                </strong>
              </article>
              <article>
                <small>{t.duplicateUpload}</small>
                <strong>
                  {selectedHistoryItem.duplicateImage
                    ? t.yes
                    : t.no}
                </strong>
              </article>
              <article>
                <small>Model</small>
                <strong>
                  {selectedHistoryItem.modelName ||
                    "EfficientNetB0"}
                </strong>
              </article>
            </div>

            <section className="modal-section">
              <div className="modal-section-heading">
                <h3>{t.classProbabilities}</h3>
                <span>{t.predictionDistribution}</span>
              </div>

              <div className="details-probability-list">
                {Object.entries(
                  selectedHistoryItem.probabilities || {}
                )
                  .sort(
                    ([, probabilityA], [, probabilityB]) =>
                      Number(probabilityB || 0) -
                      Number(probabilityA || 0)
                  )
                  .map(([className, probability], index) => (
                    <div
                      className={`details-probability-item ${
                        index === 0 ? "is-top-result" : ""
                      }`}
                      key={className}
                    >
                      <div>
                        <span>
                          {index + 1}. {titleCase(className)}
                          {index === 0 && (
                            <em className="modal-predicted-tag">
                              {t.predicted}
                            </em>
                          )}
                        </span>
                        <strong>
                          {Number(probability).toFixed(2)}%
                        </strong>
                      </div>
                      <div className="details-probability-track">
                        <span
                          style={{
                            width: `${Math.min(
                              Number(probability),
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </section>

            <section className="modal-section">
              <div className="modal-section-heading">
                <h3>{t.recommendations}</h3>
                <span>{t.conditionActions}</span>
              </div>

              <ul className="details-recommendation-list">
                {selectedHistoryItem.recommendations?.map(
                  (recommendation, index) => (
                    <li
                      key={`${recommendation}-${index}`}
                    >
                      <Icon name="check" />
                      {recommendation}
                    </li>
                  )
                )}
              </ul>
            </section>

            <section className="details-information-grid">
              <article>
                <span>{t.filename}</span>
                <strong>
                  {selectedHistoryItem.originalFileName ||
                    t.unavailable}
                </strong>
              </article>
              <article>
                <span>{t.fileType}</span>
                <strong>
                  {selectedHistoryItem.mimeType ||
                    t.unavailable}
                </strong>
              </article>
              <article>
                <span>{t.fileSize}</span>
                <strong>
                  {formatFileSize(
                    selectedHistoryItem.imageSizeBytes
                  )}
                </strong>
              </article>
              <article>
                <span>{t.modelVersion}</span>
                <strong>
                  {selectedHistoryItem.modelVersion ||
                    "1.0.0"}
                </strong>
              </article>
              <article className="wide-detail-item">
                <span>{t.predictionDate}</span>
                <strong>
                  {formatDate(
                    selectedHistoryItem.createdAt
                  )}
                </strong>
              </article>
            </section>

            <div className="modal-disclaimer">
              <div className="disclaimer-icon">!</div>
              <div>
                <strong>{t.medicalDisclaimer}</strong>
                <p>{selectedHistoryItem.disclaimer}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="modal-secondary-button"
                onClick={closePredictionDetails}
              >
                {t.close}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}