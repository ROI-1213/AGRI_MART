import { Product } from '@/types';
import { extractProductSpecs } from '@/lib/productSpecs';
import { formatCategoryName } from '@/lib/format';

export interface LocalizedBrochure {
  language: string;
  langCode: 'en' | 'kn' | 'te';
  langBadge: string;
  companyName: string;
  subHeader: string;
  docType: string;
  productTitle: string;
  riplCode: string;
  brand: string;
  categoryLabel: string;
  codeLabel: string;
  brandLabel: string;
  overviewTitle: string;
  description: string;
  featuresTitle: string;
  features: string[];
  specsTitle: string;
  specs: Array<{ label: string; value: string }>;
  commercial: {
    mrpLabel: string;
    mrpValue: string;
    mrpSub: string;
    availLabel: string;
    availVal: string;
    availSub: string;
    subsidyLabel: string;
    subsidyVal: string;
    subsidySub: string;
  };
  accessoriesTitle: string;
  sparesTitle: string;
  footerNotice: {
    company: string;
    address: string;
    note: string;
    helplineLabel: string;
    helpline: string;
    email: string;
    web: string;
  };
}

export function getLocalizedBrochure(
  product: Product,
  rawLang: string = 'English',
  customTitle?: string
): LocalizedBrochure {
  const normLang = (rawLang || '').toLowerCase().trim();
  const isKannada = normLang === 'kannada' || normLang === 'kn';
  const isTelugu = normLang === 'telugu' || normLang === 'te';
  const rawSpecs = extractProductSpecs(product);

  const isDeepDrip = /deep\s*drip/i.test(product.name || '') || /ddp/i.test(product.name || '');

  // 1. KANNADA EDITION
  if (isKannada) {
    const kannadaSpecs = isDeepDrip
      ? [
          { label: 'ಉತ್ಪನ್ನ ಮಾದರಿ', value: `${product.name} (ಡೀಪ್ ಡ್ರಿಪ್ ಸ್ಟೇಕ್ಸ್)` },
          { label: 'ಉದ್ದ / ಗಾತ್ರ', value: '19 ಇಂಚು / 48 ಸೆಂ.ಮೀ. (ಮಣ್ಣಿನೊಳಗೆ ಆಳವಾಗಿ ಸ್ಥಾಪನೆ)' },
          { label: 'ಸಾಮಗ್ರಿ / ವಸ್ತು', value: 'ಬಾಳಿಕೆ ಬರುವ UV-ಸ್ಥಿರೀಕೃತ ABS ಎಂಜಿನಿಯರಿಂಗ್ ಪ್ಲಾಸ್ಟಿಕ್' },
          { label: 'ನೀರಿನ ಉಳಿತಾಯ', value: 'ಶೇ. 50% ವರೆಗೆ ನೀರಿನ ಸಂರಕ್ಷಣೆ (Water Conservation)' },
          { label: 'ಕನೆಕ್ಷನ್ ಹೊಂದಾಣಿಕೆ', value: 'ಸ್ಟ್ಯಾಂಡರ್ಡ್ 1/4" ಡ್ರಿಪ್ ಎಮಿಟರ್ ಮತ್ತು ಪೈಪ್‌ಗೆ ಸೂಕ್ತ' },
          { label: 'ಬಳಕೆ ಕ್ಷೇತ್ರ', value: 'ಅಡಿಕೆ, ತೆಂಗು, ದಾಳಿಂಬೆ, ಮಾವು & ಎಲ್ಲಾ ಹಣ್ಣಿನ ತೋಟಗಳು' },
          { label: 'ವರ್ಗ', value: 'ನೀರಾವರಿ ಪರಿಕರಗಳು (IRRIGATION)' },
          { label: 'ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ', value: 'SMAM ಯೋಜನೆಯಡಿ ಕೃಷಿ ಯಾಂತ್ರೀಕರಣ ಸಬ್ಸಿಡಿಗೆ ಅರ್ಹತೆ' }
        ]
      : rawSpecs.map((s) => ({
          label: translateSpecLabelToKannada(s.label),
          value: s.value
        }));

    const kannadaFeatures = isDeepDrip
      ? [
          'ನೇರವಾಗಿ ಗಿಡ-ಮರಗಳ ಬೇರುಗಳಿಗೆ ನೀರು, ದ್ರವ ಗೊಬ್ಬರ ಮತ್ತು ಆಮ್ಲಜನಕ ಪೂರೈಕೆ',
          'ಸಾಂಪ್ರದಾಯಿಕ ನೀರಾವರಿಗೆ ಹೋಲಿಸಿದರೆ ಶೇ. 50% ವರೆಗೆ ನೀರಿನ ಉಳಿತಾಯ',
          'ಮೇಲ್ಮೈ ಕಳೆಗಳ (Weeds) ಬೆಳವಣಿಗೆಯನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ತಡೆಗಟ್ಟುತ್ತದೆ',
          'ಬೇರುಗಳು ಮಣ್ಣಿನಲ್ಲಿ ಆಳವಾಗಿ ಮತ್ತು ಬಲಿಷ್ಠವಾಗಿ ಬೆಳೆಯಲು ನೆರವಾಗುತ್ತದೆ',
          'ಬರಗಾಲದಲ್ಲೂ ತೋಟಗಾರಿಕೆ ಬೆಳೆಗಳನ್ನು ರಕ್ಷಿಸಿ ನೀರಿನ ಆವಿಯಾಗುವಿಕೆ ತಡೆಯುತ್ತದೆ',
          'ಅಳವಡಿಕೆ ಮತ್ತು ನಿರ್ವಹಣೆ ಅತ್ಯಂತ ಸುಲಭವಾಗಿದ್ದು ದೀರ್ಘಕಾಲ ಬಾಳಿಕೆ ಬರುತ್ತದೆ'
        ]
      : [
          'ರತ್ನಗಿರಿ ಇಂಪೆಕ್ಸ್ ಸಂಸ್ಥೆಯ ಅಧಿಕೃತ ಗುಣಮಟ್ಟದ ಕೃಷಿ ಯಂತ್ರೋಪಕರಣ',
          'ಗರಿಷ್ಠ ದಕ್ಷತೆ ಮತ್ತು ಇಂಧನ/ವಿದ್ಯುತ್ ಉಳಿತಾಯದೊಂದಿಗೆ ಅತ್ಯುತ್ತಮ ಕಾರ್ಯಕ್ಷಮತೆ',
          'ರೈತರ ಶ್ರಮವನ್ನು ಕಡಿಮೆ ಮಾಡಿ ಕೃಷಿ ಉತ್ಪಾದಕತೆಯನ್ನು ಹೆಚ್ಚಿಸುವ ವಿನ್ಯಾಸ',
          'ಅಧಿಕೃತ RIPL ಬಿಡಿಭಾಗಗಳು ಮತ್ತು ಸಮಗ್ರ ಸೇವಾ ಜಾಲದ ಬೆಂಬಲ'
        ];

    return {
      language: 'Kannada',
      langCode: 'kn',
      langBadge: 'ಕನ್ನಡ (Kannada)',
      companyName: 'ರತ್ನಗಿರಿ ಇಂಪೆಕ್ಸ್ ಪ್ರೈವೇಟ್ ಲಿಮಿಟೆಡ್',
      subHeader: 'ಅಗ್ರಿಮಾರ್ಟ್ - ಭಾರತದ ಪ್ರಮುಖ ಕೃಷಿ ಯಂತ್ರೋಪಕರಣ ಸಂಸ್ಥೆ',
      docType: customTitle || 'ಅಧಿಕೃತ ಕೃಷಿ ಸಲಕರಣೆ ಕರಪತ್ರ (Official Equipment Technical Leaflet)',
      productTitle: isDeepDrip
        ? 'AM - ಡೀಪ್ ಡ್ರಿಪ್ ನೀರಾವರಿ ಸ್ಟೇಕ್ಸ್ (Deep Drip Irrigation Stakes)'
        : product.name,
      riplCode: product.riplCode,
      brand: product.brand,
      categoryLabel: 'ನೀರಾವರಿ / ಕೃಷಿ ಉಪಕರಣ',
      codeLabel: 'ಕೋಡ್',
      brandLabel: 'ಬ್ರ್ಯಾಂಡ್',
      overviewTitle: 'ಉತ್ಪನ್ನದ ಮಹತ್ವ ಮತ್ತು ವಿವರಣೆ (Product Overview & Benefits)',
      description: isDeepDrip
        ? 'ಡೀಪ್ ಡ್ರಿಪ್ ಇನ್ಫಿಲ್ಟ್ರೇಶನ್ ನೀರಾವರಿ ಸಾಧನವು (Deep Drip Irrigation Stakes) ನೀರು, ದ್ರವ ರಸಗೊಬ್ಬರ ಮತ್ತು ಆಮ್ಲಜನಕವನ್ನು ನೇರವಾಗಿ ಗಿಡ-ಮರಗಳ ಬೇರುಗಳಿಗೆ ತಲುಪಿಸುತ್ತದೆ. ಸಾಂಪ್ರದಾಯಿಕ ಮೇಲ್ಮೈ ನೀರಾವರಿಗೆ ಹೋಲಿಸಿದರೆ ಶೇ. 50 ರಷ್ಟು ನೀರನ್ನು ಉಳಿಸುತ್ತದೆ. ಆವಿಯಾಗುವಿಕೆ ಮತ್ತು ನೀರಿನ ಹರಿವಿನ ನಷ್ಟವನ್ನು ಸಂಪೂರ್ಣ ತಡೆಯುತ್ತದೆ. ಬೇರುಗಳು ಮಣ್ಣಿನಲ್ಲಿ ಆಳವಾಗಿ ಮತ್ತು ಬಲಿಷ್ಠವಾಗಿ ಬೆಳೆಯಲು ಉತ್ತೇಜಿಸುತ್ತದೆ, ಕಳೆಗಳ ಬೆಳವಣಿಗೆಯನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ ಮತ್ತು ಬರಗಾಲ ಪರಿಸ್ಥಿತಿಯಲ್ಲೂ ತೋಟಗಾರಿಕೆ ಬೆಳೆಗಳು ಸಮೃದ್ಧವಾಗಿ ಬೆಳೆಯಲು ನೆರವಾಗುತ್ತದೆ.'
        : (product.description || 'ರತ್ನಗಿರಿ ಇಂಪೆಕ್ಸ್ ಅಧಿಕೃತ ಕೃಷಿ ಯಂತ್ರೋಪಕರಣ.'),
      featuresTitle: 'ಪ್ರಮುಖ ವೈಶಿಷ್ಟ್ಯಗಳು ಮತ್ತು ಉಪಯೋಗಗಳು (Key Features & Highlights)',
      features: kannadaFeatures,
      specsTitle: 'ತಾಂತ್ರಿಕ ವಿಶೇಷಣಗಳು (Technical Specifications)',
      specs: kannadaSpecs,
      commercial: {
        mrpLabel: 'ಬೆಲೆ (MRP)',
        mrpValue: product.mrp > 0 ? `₹${product.mrp.toLocaleString('en-IN')}` : 'ದರ ವಿನಂತಿಯ ಮೇರೆಗೆ',
        mrpSub: 'ಎಲ್ಲಾ ತೆರಿಗೆಗಳು ಸೇರಿವೆ',
        availLabel: 'ಲಭ್ಯತೆ',
        availVal: 'ಸ್ಟಾಕ್‌ನಲ್ಲಿದೆ',
        availSub: 'ಸಮಗ್ರ ಭಾರತ ವಿತರಣೆ',
        subsidyLabel: 'ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ',
        subsidyVal: 'SMAM ಅರ್ಹತೆ',
        subsidySub: 'ಕೇಂದ್ರ / ರಾಜ್ಯ ಕೃಷಿ ಸಬ್ಸಿಡಿ'
      },
      accessoriesTitle: 'ಒಳಗೊಂಡಿರುವ ಅಧಿಕೃತ ಪರಿಕರಗಳು (Included Standard Accessories)',
      sparesTitle: 'ಲಭ್ಯವಿರುವ ಮೂಲ ಬಿಡಿಭಾಗಗಳು (Genuine Spare Parts Available)',
      footerNotice: {
        company: 'ರತ್ನಗಿರಿ ಇಂಪೆಕ್ಸ್ ಪ್ರೈವೇಟ್ ಲಿಮಿಟೆಡ್ (ಅಗ್ರಿಮಾರ್ಟ್)',
        address: 'ಅನ್ನಪೂರ್ಣೇಶ್ವರಿ ಕಾಂಪ್ಲೆಕ್ಸ್, ಸರ್ವೆ ನಂ. 28/1, ದೊಡ್ಡಕಲ್ಲಸಂದ್ರ, ಕನಕಪುರ ಮುಖ್ಯ ರಸ್ತೆ, ಬೆಂಗಳೂರು - 560062',
        note: 'ಎಲ್ಲಾ ವಿಶೇಷಣಗಳು ಅಧಿಕೃತ ತಯಾರಕರ ತಾಂತ್ರಿಕ ದಾಖಲೆಗಳಿಂದ ಪ್ರಮಾಣೀಕರಿಸಲ್ಪಟ್ಟಿವೆ.',
        helplineLabel: 'ರಾಷ್ಟ್ರೀಯ ಉಚಿತ ಸಹಾಯವಾಣಿ',
        helpline: '7393 938 938',
        email: 'customercare@ratnagiriimpex.com',
        web: 'www.agrimart.in'
      }
    };
  }

  // 2. TELUGU EDITION
  if (isTelugu) {
    const teluguSpecs = isDeepDrip
      ? [
          { label: 'ఉత్పత్తి మోడల్', value: `${product.name} (డీప్ డ్రిప్ స్టేక్స్)` },
          { label: 'పొడవు / పరిమాణం', value: '19 అంగుళాలు / 48 సెం.మీ (భూమి లోపల అమరిక)' },
          { label: 'తయారీ మెటీరియల్', value: 'దీర్ఘకాలం మన్నే UV-స్టెబిలైజ్డ్ ABS ప్లాస్టిక్' },
          { label: 'నీటి ఆదా సామర్థ్యం', value: 'సుమారు 50% వరకు నీటి సంరక్షణ (Water Conservation)' },
          { label: 'కనెక్షన్ అనుకూలత', value: 'స్టాండర్డ్ 1/4" డ్రిప్ లైన్ మరియు ఎమిట్టర్‌కు సరిపోతుంది' },
          { label: 'అనుకూల పంటలు', value: 'పండ్ల తోటలు, కొబ్బరి, మామిడి, పామాయిల్ మరియు చెట్లు' },
          { label: 'విభాగం', value: 'సూక్ష్మ నీటిపారుదల పరికరాలు (IRRIGATION)' },
          { label: 'ప్రభుత్వ సబ్సిడీ', value: 'SMAM పథకం కింద వ్యవసాయ సబ్సిడీకి అర్హత' }
        ]
      : rawSpecs.map((s) => ({
          label: translateSpecLabelToTelugu(s.label),
          value: s.value
        }));

    const teluguFeatures = isDeepDrip
      ? [
          'చెట్లు మరియు మొక్కల వేర్లకు నేరుగా నీరు, ద్రవ ఎరువులు మరియు ప్రాణవాయువు సరఫరా',
          'సాధారణ నీటిపారుదల కంటే సుమారు 50% వరకు నీటి ఆదా మరియు కరెంట్ బిల్లు తగ్గింపు',
          'పై మట్టిలో కలుపు మొక్కల (Weeds) సమస్యను పూర్తిగా నివారిస్తుంది',
          'వేర్లు భూమి లోపలికి లోతుగా మరియు బలంగా పెరగడానికి దోహదపడుతుంది',
          'కరవు పరిస్థితులలో కూడా తోటలు పచ్చగా ఉండి అధిక దిగుబడి సాధించడానికి సహకరిస్తుంది',
          'సులభమైన అమరిక, UV నిరోధకత మరియు సుదీర్ఘకాల మన్నిక'
        ]
      : [
          'రత్నగిరి ఇంప్లెక్స్ సంస్థ యొక్క అధికారిక నాణ్యతా వ్యవసాయ యంత్రం',
          'గరిష్ట సామర్థ్యం మరియు ఇంధన/విద్యుత్ పొదుపుతో అత్యుత్తమ పనితీరు',
          'రైతుల శ్రమను తగ్గించి వ్యవసాయ ఉత్పాదకతను పెంచే ఆధునిక సాంకేతికత',
          'అసలైన RIPL స్పేర్ పార్ట్స్ మరియు దేశవ్యాప్త సర్వీస్ సపోర్ట్'
        ];

    return {
      language: 'Telugu',
      langCode: 'te',
      langBadge: 'తెలుగు (Telugu)',
      companyName: 'రత్నగిరి ఇంప్లెక్స్ ప్రైవేట్ లిమిటెడ్',
      subHeader: 'అగ్రిమార్ట్ - భారతదేశపు అగ్రగామి వ్యవసాయ యంత్రాల సంస్థ',
      docType: customTitle || 'అధికారిక వ్యవసాయ పరికరాల సమాచార పత్రం (Official Technical Leaflet)',
      productTitle: isDeepDrip
        ? 'AM - డీప్ డ్రిప్ ఇరిగేషన్ స్టేక్స్ (Deep Drip Irrigation Stakes)'
        : product.name,
      riplCode: product.riplCode,
      brand: product.brand,
      categoryLabel: 'నీటిపారుదల / వ్యవసాయ పరికరాలు',
      codeLabel: 'కోడ్',
      brandLabel: 'బ్రాండ్',
      overviewTitle: 'ఉత్పత్తి వివరణ మరియు ప్రయోజనాలు (Product Overview & Benefits)',
      description: isDeepDrip
        ? 'రత్నగిరి ఇంప్లెక్స్ (Ratnagiri Impex) వారు అందిస్తున్న డీప్ డ్రిప్ ఇరిగేషన్ స్టేక్స్ (Deep Drip Irrigation Stakes) చెట్లు మరియు మొక్కల వేర్ల వ్యవస్థకు నేరుగా నీరు, ద్రవ ఎరువులు మరియు ప్రాణవాయువును (ఆక్సిజన్) అందించడానికి ప్రత్యేకంగా రూపొందించబడింది. సాధారణ నీటిపారుదల కంటే ఇది సుమారు 50% వరకు నీటిని ఆదా చేస్తుంది. ఆవిరి కావడం మరియు నీటి వృధాను పూర్తిగా నివారిస్తుంది. మొక్కల వేర్లు లోతుగా, బలంగా పెరగడానికి దోహదపడతాయి. ఇది కలుపు మొక్కలను నివారిస్తుంది మరియు కరవు పరిస్థితులలో కూడా తోటలను కాపాడుతుంది.'
        : (product.description || 'రత్నగిరి ఇంప్లెక్స్ అధికారిక వ్యవసాయ పరికరం.'),
      featuresTitle: 'ప్రధాన ప్రయోజనాలు మరియు ప్రత్యేకతలు (Key Features & Highlights)',
      features: teluguFeatures,
      specsTitle: 'సాంకేతిక వివరాలు (Technical Specifications)',
      specs: teluguSpecs,
      commercial: {
        mrpLabel: 'ధర (MRP)',
        mrpValue: product.mrp > 0 ? `₹${product.mrp.toLocaleString('en-IN')}` : 'ధర అభ్యర్థనపై లభ్యం',
        mrpSub: 'అన్ని పన్నులతో కలిపి',
        availLabel: 'లభ్యత',
        availVal: 'స్టాక్‌లో ఉంది',
        availSub: 'భారతదేశ వ్యాప్తంగా డెలివరీ',
        subsidyLabel: 'ప్రభుత్వ సబ్సిడీ',
        subsidyVal: 'SMAM అర్హత',
        subsidySub: 'కేంద్ర / రాష్ట్ర సబ్సిడీ'
      },
      accessoriesTitle: 'చేర్చబడిన అధికారిక ఉపకరణాలు (Included Standard Accessories)',
      sparesTitle: 'అందుబాటులో ఉన్న అసలైన స్పేర్ పార్ట్స్ (Genuine Spare Parts)',
      footerNotice: {
        company: 'రత్నగిరి ఇంప్లెక్స్ ప్రైవేట్ లిమిటెడ్ (అగ్రిమార్ట్)',
        address: 'అన్నపూర్ణేశ్వరి కాంప్లెక్స్, సర్వే నం. 28/1, దొడ్డకల్లాసంద్ర, కనకపుర మెయిన్ రోడ్, బెంగళూరు - 560062',
        note: 'అన్ని సాంకేతిక వివరాలు అధికారిక తయారీదారు రికార్డుల నుండి ప్రామాణీకరించబడ్డాయి.',
        helplineLabel: 'జాతీయ ఉచిత హెల్ప్‌లైన్',
        helpline: '7393 938 938',
        email: 'customercare@ratnagiriimpex.com',
        web: 'www.agrimart.in'
      }
    };
  }

  // 3. ENGLISH EDITION (DEFAULT)
  const englishFeatures = isDeepDrip
    ? [
        'Delivers water, liquid fertilizers, and oxygen directly to the root zone',
        'Saves up to 50% of water compared to traditional surface irrigation',
        'Eliminates surface evaporation and runoff waste completely',
        'Encourages strong, deep taproots that withstand severe drought',
        'Suppresses surface weed proliferation and lowers irrigation pumping costs',
        'Heavy-duty UV-stabilized ABS construction with standard 1/4" drip line compatibility'
      ]
    : [
        'Genuine Ratnagiri Impex high-durability agricultural machinery',
        'Engineered for maximum fuel and power efficiency under demanding farm conditions',
        'Ergonomic design reducing operator fatigue and increasing daily field productivity',
        'Backed by pan-India RIPL spare parts availability and authorized dealer network'
      ];

  return {
    language: 'English',
    langCode: 'en',
    langBadge: 'English',
    companyName: 'RATNAGIRI IMPEX PVT. LTD.',
    subHeader: 'AGRIMART - India’s Leading Agricultural Machinery Platform',
    docType: customTitle || 'Official Equipment Technical Leaflet',
    productTitle: product.name,
    riplCode: product.riplCode,
    brand: product.brand,
    categoryLabel: formatCategoryName(product.category),
    codeLabel: 'CODE',
    brandLabel: 'BRAND',
    overviewTitle: 'Product Overview & Specifications',
    description: isDeepDrip
      ? 'The Deep Drip Irrigation Stakes by Ratnagiri Impex deliver water, liquid fertilizers, and oxygen straight to plant and tree roots. They help save up to 50% of water by preventing surface evaporation and runoff, while encouraging deep root growth to protect trees against drought and stress.'
      : (product.description || 'Authentic Ratnagiri Impex agricultural machinery.'),
    featuresTitle: 'Key Technical Features & Highlights',
    features: englishFeatures,
    specsTitle: 'Technical Specifications',
    specs: rawSpecs,
    commercial: {
      mrpLabel: 'MRP',
      mrpValue: product.mrp > 0 ? `₹${product.mrp.toLocaleString('en-IN')}` : 'Price on Request',
      mrpSub: 'Incl. all taxes',
      availLabel: 'Availability',
      availVal: product.availability || 'In Stock',
      availSub: 'Pan-India Delivery',
      subsidyLabel: 'Govt. Subsidy',
      subsidyVal: 'SMAM Eligible',
      subsidySub: 'Central/State Farm Subsidy'
    },
    accessoriesTitle: 'Included Standard Accessories',
    sparesTitle: 'Genuine Spare Parts Available',
    footerNotice: {
      company: 'RATNAGIRI IMPEX PVT. LTD. (AGRIMART)',
      address: 'Annapurneshwari Complex, Survey No. 28/1, Doddakallasandra, Kanakapura Main Road, Bengaluru - 560062',
      note: 'All technical data and specifications are authentic manufacturer specifications.',
      helplineLabel: 'National Helpline',
      helpline: '7393 938 938',
      email: 'customercare@ratnagiriimpex.com',
      web: 'www.agrimart.in'
    }
  };
}

function translateSpecLabelToKannada(label: string): string {
  const l = label.toLowerCase();
  if (l.includes('tank') || l.includes('bag') || l.includes('capacity')) return 'ಟ್ಯಾಂಕ್ / ಚೀಲ ಸಾಮರ್ಥ್ಯ';
  if (l.includes('power') || l.includes('output')) return 'ಎಂಜಿನ್ ಪವರ್ / ಸಾಮರ್ಥ್ಯ';
  if (l.includes('battery')) return 'ಬ್ಯಾಟರಿ ವಿಶೇಷಣೆ';
  if (l.includes('displacement')) return 'ಎಂಜಿನ್ ಡಿಸ್ಪ್ಲೇಸ್‌ಮೆಂಟ್ (CC)';
  if (l.includes('engine')) return 'ಎಂಜಿನ್ ಮಾದರಿ';
  if (l.includes('air') && l.includes('volume')) return 'ಗಾಳಿಯ ಪ್ರಮಾಣ (Air Volume)';
  if (l.includes('speed')) return 'ಗರಿಷ್ಠ ವೇಗ';
  if (l.includes('weight')) return 'ತೂಕ (Weight)';
  if (l.includes('width')) return 'ಕೆಲಸದ ಅಗಲ (Working Width)';
  if (l.includes('category')) return 'ವರ್ಗ (Category)';
  if (l.includes('subsidy')) return 'ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ (Subsidy)';
  return label;
}

function translateSpecLabelToTelugu(label: string): string {
  const l = label.toLowerCase();
  if (l.includes('tank') || l.includes('bag') || l.includes('capacity')) return 'ట్యాంక్ / బ్యాగ్ సామర్థ్యం';
  if (l.includes('power') || l.includes('output')) return 'ఇంజిన్ పవర్ / సామర్థ్యం';
  if (l.includes('battery')) return 'బ్యాటరీ స్పెసిఫికేషన్';
  if (l.includes('displacement')) return 'ఇంజిన్ డిస్‌ప్లేస్‌మెంట్ (CC)';
  if (l.includes('engine')) return 'ఇంజిన్ రకం';
  if (l.includes('air') && l.includes('volume')) return 'గాలి పరిమాణం (Air Volume)';
  if (l.includes('speed')) return 'గరిష్ట వేగం';
  if (l.includes('weight')) return 'బరువు (Weight)';
  if (l.includes('width')) return 'పని వెడల్పు (Working Width)';
  if (l.includes('category')) return 'విభాగం (Category)';
  if (l.includes('subsidy')) return 'ప్రభుత్వ సబ్సిడీ (Subsidy)';
  return label;
}
