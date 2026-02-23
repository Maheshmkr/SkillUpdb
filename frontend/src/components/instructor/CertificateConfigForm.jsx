import React from 'react';
import { Award, ShieldCheck, Settings2, Info } from 'lucide-react';

export default function CertificateConfigForm({ config, setConfig, modules }) {
    const updateConfig = (field, value) => {
        setConfig({ ...config, [field]: value });
    };

    return (
        <div className="max-w-3xl mx-auto space-y-10">
            <div className="bg-blue-600 rounded-3xl p-10 text-white shadow-xl shadow-blue-100 flex flex-col md:flex-row items-center gap-10">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                    <Award size={64} />
                </div>
                <div>
                    <h3 className="text-3xl font-black mb-2">Professional Certification</h3>
                    <p className="text-blue-100 leading-relaxed">
                        Encourage completion by offering a verified professional certificate. Students are 3x more likely to finish a course with certification.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between p-6 border border-gray-200 rounded-2xl bg-white shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${config.enabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">Enable Certification</h4>
                            <p className="text-xs text-gray-500">Issue a certificate upon course completion.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => updateConfig('enabled', !config.enabled)}
                        className={`w-14 h-8 rounded-full transition-all relative ${config.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${config.enabled ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>

                {config.enabled && (
                    <div className="p-8 border border-gray-200 rounded-2xl bg-white shadow-sm space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="space-y-4">
                            <h4 className="text-sm font-black text-gray-900 flex items-center gap-2 uppercase tracking-widest">
                                <Settings2 size={16} /> Completion Criteria
                            </h4>
                            <p className="text-xs text-gray-500 bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-center gap-2">
                                <Info size={14} className="text-blue-500" />
                                Select which items students MUST complete to earn the certificate.
                            </p>

                            <div className="space-y-3">
                                <label className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input
                                        type="radio"
                                        name="criteria"
                                        checked={config.criteria === 'all'}
                                        onChange={() => updateConfig('criteria', 'all')}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <div className="flex-1">
                                        <span className="text-sm font-bold text-gray-800">Complete All Modules & Quizzes</span>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Recommended for professional mastery</p>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input
                                        type="radio"
                                        name="criteria"
                                        checked={config.criteria === 'selected'}
                                        onChange={() => updateConfig('criteria', 'selected')}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <div className="flex-1">
                                        <span className="text-sm font-bold text-gray-800">Specific Milestone Completion</span>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Choose specific modules or critical quizzes</p>
                                    </div>
                                </label>
                            </div>

                            {config.criteria === 'selected' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8 py-4 border-l-2 border-blue-100 transition-all">
                                    {modules.map(mod => (
                                        <label key={mod.id} className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={config.requiredModules?.includes(mod.id)}
                                                onChange={(e) => {
                                                    const current = config.requiredModules || [];
                                                    const updated = e.target.checked ? [...current, mod.id] : current.filter(id => id !== mod.id);
                                                    updateConfig('requiredModules', updated);
                                                }}
                                                className="rounded text-blue-600 focus:ring-blue-500"
                                            />
                                            <span>{mod.title}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <h4 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest">Certificate Preview</h4>
                            <div className="aspect-[4/3] bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-300 font-mono text-xs">
                                Certificate Layout Preview Rendering...
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
