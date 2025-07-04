import React, { useState, useEffect } from 'react';

const gad7Questions = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it is hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid as if something awful might happen"
];

const phq9Questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading or watching television",
  "Moving or speaking so slowly that other people could have noticed? Or being so fidgety or restless that you have been moving a lot more than usual",
  "Thoughts that you would be better off dead or of hurting yourself in some way"
];

const options = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 }
];

function App() {
  const [screen, setScreen] = useState("home");
  const [gadAnswers, setGadAnswers] = useState(Array(7).fill(null));
  const [phqAnswers, setPhqAnswers] = useState(Array(9).fill(null));
  const [gadScore, setGadScore] = useState(null);
  const [phqScore, setPhqScore] = useState(null);
  const [mood, setMood] = useState("");
  const [moodHistory, setMoodHistory] = useState([]);
  const [scoreHistory, setScoreHistory] = useState([]);

  const motivationalQuotes = [
    "You've survived 100% of your worst days so far.",
    "Small steps every day lead to big changes.",
    "Your feelings are valid. Keep going.",
    "You are stronger than you think.",
    "Healing isn't linear — and that's okay.",
    "Take a deep breath. You're doing great.",
    "Progress is progress, no matter how small."
  ];
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Update page title
    document.title = "MediMind";
    
    // Create custom favicon
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Create radial gradient (dark blue inside, light blue outside)
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, '#1e40af'); // Dark blue
    gradient.addColorStop(1, '#93c5fd'); // Light blue
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, 2 * Math.PI);
    ctx.fill();
    
    // Update favicon
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = canvas.toDataURL();
    document.getElementsByTagName('head')[0].appendChild(link);
    
    // Set random quote
    const random = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[random]);
  }, []);

  const exportToPDF = () => {
    // Create a simple text-based report since html2pdf is not available
    const reportContent = `
MediMind Assessment Report
Date: ${new Date().toLocaleDateString()}

GAD-7 Anxiety Assessment:
Score: ${gadScore}
Level: ${getGADSeverity(gadScore)}

PHQ-9 Depression Assessment:
Score: ${phqScore}
Level: ${getPHQSeverity(phqScore)}

Note: This is a simplified report. For a complete PDF report, please use this tool in your own environment.
    `;
    
    // Create a downloadable text file
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MediMind_Report_${new Date().toLocaleDateString().replace(/\//g, "-")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getGADProgress = () => {
    const answered = gadAnswers.filter(val => val !== null).length;
    return Math.round((answered / 7) * 100);
  };

  const getPHQProgress = () => {
    const answered = phqAnswers.filter(val => val !== null).length;
    return Math.round((answered / 9) * 100);
  };

  const addToHistory = () => {
    const now = new Date().toLocaleDateString();
    const entry = {
      date: now,
      gadScore,
      gadLevel: getGADSeverity(gadScore),
      phqScore,
      phqLevel: getPHQSeverity(phqScore)
    };
    setScoreHistory(prev => [entry, ...prev]);
  };

  const addMoodEntry = () => {
    if (mood.trim() === "") {
      alert("Please enter your mood first.");
      return;
    }
    
    const now = new Date().toLocaleDateString();
    const entry = {
      date: now,
      mood: mood.trim()
    };
    setMoodHistory(prev => [entry, ...prev]);
    setMood("");
  };

  const handleGADChange = (index, value) => {
    const newAnswers = [...gadAnswers];
    newAnswers[index] = value;
    setGadAnswers(newAnswers);
  };

  const handlePHQChange = (index, value) => {
    const newAnswers = [...phqAnswers];
    newAnswers[index] = value;
    setPhqAnswers(newAnswers);
  };

  const submitGAD = () => {
    if (gadAnswers.includes(null)) {
      alert("Please answer all GAD-7 questions.");
      return;
    }
    const total = gadAnswers.reduce((a, b) => a + b, 0);
    setGadScore(total);
  };

  const submitPHQ = () => {
    if (phqAnswers.includes(null)) {
      alert("Please answer all PHQ-9 questions.");
      return;
    }
    const total = phqAnswers.reduce((a, b) => a + b, 0);
    setPhqScore(total);
    if (gadScore !== null) addToHistory();
  };

  const getGADSeverity = (score) => {
    if (score <= 4) return "Minimal Anxiety";
    if (score <= 9) return "Mild Anxiety";
    if (score <= 14) return "Moderate Anxiety";
    return "Severe Anxiety";
  };

  const getPHQSeverity = (score) => {
    if (score <= 4) return "Minimal Depression";
    if (score <= 9) return "Mild Depression";
    if (score <= 14) return "Moderate Depression";
    if (score <= 19) return "Moderately Severe Depression";
    return "Severe Depression";
  };

  // Modern styling
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    position: 'relative'
  };

  const headerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000,
    borderBottom: '1px solid rgba(226, 232, 240, 0.5)'
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1e40af',
    letterSpacing: '-0.025em'
  };

  const homeButtonStyle = {
    background: 'rgba(30, 64, 175, 0.1)',
    border: '1px solid rgba(30, 64, 175, 0.2)',
    borderRadius: '12px',
    padding: '0.5rem 1rem',
    color: '#1e40af',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(10px)'
  };

  const mainContentStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '6rem 2rem 3rem',
    minHeight: '100vh'
  };

  const heroStyle = {
    textAlign: 'center',
    marginBottom: '4rem'
  };

  const titleStyle = {
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    fontWeight: '300',
    color: '#1e293b',
    marginBottom: '1.5rem',
    lineHeight: '1.2',
    letterSpacing: '-0.02em'
  };

  const subtitleStyle = {
    fontSize: '1.25rem',
    color: '#64748b',
    marginBottom: '2rem',
    fontWeight: '400',
    lineHeight: '1.6'
  };

  const quoteStyle = {
    background: 'rgba(30, 64, 175, 0.05)',
    border: '1px solid rgba(30, 64, 175, 0.1)',
    borderRadius: '16px',
    padding: '1.5rem',
    fontStyle: 'italic',
    color: '#475569',
    fontSize: '1.1rem',
    marginBottom: '3rem',
    backdropFilter: 'blur(10px)'
  };

  const primaryButtonStyle = {
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    border: 'none',
    borderRadius: '16px',
    padding: '1rem 2rem',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 20px rgba(30, 64, 175, 0.3)',
    margin: '0.5rem',
    minWidth: '200px'
  };

  const secondaryButtonStyle = {
    background: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid rgba(30, 64, 175, 0.2)',
    borderRadius: '16px',
    padding: '1rem 2rem',
    color: '#1e40af',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    margin: '0.5rem',
    minWidth: '200px',
    backdropFilter: 'blur(10px)'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '20px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  };

  const progressBarStyle = {
    background: 'rgba(226, 232, 240, 0.5)',
    height: '8px',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '1rem'
  };

  const progressFillStyle = (progress, color) => ({
    width: `${progress}%`,
    height: '100%',
    background: `linear-gradient(90deg, ${color} 0%, ${color}aa 100%)`,
    transition: 'width 0.3s ease',
    borderRadius: '4px'
  });

  const questionStyle = {
    background: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    border: '1px solid rgba(226, 232, 240, 0.5)',
    backdropFilter: 'blur(5px)'
  };

  const radioGroupStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '0.5rem',
    marginTop: '1rem'
  };

  const radioLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: 'rgba(248, 250, 252, 0.5)',
    border: '1px solid rgba(226, 232, 240, 0.3)'
  };

  const resultCardStyle = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
    borderRadius: '20px',
    padding: '2rem',
    marginTop: '2rem',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  };

return (
  <div style={containerStyle}>
    {/* Fixed Header */}
    <header style={headerStyle}>
      <div style={logoStyle}>MediMind</div>
      {screen !== "home" && (
        <button
          style={homeButtonStyle}
          onClick={() => setScreen("home")}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(30, 64, 175, 0.15)';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(30, 64, 175, 0.1)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Home
        </button>
      )}
    </header>
    
    {/* Main Content */}
    <div style={mainContentStyle}>
      {screen === "home" && (
        <div>
          <div style={heroStyle}>
            <h1 style={titleStyle}>
              I'm MediMind, an AI-powered mental health assessment tool.
            </h1>
            <p style={subtitleStyle}>
              Take validated assessments to better understand your mental health and get personalized insights.
            </p>
          </div>

          <div style={quoteStyle}>
            "{quote}"
          </div>

          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <button 
              style={primaryButtonStyle}
              onClick={() => setScreen("gad")}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 30px rgba(30, 64, 175, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 20px rgba(30, 64, 175, 0.3)';
              }}
            >
              ✨ Start anxiety assessment
            </button>
            <br />
            <button 
              style={secondaryButtonStyle}
              onClick={() => setScreen("phq")}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
              }}
            >
              🧠 Start depression assessment
            </button>
            <br />
            <button 
              style={secondaryButtonStyle}
              onClick={() => setScreen("mood")}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
              }}
            >
              📝 Daily mood tracker
            </button>
          </div>

          <div style={cardStyle}>
            <h2 style={{ color: '#1e293b', marginBottom: '1rem' }}>🌟 Mental Health Resources</h2>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <a href="https://988lifeline.org/" target="_blank" rel="noopener noreferrer" style={{ color: '#1e40af', textDecoration: 'none', padding: '0.5rem 0' }}>
                988 Suicide & Crisis Lifeline
              </a>
              <a href="https://www.nami.org/Your-Journey/Kids-Teens-and-Young-Adults" target="_blank" rel="noopener noreferrer" style={{ color: '#1e40af', textDecoration: 'none', padding: '0.5rem 0' }}>
                NAMI: Support for Teens & Young Adults
              </a>
              <a href="https://www.talkspace.com/blog/mental-health-resources-for-teens/" target="_blank" rel="noopener noreferrer" style={{ color: '#1e40af', textDecoration: 'none', padding: '0.5rem 0' }}>
                Talkspace: Mental Health for Teens
              </a>
              <a href="https://jedfoundation.org/" target="_blank" rel="noopener noreferrer" style={{ color: '#1e40af', textDecoration: 'none', padding: '0.5rem 0' }}>
                JED Foundation – Mental Health & Suicide Prevention
              </a>
            </div>
          </div>

          {gadScore !== null && phqScore !== null && (
            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={exportToPDF} 
                style={{
                  ...primaryButtonStyle,
                  backgroundColor: '#10b981',
                  background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                  boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)'
                }}
              >
                📄 Download latest report
              </button>
            </div>
          )}
        </div>
      )}

      {screen === "gad" && (
        <div>
          <div style={heroStyle}>
            <h1 style={titleStyle}>GAD-7 Anxiety Assessment</h1>
            <p style={subtitleStyle}>Answer these questions based on how you've felt over the past 2 weeks.</p>
          </div>

          <div style={cardStyle}>
            <div style={progressBarStyle}>
              <div style={progressFillStyle(getGADProgress(), '#10b981')}></div>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '2rem' }}>
              {getGADProgress()}% complete
            </p>

            {gad7Questions.map((q, i) => (
              <div key={i} style={questionStyle}>
                <h3 style={{ color: '#1e293b', marginBottom: '1rem', fontSize: '1.1rem' }}>
                  {i + 1}. {q}
                </h3>
                <div style={radioGroupStyle}>
                  {options.map((opt, j) => (
                    <label 
                      key={j} 
                      style={{
                        ...radioLabelStyle,
                        backgroundColor: gadAnswers[i] === opt.value ? 'rgba(30, 64, 175, 0.1)' : 'rgba(248, 250, 252, 0.5)',
                        borderColor: gadAnswers[i] === opt.value ? '#1e40af' : 'rgba(226, 232, 240, 0.3)'
                      }}
                    >
                      <input
                        type="radio"
                        name={`gad${i}`}
                        value={opt.value}
                        checked={gadAnswers[i] === opt.value}
                        onChange={() => handleGADChange(i, opt.value)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button 
                style={primaryButtonStyle} 
                onClick={submitGAD}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 30px rgba(30, 64, 175, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 20px rgba(30, 64, 175, 0.3)';
                }}
              >
                Submit GAD-7 Assessment
              </button>
            </div>
          </div>

          {gadScore !== null && (
            <div style={resultCardStyle} id="results-summary">
              <h2 style={{ color: '#1e293b', marginBottom: '1rem' }}>Your GAD-7 Results</h2>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e40af', marginBottom: '0.5rem' }}>
                Score: {gadScore}
              </div>
              <div style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                marginBottom: '1.5rem',
                color: gadScore <= 4 ? '#10b981' : gadScore <= 9 ? '#f59e0b' : gadScore <= 14 ? '#f97316' : '#ef4444'
              }}>
                {getGADSeverity(gadScore)}
              </div>
              {phqScore !== null && (
                <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(226, 232, 240, 0.5)' }}>
                  <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Your PHQ-9 Results</h3>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e40af', marginBottom: '0.5rem' }}>
                    Score: {phqScore}
                  </div>
                  <div style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '600', 
                    marginBottom: '1rem',
                    color: phqScore <= 4 ? '#10b981' : phqScore <= 9 ? '#f59e0b' : phqScore <= 14 ? '#f97316' : phqScore <= 19 ? '#f97316' : '#ef4444'
                  }}>
                    {getPHQSeverity(phqScore)}
                  </div>
                </div>
              )}
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button
                  onClick={exportToPDF}
                  style={{
                    ...primaryButtonStyle,
                    backgroundColor: '#10b981',
                    background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  📄 Download Report
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {screen === "phq" && (
        <div>
          <div style={heroStyle}>
            <h1 style={titleStyle}>PHQ-9 Depression Assessment</h1>
            <p style={subtitleStyle}>Answer these questions based on how you've felt over the past 2 weeks.</p>
          </div>

          <div style={cardStyle}>
            <div style={progressBarStyle}>
              <div style={progressFillStyle(getPHQProgress(), '#3b82f6')}></div>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '2rem' }}>
              {getPHQProgress()}% complete
            </p>

            {phq9Questions.map((q, i) => (
              <div key={i} style={questionStyle}>
                <h3 style={{ color: '#1e293b', marginBottom: '1rem', fontSize: '1.1rem' }}>
                  {i + 1}. {q}
                </h3>
                <div style={radioGroupStyle}>
                  {options.map((opt, j) => (
                    <label 
                      key={j} 
                      style={{
                        ...radioLabelStyle,
                        backgroundColor: phqAnswers[i] === opt.value ? 'rgba(30, 64, 175, 0.1)' : 'rgba(248, 250, 252, 0.5)',
                        borderColor: phqAnswers[i] === opt.value ? '#1e40af' : 'rgba(226, 232, 240, 0.3)'
                      }}
                    >
                      <input
                        type="radio"
                        name={`phq${i}`}
                        value={opt.value}
                        checked={phqAnswers[i] === opt.value}
                        onChange={() => handlePHQChange(i, opt.value)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button 
                style={primaryButtonStyle} 
                onClick={submitPHQ}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 30px rgba(30, 64, 175, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 20px rgba(30, 64, 175, 0.3)';
                }}
              >
                Submit PHQ-9 Assessment
              </button>
            </div>
          </div>

          {phqScore !== null && (
            <div style={resultCardStyle} id="results-summary">
              <h2 style={{ color: '#1e293b', marginBottom: '1rem' }}>Your PHQ-9 Results</h2>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e40af', marginBottom: '0.5rem' }}>
                Score: {phqScore}
              </div>
              <div style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                marginBottom: '1.5rem',
                color: phqScore <= 4 ? '#10b981' : phqScore <= 9 ? '#f59e0b' : phqScore <= 14 ? '#f97316' : phqScore <= 19 ? '#f97316' : '#ef4444'
              }}>
                {getPHQSeverity(phqScore)}
              </div>
              {gadScore !== null && (
                <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(226, 232, 240, 0.5)' }}>
                  <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Your GAD-7 Results</h3>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e40af', marginBottom: '0.5rem' }}>
                    Score: {gadScore}
                  </div>
                  <div style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '600', 
                    marginBottom: '1rem',
                    color: gadScore <= 4 ? '#10b981' : gadScore <= 9 ? '#f59e0b' : gadScore <= 14 ? '#f97316' : '#ef4444'
                  }}>
                    {getGADSeverity(gadScore)}
                  </div>
                </div>
              )}
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button
                  onClick={exportToPDF}
                  style={{
                    ...primaryButtonStyle,
                    backgroundColor: '#10b981',
                    background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  📄 Download Report
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {screen === "mood" && (
        <div>
          <div style={heroStyle}>
            <h1 style={titleStyle}>Daily Mood Tracker</h1>
            <p style={subtitleStyle}>Track your daily mood and build awareness of your mental health patterns.</p>
          </div>
          
          <div style={cardStyle}>
            <div style={{ marginBottom: '2rem' }}>
              <input
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="How are you feeling today?"
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1.1rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(226, 232, 240, 0.5)',
                  backgroundColor: 'rgba(248, 250, 252, 0.5)',
                  marginBottom: '1rem'
                }}
              />
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => {
                    if (mood.trim()) {
                      const today = new Date().toLocaleDateString();
                      setMoodHistory(prev => [{ date: today, mood }, ...prev]);
                      setMood("");
                    }
                  }}
                  style={primaryButtonStyle}
                >
                  Save Mood
                </button>
              </div>
            </div>
            
            {moodHistory.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>📅 Mood History</h3>
                <ul>
                  {moodHistory.map((entry, i) => (
                    <li key={i} style={{ marginBottom: '0.5rem', color: '#475569' }}>
                      <strong>{entry.date}:</strong> {entry.mood}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
)
}

export default App;