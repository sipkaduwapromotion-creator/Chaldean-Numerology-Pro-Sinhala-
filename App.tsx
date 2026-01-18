
import React, { useState } from 'react';
import { calculateNumerology } from './utils/numerology';
import { generateDetailedReading } from './services/geminiService';
import { NumerologyResults, UserInput } from './types';

const App: React.FC = () => {
  const [formData, setFormData] = useState<UserInput>({ fullName: '', dob: '' });
  const [results, setResults] = useState<NumerologyResults | null>(null);
  const [reading, setReading] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.dob) return;

    setLoading(true);
    const res = calculateNumerology(formData.fullName, formData.dob);
    setResults(res);
    
    const detailedReading = await generateDetailedReading(formData, res);
    setReading(detailedReading);
    setLoading(false);
  };

  const downloadReport = () => {
    if (!results || !reading) return;

    const reportHtml = `
      <!DOCTYPE html>
      <html lang="si">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${formData.fullName} - සංඛ්‍යා විද්‍යා වාර්තාව</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;700&display=swap" rel="stylesheet">
          <style>
              body { 
                  font-family: 'Noto Sans Sinhala', sans-serif; 
                  background-color: #f1f5f9; 
                  color: #1e293b;
                  line-height: 1.6;
              }
              .report-container {
                  max-width: 850px;
                  margin: 2rem auto;
                  background: white;
                  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                  border-radius: 1.5rem;
                  overflow: hidden;
              }
              .gradient-header {
                  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
                  color: white;
                  padding: 3rem 2rem;
                  text-align: center;
              }
              .content-padding {
                  padding: 2.5rem;
              }
              .stat-card {
                  background: #f8fafc;
                  border: 1px solid #e2e8f0;
                  border-radius: 1rem;
                  padding: 1.25rem;
                  text-align: center;
              }
              .section-divider {
                  height: 2px;
                  background: linear-gradient(to right, #3b82f6, transparent);
                  margin: 2rem 0 1.5rem 0;
              }
              .reading-box {
                  white-space: pre-wrap;
                  color: #334155;
                  font-size: 1.1rem;
              }
              .breakdown-badge {
                  display: inline-flex;
                  flex-direction: column;
                  align-items: center;
                  background: #f1f5f9;
                  padding: 4px 8px;
                  border-radius: 6px;
                  margin: 2px;
                  border: 1px solid #e2e8f0;
              }
              @media print {
                  body { background: white; }
                  .report-container { box-shadow: none; margin: 0; max-width: 100%; }
                  .no-print { display: none; }
              }
          </style>
      </head>
      <body>
          <div class="report-container">
              <div class="gradient-header">
                  <i class="fas fa-dharmachakra text-5xl mb-4"></i>
                  <h1 class="text-3xl font-bold mb-2">චැල්ඩියන් සංඛ්‍යා විද්‍යා වාර්තාව</h1>
                  <p class="text-blue-100 opacity-90">${new Date().toLocaleDateString('si-LK')}</p>
              </div>

              <div class="content-padding">
                  <div class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                          <h2 class="text-2xl font-bold text-slate-800">${formData.fullName}</h2>
                          <p class="text-slate-500">උපන් දිනය: ${formData.dob}</p>
                      </div>
                      <button onclick="window.print()" class="no-print bg-slate-800 text-white px-5 py-2 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2">
                          <i class="fas fa-print"></i> මුද්‍රණය කරන්න
                      </button>
                  </div>

                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                      <div class="stat-card">
                          <p class="text-xs uppercase font-bold text-slate-400 mb-1">ජීවන මාර්ගය</p>
                          <p class="text-2xl font-bold text-blue-600">${results.lifePath}</p>
                      </div>
                      <div class="stat-card">
                          <p class="text-xs uppercase font-bold text-slate-400 mb-1">නාම අංකය</p>
                          <p class="text-2xl font-bold text-purple-600">${results.destinyNumber}</p>
                      </div>
                      <div class="stat-card">
                          <p class="text-xs uppercase font-bold text-slate-400 mb-1">ආත්මීය අභිලාෂය</p>
                          <p class="text-2xl font-bold text-rose-600">${results.soulUrgeNumber}</p>
                      </div>
                      <div class="stat-card">
                          <p class="text-xs uppercase font-bold text-slate-400 mb-1">පරිණත අංකය</p>
                          <p class="text-2xl font-bold text-emerald-600">${results.maturityNumber}</p>
                      </div>
                  </div>

                  <div class="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-10">
                      <h3 class="text-blue-800 font-bold mb-4 flex items-center gap-2">
                          <i class="fas fa-star"></i> විශේෂ වාසනාවන්ත තොරතුරු
                      </h3>
                      <div class="grid md:grid-cols-3 gap-6">
                          <div>
                              <p class="text-xs font-bold text-blue-400 uppercase">වාසනාවන්ත අංක</p>
                              <p class="font-bold text-slate-800">${results.luckyNumbers}</p>
                          </div>
                          <div>
                              <p class="text-xs font-bold text-blue-400 uppercase">වාසනාවන්ත දවස්</p>
                              <p class="font-bold text-slate-800">${results.luckyDays}</p>
                          </div>
                          <div>
                              <p class="text-xs font-bold text-blue-400 uppercase">ශක්ති අවධිය</p>
                              <p class="font-bold text-slate-800">${results.energyPhase}</p>
                          </div>
                      </div>
                  </div>

                  <div class="section-divider"></div>
                  <h3 class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                      <i class="fas fa-scroll text-blue-500"></i> දීර්ඝ පලාපල විස්තරය
                  </h3>
                  
                  <div class="reading-box prose prose-slate max-w-none">
                      ${reading}
                  </div>

                  <div class="mt-12 pt-8 border-t border-slate-100 text-center text-slate-400 text-sm italic">
                      වාර්තාව සකස් කළේ Chaldean Numerology Pro මගිනි.
                  </div>
              </div>
          </div>
      </body>
      </html>
    `;

    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.fullName.replace(/\s+/g, '_')}_Numerology_Report.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pb-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-slate-100 font-sans">
      <header className="max-w-4xl mx-auto pt-12 text-center">
        <div className="inline-block p-4 rounded-full bg-blue-500/10 mb-6 border border-blue-500/20">
          <i className="fas fa-om text-5xl text-blue-400"></i>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-blue-400 mb-2">
          චැල්ඩියන් සංඛ්‍යා විද්‍යා කැල්කියුලේටරය
        </h1>
        <p className="text-slate-400 text-lg">අංක විද්‍යාව මගින් ඔබේ ජීවිතයේ සැඟවුණු රහස් හඳුනාගන්න.</p>
      </header>

      <main className="max-w-4xl mx-auto mt-10">
        <section className="bg-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-700">
          <form onSubmit={handleCalculate} className="space-y-8">
            <div className="space-y-6">
              <div className="w-full">
                <label className="block text-lg font-bold text-blue-300 mb-3">
                  සම්පූර්ණ නම (ඉංග්‍රීසියෙන්)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: John Smith Perera"
                  className="w-full bg-slate-900 border-2 border-slate-600 rounded-2xl px-6 py-5 focus:outline-none focus:ring-4 focus:ring-blue-500/50 text-white placeholder-slate-500 text-2xl font-bold transition-all"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
                <p className="mt-2 text-sm text-slate-500">නම නිවැරදිව ඇතුලත් කිරීම පලාපල වල නිවැරදි භාවයට ඉතා වැදගත් වේ.</p>
              </div>

              <div className="md:w-1/2">
                <label className="block text-sm font-medium text-slate-300 mb-2">උපන් දිනය</label>
                <input
                  type="date"
                  required
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-lg"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-extrabold rounded-2xl transition-all shadow-xl shadow-blue-500/20 text-xl flex items-center justify-center gap-3 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1"
            >
              {loading ? (
                <>
                  <i className="fas fa-circle-notch fa-spin"></i> පලාපල සකසමින්...
                </>
              ) : (
                <>
                  <i className="fas fa-dharmachakra"></i> පලාපල බලන්න
                </>
              )}
            </button>
          </form>
        </section>

        {results && !loading && (
          <div className="mt-12 space-y-10 animate-fade-in pb-20">
            <div className="bg-blue-600/10 border border-blue-500/30 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6">
              <div className="bg-blue-500 p-4 rounded-xl text-white">
                <i className="fas fa-bolt text-2xl"></i>
              </div>
              <div>
                <h3 className="text-blue-300 text-sm font-bold uppercase tracking-widest">නමේ වර්තමාන ශක්ති අවධිය</h3>
                <p className="text-2xl font-bold">{results.energyPhase}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ResultCard title="ජීවන මාර්ගය" value={results.lifePath} icon="fa-road" color="text-yellow-400" />
              <ResultCard title="නාම අංකය" value={results.destinyNumber} icon="fa-signature" color="text-purple-400" />
              <ResultCard title="වාසනාවන්ත අංක" value={results.luckyNumbers} icon="fa-dice" color="text-emerald-400" />
              <ResultCard title="වාසනාවන්ත දවස්" value={results.luckyDays} icon="fa-calendar-check" color="text-blue-400" />
            </div>

            {/* Enhanced Compound Numbers Section */}
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <i className="fas fa-calculator text-blue-400"></i> නමේ සංයුක්ත අංක විග්‍රහය (Compound Breakdown)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Vowels */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-slate-700 pb-2">
                      <h4 className="text-rose-400 font-bold flex items-center gap-2">
                        <i className="fas fa-comment-dots"></i> ස්වර (Vowels) - ආත්මීය ශක්තිය
                      </h4>
                      <span className="text-2xl font-bold text-white">{results.nameBreakdown.vowelSum}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {results.nameBreakdown.vowels.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center bg-slate-900 border border-slate-700 rounded-lg p-2 min-w-[40px]">
                          <span className="text-lg font-bold text-rose-300 uppercase">{item.char}</span>
                          <span className="text-xs text-slate-500">{item.value}</span>
                        </div>
                      ))}
                      {results.nameBreakdown.vowels.length === 0 && <p className="text-slate-500 italic text-sm">ස්වර හමු නොවීය</p>}
                    </div>
                  </div>

                  {/* Consonants */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-slate-700 pb-2">
                      <h4 className="text-emerald-400 font-bold flex items-center gap-2">
                        <i className="fas fa-shield-alt"></i> ව්‍යංජන (Consonants) - පෞරුෂ ශක්තිය
                      </h4>
                      <span className="text-2xl font-bold text-white">{results.nameBreakdown.consonantSum}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {results.nameBreakdown.consonants.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center bg-slate-900 border border-slate-700 rounded-lg p-2 min-w-[40px]">
                          <span className="text-lg font-bold text-emerald-300 uppercase">{item.char}</span>
                          <span className="text-xs text-slate-500">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
                   <div className="flex items-center gap-4">
                     <div className="text-center bg-slate-900 px-4 py-2 rounded-xl border border-slate-700">
                        <div className="text-[10px] text-slate-500 uppercase">ස්වර එකතුව</div>
                        <div className="text-xl font-bold text-rose-400">{results.nameBreakdown.vowelSum}</div>
                     </div>
                     <span className="text-2xl text-slate-600">+</span>
                     <div className="text-center bg-slate-900 px-4 py-2 rounded-xl border border-slate-700">
                        <div className="text-[10px] text-slate-500 uppercase">ව්‍යංජන එකතුව</div>
                        <div className="text-xl font-bold text-emerald-400">{results.nameBreakdown.consonantSum}</div>
                     </div>
                   </div>
                   <div className="flex items-center gap-4 bg-blue-600/20 px-6 py-3 rounded-2xl border border-blue-500/30">
                      <div className="text-right">
                        <div className="text-xs text-blue-300 font-bold uppercase">මුළු නාම සංයුක්ත අංකය</div>
                        <div className="text-3xl font-black text-white">{results.compoundNumbers.name}</div>
                      </div>
                      <i className="fas fa-equals text-2xl text-blue-400"></i>
                      <div className="text-center">
                         <div className="text-xs text-blue-300 font-bold uppercase">නාම අංකය</div>
                         <div className="text-3xl font-black text-blue-400">{results.destinyNumber}</div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-amber-400">
                  <i className="fas fa-star"></i> උපන් දින සහ විශේෂ අංක
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                    <span className="text-slate-400">උපන් දින අංකය:</span>
                    <span className="text-2xl font-bold text-white">{results.compoundNumbers.birth}</span>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 flex flex-col gap-1">
                    <span className="text-slate-400 text-sm">කර්ම ණය සහ මාස්ටර් අංක:</span>
                    <div className="flex gap-2">
                      {results.karmicDebts.length > 0 ? (
                        results.karmicDebts.map(d => <span key={d} className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-bold border border-red-500/30">කර්ම ණය {d}</span>)
                      ) : <span className="text-slate-500 text-xs italic">කර්ම ණය නැත</span>}
                      {results.masterNumbers.map(m => <span key={m} className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs font-bold border border-purple-500/30">Master {m}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Result */}
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl relative">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <i className="fas fa-scroll text-blue-400"></i> දීර්ඝ පලාපල විස්තරය
                </h2>
                <button
                  onClick={downloadReport}
                  className="w-full sm:w-auto px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm transition-all flex items-center justify-center gap-2 border border-slate-600"
                >
                  <i className="fas fa-file-download"></i> වාර්තාව බාගන්න (HTML)
                </button>
              </div>
              <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap font-light text-lg">
                {reading}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-4xl mx-auto mt-20 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} Chaldean Numerology Pro. Created for personal guidance.</p>
      </footer>
    </div>
  );
};

const ResultCard: React.FC<{ title: string; value: string | number; icon: string; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 hover:border-slate-500 transition-all text-center">
    <div className={`mb-3 text-3xl ${color}`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <div className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-widest">{title}</div>
    <div className="text-lg font-bold text-white break-words">{value}</div>
  </div>
);

export default App;
