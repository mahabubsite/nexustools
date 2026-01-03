import React, { lazy, Suspense, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useParams, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AllTools from './pages/AllTools';
import { getToolBySlug } from './data/tools';
import { AuthProvider } from './context/AuthContext';
import { db } from './firebase';
import { doc, setDoc, increment } from 'firebase/firestore';

// New Pages
const Auth = lazy(() => import('./pages/Auth'));
const Profile = lazy(() => import('./pages/Profile'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const ReportFeedback = lazy(() => import('./pages/ReportFeedback'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost')); // New Import
const Pricing = lazy(() => import('./pages/Pricing'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const PaymentMethods = lazy(() => import('./pages/PaymentMethods'));
const PaymentSubmit = lazy(() => import('./pages/PaymentSubmit'));
const AdminPayment = lazy(() => import('./pages/AdminPayment'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
import { Privacy, Terms } from './pages/Legal'; 

// Lazy load tool implementations...
// TEXT
const CaseConverter = lazy(() => import('./tools/text/CaseConverter'));
const WordCounter = lazy(() => import('./tools/text/WordCounter'));
const TextToSpeech = lazy(() => import('./tools/text/TextToSpeech'));
const DuplicateRemover = lazy(() => import('./tools/text/DuplicateRemover'));
const EmailExtractor = lazy(() => import('./tools/text/EmailExtractor'));
const Alphabetizer = lazy(() => import('./tools/text/Alphabetizer'));
const TextUtilities = lazy(() => import('./tools/text/TextUtilities')); 
const StringTools = lazy(() => import('./tools/text/StringTools')); 

// GENERATOR
const PasswordGenerator = lazy(() => import('./tools/generator/PasswordGenerator'));
const UuidGenerator = lazy(() => import('./tools/generator/UuidGenerator'));
const LoremIpsum = lazy(() => import('./tools/generator/LoremIpsum'));
const HashGenerator = lazy(() => import('./tools/generator/HashGenerator'));
const SignatureGenerator = lazy(() => import('./tools/generator/SignatureGenerator'));
const SlugGenerator = lazy(() => import('./tools/generator/SlugGenerator'));
const RandomNumber = lazy(() => import('./tools/generator/RandomNumber'));
const LinkGenerators = lazy(() => import('./tools/generator/LinkGenerators')); 
const UtmBuilder = lazy(() => import('./tools/generator/UtmBuilder'));

// DEVELOPER
const JsonFormatter = lazy(() => import('./tools/dev/JsonFormatter'));
const UrlParser = lazy(() => import('./tools/dev/UrlParser'));
const HtmlEntityConverter = lazy(() => import('./tools/dev/HtmlEntityConverter'));
const Minifiers = lazy(() => import('./tools/dev/Minifiers')); 
const SqlFormatter = lazy(() => import('./tools/dev/SqlFormatter'));
const UserAgentParser = lazy(() => import('./tools/dev/UserAgentParser'));

// PREVIEW
const CodePlayground = lazy(() => import('./tools/preview/CodePlayground'));

// CONVERTER
const Base64Converter = lazy(() => import('./tools/converter/Base64Converter'));
const UrlEncoder = lazy(() => import('./tools/converter/UrlEncoder'));
const ColorConverter = lazy(() => import('./tools/converter/ColorConverter'));
const BinaryConverter = lazy(() => import('./tools/converter/BinaryConverter'));
const NumberToWords = lazy(() => import('./tools/converter/NumberToWords'));

// IMAGE
const ImageConverter = lazy(() => import('./tools/image/ImageConverter'));
const ImageResizer = lazy(() => import('./tools/image/ImageResizer'));

// CHECKER
const PasswordStrength = lazy(() => import('./tools/checker/PasswordStrength'));
const IpLookup = lazy(() => import('./tools/checker/IpLookup'));
const DnsLookup = lazy(() => import('./tools/checker/DnsLookup'));
const Checkers = lazy(() => import('./tools/checker/Checkers')); 

// MISC
const QrCodeGenerator = lazy(() => import('./tools/misc/QrCodeGenerator'));
const QrCodeReader = lazy(() => import('./tools/misc/QrCodeReader'));
const SocialPickers = lazy(() => import('./tools/misc/SocialPickers'));

// TIME
const UnixTimestamp = lazy(() => import('./tools/time/UnixTimestamp'));

// DOWNLOAD
const YoutubeThumbnail = lazy(() => import('./tools/download/YoutubeThumbnail'));
const SocialDownloader = lazy(() => import('./tools/download/SocialDownloader'));


const ToolWrapper: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const toolMetadata = slug ? getToolBySlug(slug) : undefined;

  useEffect(() => {
    if (slug && toolMetadata) {
        try {
            const saved = localStorage.getItem('recent_tools');
            let tools: string[] = saved ? JSON.parse(saved) : [];
            tools = tools.filter(t => t !== slug);
            tools.unshift(slug);
            tools = tools.slice(0, 4);
            localStorage.setItem('recent_tools', JSON.stringify(tools));
        } catch (e) {
            console.error("Failed to save recent tools", e);
        }
    }
  }, [slug, toolMetadata]);

  if (!toolMetadata) {
    return <div className="p-12 text-center text-slate-400">Tool not found</div>;
  }

  // Map slug to component
  let ToolComponent;
  let subToolProp = '';

  switch (slug) {
    case 'youtube-thumbnail-downloader': ToolComponent = YoutubeThumbnail; break;
    case 'youtube-video-downloader': ToolComponent = SocialDownloader; subToolProp = 'YouTube'; break;
    case 'facebook-video-downloader': ToolComponent = SocialDownloader; subToolProp = 'Facebook'; break;
    case 'tiktok-video-downloader': ToolComponent = SocialDownloader; subToolProp = 'TikTok'; break;
    case 'instagram-video-downloader': ToolComponent = SocialDownloader; subToolProp = 'Instagram'; break;
    case 'instagram-image-downloader': ToolComponent = SocialDownloader; subToolProp = 'Instagram Image'; break;
    case 'dailymotion-video-downloader': ToolComponent = SocialDownloader; subToolProp = 'Dailymotion'; break;
    case 'threads-video-downloader': ToolComponent = SocialDownloader; subToolProp = 'Threads'; break;
    case 'vimeo-video-downloader': ToolComponent = SocialDownloader; subToolProp = 'Vimeo'; break;
    case 'case-converter': ToolComponent = CaseConverter; break;
    case 'word-counter': ToolComponent = WordCounter; break;
    case 'text-to-speech': ToolComponent = TextToSpeech; break;
    case 'duplicate-line-remover': ToolComponent = DuplicateRemover; break;
    case 'email-extractor': ToolComponent = EmailExtractor; break;
    case 'alphabetizer': ToolComponent = Alphabetizer; break;
    case 'list-randomizer': ToolComponent = Alphabetizer; break; 
    case 'text-separator': ToolComponent = TextUtilities; subToolProp='separator'; break;
    case 'url-extractor': ToolComponent = TextUtilities; subToolProp='extractor'; break;
    case 'text-size-calculator': ToolComponent = TextUtilities; subToolProp='size'; break;
    case 'reverse-text': ToolComponent = StringTools; subToolProp='reverse'; break;
    case 'emoji-remover': ToolComponent = StringTools; subToolProp='emoji'; break;
    case 'upside-down-text': ToolComponent = StringTools; subToolProp='upsidedown'; break;
    case 'palindrome-checker': ToolComponent = StringTools; subToolProp='palindrome'; break;
    case 'password-generator': ToolComponent = PasswordGenerator; break;
    case 'uuid-generator': ToolComponent = UuidGenerator; break;
    case 'lorem-ipsum-generator': ToolComponent = LoremIpsum; break;
    case 'hash-generator': ToolComponent = HashGenerator; break;
    case 'signature-generator': ToolComponent = SignatureGenerator; break;
    case 'slug-generator': ToolComponent = SlugGenerator; break;
    case 'random-number': ToolComponent = RandomNumber; break;
    case 'utm-builder': ToolComponent = UtmBuilder; break;
    case 'mailto-generator': ToolComponent = LinkGenerators; subToolProp='mailto'; break;
    case 'whatsapp-link-generator': ToolComponent = LinkGenerators; subToolProp='whatsapp'; break;
    case 'json-formatter': ToolComponent = JsonFormatter; break;
    case 'url-parser': ToolComponent = UrlParser; break;
    case 'html-entity-converter': ToolComponent = HtmlEntityConverter; break;
    case 'sql-formatter': ToolComponent = SqlFormatter; break;
    case 'user-agent-parser': ToolComponent = UserAgentParser; break;
    case 'html-minifier': ToolComponent = Minifiers; subToolProp='html'; break;
    case 'css-minifier': ToolComponent = Minifiers; subToolProp='css'; break;
    case 'js-minifier': ToolComponent = Minifiers; subToolProp='js'; break;
    case 'code-playground': ToolComponent = CodePlayground; break;
    case 'base64-encode-decode': ToolComponent = Base64Converter; break;
    case 'url-encode-decode': ToolComponent = UrlEncoder; break;
    case 'color-converter': ToolComponent = ColorConverter; break;
    case 'binary-converter': ToolComponent = BinaryConverter; break;
    case 'number-to-words': ToolComponent = NumberToWords; break;
    case 'image-converter': ToolComponent = ImageConverter; break;
    case 'image-resizer': ToolComponent = ImageResizer; break;
    case 'password-strength-checker': ToolComponent = PasswordStrength; break;
    case 'ip-lookup': ToolComponent = IpLookup; break;
    case 'dns-lookup': ToolComponent = DnsLookup; break;
    case 'whois-lookup': ToolComponent = Checkers; subToolProp='whois'; break;
    case 'http-headers-lookup': ToolComponent = Checkers; subToolProp='headers'; break;
    case 'qr-code-generator': ToolComponent = QrCodeGenerator; break;
    case 'qr-code-reader': ToolComponent = QrCodeReader; break;
    case 'unix-timestamp': ToolComponent = UnixTimestamp; break;
    case 'facebook-comment-picker': ToolComponent = SocialPickers; subToolProp='facebook-comment'; break;
    case 'youtube-comment-picker': ToolComponent = SocialPickers; subToolProp='youtube-comment'; break;
    case 'facebook-like-picker': ToolComponent = SocialPickers; subToolProp='facebook-like'; break;
    default:
      return <div className="p-12 text-center text-slate-400">Tool not found</div>;
  }

  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-40">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
      </div>
    }>
      {/* @ts-ignore */}
      <ToolComponent metadata={toolMetadata} subTool={subToolProp} />
    </Suspense>
  );
};

const App: React.FC = () => {
  // Track views
  useEffect(() => {
    const incrementViews = async () => {
      try {
        const statsRef = doc(db, 'stats', 'general');
        await setDoc(statsRef, { totalViews: increment(1) }, { merge: true });
      } catch (e) { 
        // silently fail on network error or permission issue
      }
    };
    incrementViews();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tools" element={<AllTools />} />
            <Route path="/category/:categoryId" element={<AllTools />} /> 
            <Route path="/tool/:slug" element={<ToolWrapper />} />
            
            {/* New Pages */}
            <Route path="/auth" element={<Suspense fallback={<div></div>}><Auth /></Suspense>} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<Suspense fallback={<div></div>}><About /></Suspense>} />
            <Route path="/contact" element={<Suspense fallback={<div></div>}><Contact /></Suspense>} />
            <Route path="/report" element={<Suspense fallback={<div></div>}><ReportFeedback /></Suspense>} />
            <Route path="/blog" element={<Suspense fallback={<div></div>}><Blog /></Suspense>} />
            <Route path="/blog/:id" element={<Suspense fallback={<div></div>}><BlogPost /></Suspense>} />
            <Route path="/pricing" element={<Suspense fallback={<div></div>}><Pricing /></Suspense>} />
            <Route path="/roadmap" element={<Suspense fallback={<div></div>}><Roadmap /></Suspense>} />
            
            {/* Payment & Admin Routes */}
            <Route path="/payment/methods" element={<Suspense fallback={<div></div>}><PaymentMethods /></Suspense>} />
            <Route path="/payment/submit" element={<Suspense fallback={<div></div>}><PaymentSubmit /></Suspense>} />
            <Route path="/admin/payments" element={<Suspense fallback={<div></div>}><AdminPayment /></Suspense>} />
            <Route path="/admin/dashboard" element={<Suspense fallback={<div></div>}><AdminDashboard /></Suspense>} />

            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;